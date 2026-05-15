using BLL.DTO;
using BLL.Interfaces;
using EVAndBatteryTradingAPI.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Net.payOS;
using Net.payOS.Types;

namespace EVAndBatteryTradingAPI.Controllers
{
    [Route("api/payos")]
    [ApiController]
    [Authorize]
    public class PayOSPaymentController : ControllerBase
    {
        private readonly IPayOSPaymentService _payosPaymentService;
        private readonly IOrderService _orderService;
        private readonly PayOS _payOS;
        private readonly IConfiguration _configuration;
        private readonly ILogger<PayOSPaymentController> _logger;

        public PayOSPaymentController(
            IPayOSPaymentService payosPaymentService,
            IOrderService orderService,
            PayOS payOS,
            IConfiguration configuration,
            ILogger<PayOSPaymentController> logger)
        {
            _payosPaymentService = payosPaymentService;
            _orderService = orderService;
            _payOS = payOS;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("create-payment-link")]
        public async Task<IActionResult> CreatePaymentLink(int listingId, [FromBody] string Description)
        {
            try
            {
                var member = User.GetLoggedInMemberId();
                var order = await _orderService.CreateOrder(listingId, member);
                if (order == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Order not found"
                    });
                }
                var items = new List<ItemData>
                {
                    new ItemData(order.Listing.Title ?? "not sure", 1, ((int)order.OrderAmount))
                };


                var cancelUrl = $"{_configuration["PayOS:CancelUrl"]}?orderId={order.OrderId}";
                var returnUrl = $"{_configuration["PayOS:ReturnUrl"]}?orderId={order.OrderId}";

                var (success, payosPayment, paymentResult, error) = await _payosPaymentService.CreatePaymentLinkAsync(
                    order.OrderId,
                    2000,
                    Description ?? $"Payment for order {order.OrderId}",
                    items,
                    cancelUrl,
                    returnUrl
                );

                if (!success)
                {
                    _logger.LogError("Failed to create PayOS payment link: {Error}", error);
                    return BadRequest(new
                    {
                        success = false,
                        message = "Failed to create payment link",
                        error = error
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        orderCode = payosPayment?.OrderCode,
                        checkoutUrl = paymentResult?.checkoutUrl,
                        paymentLinkId = paymentResult?.paymentLinkId,
                        qrCode = paymentResult?.qrCode,
                        amount = order.OrderAmount
                    },
                    message = "Payment link created successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating PayOS payment link");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Internal server error",
                    error = ex.Message
                });
            }
        }

        [HttpGet("payment-info/{orderCode}")]
        public async Task<IActionResult> GetPaymentInfo(string orderCode)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(orderCode))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Order code is required"
                    });
                }

                var paymentInfo = await _payosPaymentService.GetPaymentInfoAsync(orderCode);

                if (paymentInfo == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Payment information not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        orderCode = paymentInfo.orderCode,
                        amount = paymentInfo.amount,
                        amountPaid = paymentInfo.amountPaid,
                        amountRemaining = paymentInfo.amountRemaining,
                        status = paymentInfo.status,
                        transactions = paymentInfo.transactions,
                        createdAt = paymentInfo.createdAt,
                        canceledAt = paymentInfo.canceledAt
                    },
                    message = "Payment information retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment info for order {OrderCode}", orderCode);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error retrieving payment information",
                    error = ex.Message
                });
            }
        }

        [HttpPost("cancel-payment/{orderCode}")]
        public async Task<IActionResult> CancelPayment(string orderCode, [FromBody] CancelPaymentRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(orderCode))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Order code is required"
                    });
                }

                var (success, error) = await _payosPaymentService.CancelPaymentAsync(
                    orderCode,
                    request?.CancellationReason ?? "Customer requested cancellation"
                );

                if (!success)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Failed to cancel payment",
                        error = error
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Payment cancelled successfully",
                    orderCode = orderCode
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling payment for order {OrderCode}", orderCode);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error cancelling payment",
                    error = ex.Message
                });
            }
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> PayOSWebhook([FromBody] WebhookType webhookData)
        {
            try
            {
                if (webhookData == null)
                {
                    return BadRequest(new { success = false, message = "Invalid webhook data" });
                }

                WebhookData verifiedData = _payOS.verifyPaymentWebhookData(webhookData);

                _logger.LogInformation("Webhook received for order {OrderCode} with code {Code}",
                    verifiedData.orderCode, verifiedData.code);

                var (success, error) = await _payosPaymentService.HandlePaymentWebhookAsync(verifiedData);

                if (!success)
                {
                    _logger.LogWarning("Error handling webhook: {Error}", error);
                    return BadRequest(new { success = false, error = error });
                }

                return Ok(new { success = true, message = "Webhook processed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing PayOS webhook");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error processing webhook",
                    error = ex.Message
                });
            }
        }

        [HttpPost("confirm-webhook")]
        [AllowAnonymous]
        public IActionResult ConfirmWebhook([FromBody] ConfirmWebhookRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request?.WebhookUrl))
                {
                    return BadRequest(new { success = false, message = "Webhook URL is required" });
                }

                _payOS.confirmWebhook(request.WebhookUrl);
                return Ok(new { success = true, message = "Webhook confirmed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error confirming webhook");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error confirming webhook",
                    error = ex.Message
                });
            }
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetPaymentsByOrder(int orderId)
        {
            try
            {
                if (orderId <= 0)
                {
                    return BadRequest(new { success = false, message = "Invalid order ID" });
                }

                var payments = await _payosPaymentService.GetPayOSPaymentsByOrderIdAsync(orderId);

                if (payments == null || payments.Count == 0)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "No PayOS payments found for this order"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = payments,
                    count = payments.Count,
                    message = "Payments retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving PayOS payments for order {OrderId}", orderId);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error retrieving payments",
                    error = ex.Message
                });
            }
        }

        [HttpGet("by-code/{orderCode}")]
        public async Task<IActionResult> GetPaymentByOrderCode(string orderCode)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(orderCode))
                {
                    return BadRequest(new { success = false, message = "Order code is required" });
                }

                var payment = await _payosPaymentService.GetPayOSPaymentByOrderCodeAsync(orderCode);

                if (payment == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Payment not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = payment,
                    message = "Payment retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving payment for order code {OrderCode}", orderCode);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error retrieving payment",
                    error = ex.Message
                });
            }
        }
    }


}