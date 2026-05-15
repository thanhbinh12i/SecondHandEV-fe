using Azure;
using BLL.DTO;
using BLL.Interfaces;
using DAL.Enums;
using DAL.Interfaces;
using DAL.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(IPaymentRepository paymentRepository, IOrderRepository orderRepository, ILogger<PaymentService> logger)
        {
            _paymentRepository = paymentRepository;
            _orderRepository = orderRepository;
            _logger = logger;
        }

        public async Task<PaymentResponse> CreatePayment(int orderId)
        {
            if (orderId <= 0)
                throw new ArgumentException("Invalid OrderId.");

/*            var existingPayments = await _paymentRepository.GetPaymentsByOrderId(orderId);
            if (existingPayments.Count > 0)
                throw new InvalidOperationException("Payment for this OrderId already exists.");*/
            var order = await _orderRepository.GetOrderById(orderId);
            if(order == null)
                throw new KeyNotFoundException("Order not found.");
            var payment = new Payment
            {
                OrderId = orderId,
                Amount = order.OrderAmount,
                Provider = "PayOS",
                Status = 0,
                CreatedAt = DateTime.UtcNow
            };

            var response = await _paymentRepository.CreatePayment(payment);
            _logger.LogInformation("Payment created for OrderId: {OrderId}, Amount: {Amount}", payment.OrderId, payment.Amount);
            return MapToResponse(response!);
        }

        public async Task DeletePayment(int paymentId)
        {
            var existingPayment = await _paymentRepository.GetPaymentById(paymentId);
            if (existingPayment == null)
                throw new KeyNotFoundException("Payment not found.");

            await _paymentRepository.DeletePayment(paymentId);
            _logger.LogInformation("Payment deleted (ID: {PaymentId})", paymentId);
        }

        public async Task<PaymentResponse?> GetPaymentById(int paymentId)
        {
            var payment = await _paymentRepository.GetPaymentById(paymentId);
            return payment == null ? null : MapToResponse(payment);
        }

        public async Task<List<PaymentResponse>> GetPaymentsByOrderId(int orderId)
        {
            var payments = await _paymentRepository.GetPaymentsByOrderId(orderId);
            return payments?.Select(MapToResponse).ToList() ?? new List<PaymentResponse>();
        }

        public async Task<PaymentResponse> UpdatePayment(int paymentId, PaymentUpdateRequest request)
        {
            var existingPayment = await _paymentRepository.GetPaymentById(paymentId);
            if (existingPayment == null)
                throw new KeyNotFoundException("Payment not found.");

            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                PaymentStatus statusState = request.Status.ToUpper() switch
                {
                    "PENDING" => PaymentStatus.Pending,
                    "COMPLETED" => PaymentStatus.Completed,
                    "FAILED" => PaymentStatus.Failed,
                    "CANCELLED" => PaymentStatus.Cancelled,
                    _ => existingPayment.Status
                };
                existingPayment.Status = statusState;
            }

            if (!string.IsNullOrWhiteSpace(request.ProviderRef))
                existingPayment.ProviderRef = request.ProviderRef;

            var response = await _paymentRepository.UpdatePayment(existingPayment);
            _logger.LogInformation("Payment updated (ID: {PaymentId})", paymentId);
            return MapToResponse(response!);
        }

        private static PaymentResponse MapToResponse(Payment payment)
        {
            return new PaymentResponse
            {
                PaymentId = payment.PaymentId,
                OrderId = payment.OrderId,
                Amount = payment.Amount,
                Provider = payment.Provider,
                Status = payment.Status.ToString(),
                CreatedAt = payment.CreatedAt
            };
        }
    }
}
