using BLL.Helpers;
using BLL.Interfaces;
using DAL.Enums;
using DAL.Interfaces;
using DAL.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Net.payOS;
using Net.payOS.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class PayOSPaymentService : IPayOSPaymentService
    {
        private readonly IPayOSPaymentRepository _paymentOSRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IPaymentService _paymentService;
        private readonly PayOS _payOS;
        private readonly ILogger<PayOSPaymentService> _logger;
        private readonly IConfiguration _configuration;
        public PayOSPaymentService(
            IPayOSPaymentRepository paymentOSRepository,
            IPaymentRepository paymentRepository,
            IPaymentService paymentService,
            PayOS payOS,
            ILogger<PayOSPaymentService> logger,
            IConfiguration configuration
            )
        {
            _paymentOSRepository = paymentOSRepository;
            _paymentRepository = paymentRepository;
            _paymentService = paymentService;
            _payOS = payOS;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<(bool Success, PayOSPayment? PayOSPayment, CreatePaymentResult? PaymentResult, string? Error)>
            CreatePaymentLinkAsync(int orderId, decimal amount, string description, List<ItemData> items, string cancelUrl, string returnUrl)
        {

            try
            {
                // Generate unique order code (timestamp-based)
                string orderCode = GenerateOrderCode(orderId);
                if (string.IsNullOrWhiteSpace(orderCode))
                {
                    throw new InvalidOperationException("Failed to generate order code.");
                }
                if (amount <= 0)
                {
                    throw new ArgumentException("Amount must be greater than zero.");
                }
                if (items == null || items.Count == 0)
                {
                    throw new ArgumentException("At least one item must be provided for the payment.");
                }
                if (string.IsNullOrWhiteSpace(cancelUrl) || string.IsNullOrWhiteSpace(returnUrl))
                {
                    throw new ArgumentException("Cancel and return URLs must be provided.");
                }
                if (description.Length > 255)
                {
                    throw new ArgumentException("Description is too long.");
                }
                if (await _paymentOSRepository.GetPayOSPaymentByOrderCode(orderCode) != null)
                {
                    throw new InvalidOperationException("A PayOS payment with this order code already exists.");
                }
                if (await _paymentRepository.GetPaymentsByOrderId(orderId) is { Count: > 100 })
                {
                    throw new InvalidOperationException("Too many payments exist for this order.");
                }
                /*                var existingPayments = await _paymentRepository.GetPaymentsByOrderId(orderId);
                                if (existingPayments.Count > 0)
                                {
                                    throw new InvalidOperationException("A payment for this order already exists.");
                                }*/
                if (description == null)
                {
                    description = $"Payment for order {orderId}";
                }
                long numericOrderCode = ExtractNumericOrderCode(orderCode);
                // Create PaymentData for PayOS
                var paymentData = new PaymentData(
                    orderCode: numericOrderCode/*long.Parse(orderCode.Replace("ORD_", "").Split("_")[2])*/,
                    amount: ((int)amount),
                    description: description,
                    items: items,
                    cancelUrl: cancelUrl,
                    returnUrl: returnUrl,
                    signature: PayOSHelper.GenerateSignature(((int)amount).ToString(), cancelUrl, description, orderCode, returnUrl, _configuration["PayOS:ChecksumKey"])
                );

                // Call PayOS API to create payment link
                CreatePaymentResult paymentResult = await _payOS.createPaymentLink(paymentData);

                _logger.LogInformation("PayOS payment link created for order {OrderId} with code {OrderCode}",
                    orderId, orderCode);
                var payment = await _paymentService.CreatePayment(orderId);

                // Save PayOS payment to database
                var payosPayment = new PayOSPayment
                {
                    OrderCode = orderCode,
                    PaymentId = payment.PaymentId,
                    CheckoutUrl = paymentResult.checkoutUrl,
                    Qrcode = paymentResult.qrCode,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _paymentOSRepository.CreatePayOSPayment(payosPayment);

                return (true, payosPayment, paymentResult, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating PayOS payment link for order {OrderId}", orderId);
                return (false, null, null, ex.Message);
            }
        }

        /// <summary>
        /// Get payment information from PayOS
        /// </summary>
        public async Task<PaymentLinkInformation?> GetPaymentInfoAsync(string orderCode)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(orderCode))
                {
                    throw new ArgumentException("Order code cannot be empty", nameof(orderCode));
                }

                // Parse order code to get numeric value for PayOS API
                long numericOrderCode = ExtractNumericOrderCode(orderCode);

                PaymentLinkInformation paymentInfo = await _payOS.getPaymentLinkInformation(numericOrderCode);

                _logger.LogInformation("Retrieved payment info for order {OrderCode}", orderCode);

                return paymentInfo;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving payment info for order {OrderCode}", orderCode);
                return null;
            }
        }

        /// <summary>
        /// Cancel a PayOS payment
        /// </summary>
        public async Task<(bool Success, string? Error)> CancelPaymentAsync(string orderCode, string cancellationReason)
        {
            try
            {
                long numericOrderCode = ExtractNumericOrderCode(orderCode);

                PaymentLinkInformation cancelledPayment = await _payOS.cancelPaymentLink(
                    numericOrderCode,
                    cancellationReason
                );

                // Update PayOS payment record in database
                var payosPayment = await _paymentOSRepository.GetPayOSPaymentByOrderCode(orderCode);
                if (payosPayment != null)
                {
                    payosPayment.CancelReason = cancellationReason;
                    payosPayment.UpdatedAt = DateTime.UtcNow;
                    await _paymentOSRepository.UpdatePayOSPayment(payosPayment);
                }

                _logger.LogInformation("Payment cancelled for order {OrderCode}", orderCode);

                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling payment for order {OrderCode}", orderCode);
                return (false, ex.Message);
            }
        }

        /// <summary>
        /// Handle PayOS webhook callback
        /// </summary>
        public async Task<(bool Success, string? Error)> HandlePaymentWebhookAsync(WebhookData verifiedData)
        {
            try
            {
                string orderCode = $"ORD_{verifiedData.orderCode}";
                var payosPayment = await _paymentOSRepository.GetPayOSPaymentByOrderCode(orderCode);

                if (payosPayment == null)
                {
                    _logger.LogWarning("PayOS payment not found for order code {OrderCode}", orderCode);
                    return (false, "Payment record not found");
                }

                // Handle different payment statuses
                switch (verifiedData.code)
                {
                    case "00": // Payment successful
                        await HandleSuccessfulPayment(payosPayment, verifiedData);
                        break;
                    case "01": // Payment failed
                        await HandleFailedPayment(payosPayment);
                        break;
                    case "02": // Payment cancelled
                        await HandleCancelledPayment(payosPayment);
                        break;
                    default:
                        _logger.LogWarning("Unknown webhook code: {Code} for order {OrderCode}",
                            verifiedData.code, orderCode);
                        break;
                }

                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling payment webhook");
                return (false, ex.Message);
            }
        }

        public async Task<PayOSPayment?> GetPayOSPaymentByOrderCodeAsync(string orderCode)
        {
            var payOSPayment = await _paymentOSRepository.GetPayOSPaymentByOrderCode(orderCode);
            if (payOSPayment == null)
            {
                _logger.LogInformation("No PayOS payment found for order code {OrderCode}", orderCode);
            }
            return payOSPayment;
        }

        public async Task<PayOSPayment?> GetPayOSPaymentByPaymentIdAsync(int paymentId)
        {
            var payOSPayment = await _paymentOSRepository.GetPayOSPaymentByPaymentId(paymentId);
            if (payOSPayment == null)
            {
                _logger.LogInformation("No PayOS payment found for payment ID {PaymentId}", paymentId);
            }
            return payOSPayment;
        }

        public async Task<List<PayOSPayment>?> GetPayOSPaymentsByOrderIdAsync(int orderId)
        {
            var payOSPayments = await _paymentOSRepository.GetPayOSPaymentsByOrderId(orderId);
            if (payOSPayments == null || payOSPayments.Count == 0)
            {
                _logger.LogInformation("No PayOS payments found for order ID {OrderId}", orderId);
            }
            return payOSPayments;
        }

        public async Task<bool> UpdatePaymentStatusAsync(string orderCode, string status, DateTime? paidAt = null)
        {
            try
            {
                var payosPayment = await _paymentOSRepository.GetPayOSPaymentByOrderCode(orderCode);
                if (payosPayment == null)
                {
                    return false;
                }

                // Update related Payment status
                if (payosPayment.Payment != null)
                { 
                    PaymentStatus statusInt = status.ToUpper() switch
                    {
                        "PENDING" => PaymentStatus.Pending,
                        "COMPLETED" => PaymentStatus.Completed,
                        "FAILED" => PaymentStatus.Failed,
                        "CANCELLED" => PaymentStatus.Cancelled,
                        _ => payosPayment.Payment.Status
                    };
                    payosPayment.Payment.Status = statusInt;
                    await _paymentRepository.UpdatePayment(payosPayment.Payment);
                }

                payosPayment.PaidAt = paidAt ?? (status == "Completed" ? DateTime.UtcNow : null);
                payosPayment.UpdatedAt = DateTime.UtcNow;

                await _paymentOSRepository.UpdatePayOSPayment(payosPayment);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payment status for order {OrderCode}", orderCode);
                return false;
            }
        }

        public async Task<bool> DeletePayOSPaymentAsync(int payosPaymentId)
        {
            try
            {
                await _paymentOSRepository.DeletePayOSPayment(payosPaymentId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting PayOS payment {PayOSPaymentId}", payosPaymentId);
                return false;
            }
        }

        // ============================================
        // Private Helper Methods
        // ============================================

        private string GenerateOrderCode(int orderId)
        {
            // Use timestamp as the main identifier
            long timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            return $"ORD_{orderId}_{timestamp}";
        }

        private long ExtractNumericOrderCode(string orderCode)
        {
            // Extract the timestamp part which is sent to PayOS
            var parts = orderCode.Split('_');
            if (parts.Length >= 3 && long.TryParse(parts[2], out var timestamp))
                return timestamp;

            throw new InvalidOperationException($"Invalid order code format: {orderCode}");
        }

        private async Task HandleSuccessfulPayment(PayOSPayment payosPayment, WebhookData data)
        {
            _logger.LogInformation("Processing successful payment for order {OrderCode}", payosPayment.OrderCode);

            try
            {
                payosPayment.PaidAt = DateTime.UtcNow;
                payosPayment.UpdatedAt = DateTime.UtcNow;

                // Update related Payment
                if (payosPayment.Payment != null)
                {
                    payosPayment.Payment.Status = PaymentStatus.Completed;
                    await _paymentRepository.UpdatePayment(payosPayment.Payment);
                }

                await _paymentOSRepository.UpdatePayOSPayment(payosPayment);

                // TODO: Implement your business logic:
                // 1. Update order status to "PAID"
                // 2. Send confirmation email to customer
                // 3. Trigger fulfillment process
                // 4. Update inventory if applicable

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling successful payment for order {OrderCode}", payosPayment.OrderCode);
            }
        }

        private async Task HandleFailedPayment(PayOSPayment payosPayment)
        {
            _logger.LogWarning("Payment failed for order {OrderCode}", payosPayment.OrderCode);

            try
            {
                if (payosPayment.Payment != null)
                {
                    payosPayment.Payment.Status = PaymentStatus.Failed;
                    await _paymentRepository.UpdatePayment(payosPayment.Payment);
                }

                payosPayment.UpdatedAt = DateTime.UtcNow;
                await _paymentOSRepository.UpdatePayOSPayment(payosPayment);

                // TODO: Implement your business logic:
                // 1. Notify customer about failed payment
                // 2. Provide retry option
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling failed payment for order {OrderCode}", payosPayment.OrderCode);
            }
        }

        private async Task HandleCancelledPayment(PayOSPayment payosPayment)
        {
            _logger.LogInformation("Payment cancelled for order {OrderCode}", payosPayment.OrderCode);

            try
            {
                if (payosPayment.Payment != null)
                {
                    payosPayment.Payment.Status = PaymentStatus.Cancelled;
                    await _paymentRepository.UpdatePayment(payosPayment.Payment);
                }

                payosPayment.UpdatedAt = DateTime.UtcNow;
                await _paymentOSRepository.UpdatePayOSPayment(payosPayment);

                // TODO: Implement your business logic:
                // 1. Release reserved inventory
                // 2. Notify customer
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling cancelled payment for order {OrderCode}", payosPayment.OrderCode);
            }
        }
    }
}

