using BLL.DTO;
using BLL.Interfaces;
using EVAndBatteryTradingAPI.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EVAndBatteryTradingAPI.Controllers
{
    [Route("api/payment")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IOrderService _orderService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IPaymentService paymentService, IOrderService orderService, ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _orderService = orderService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayment(int listingId)
        {
            try
            {
                var user = User.GetLoggedInMemberId();
                var order = await _orderService.CreateOrder(listingId, user);
                var payment = await _paymentService.CreatePayment(order.OrderId);

                return CreatedAtAction(
                    nameof(GetPaymentById),
                    new { paymentId = payment.PaymentId },
                    new { success = true, message = "Payment created successfully", data = payment }
                );
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error creating payment");
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Business rule violation while creating payment");
                return Conflict(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment");
                return StatusCode(500, new { success = false, message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("{paymentId}")]
        public async Task<IActionResult> GetPaymentById(int paymentId)
        {
            try
            {
                if (paymentId <= 0)
                    return BadRequest(new { success = false, message = "Invalid payment ID" });

                var payment = await _paymentService.GetPaymentById(paymentId);

                if (payment == null)
                    return NotFound(new { success = false, message = "Payment not found" });

                return Ok(new { success = true, message = "Payment retrieved successfully", data = payment });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving payment {PaymentId}", paymentId);
                return StatusCode(500, new { success = false, message = "Error retrieving payment", error = ex.Message });
            }
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetPaymentsByOrder(int orderId)
        {
            try
            {
                if (orderId <= 0)
                    return BadRequest(new { success = false, message = "Invalid order ID" });

                var payments = await _paymentService.GetPaymentsByOrderId(orderId);

                if (payments == null || payments.Count == 0)
                    return Ok(new { success = true, message = "No payments found for this order", data = new List<PaymentResponse>(), count = 0 });

                return Ok(new
                {
                    success = true,
                    message = "Payments retrieved successfully",
                    data = payments,
                    count = payments.Count                   
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving payments for order {OrderId}", orderId);
                return StatusCode(500, new { success = false, message = "Error retrieving payments", error = ex.Message });
            }
        }

        [HttpPut("{paymentId}")]
        public async Task<IActionResult> UpdatePayment(int paymentId, [FromBody] PaymentUpdateRequest request)
        {
            try
            {
                if (paymentId <= 0 || request == null)
                    return BadRequest(new { success = false, message = "Invalid payment ID or request" });

                var result = await _paymentService.UpdatePayment(paymentId, request);

                return Ok(new { success = true, message = "Payment updated successfully" , data = result});
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { success = false, message = "Payment not found" });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error updating payment");
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payment {PaymentId}", paymentId);
                return StatusCode(500, new { success = false, message = "Error updating payment", error = ex.Message });
            }
        }

        [HttpDelete("{paymentId}")]
        public async Task<IActionResult> DeletePayment(int paymentId)
        {
            try
            {
                if (paymentId <= 0)
                    return BadRequest(new { success = false, message = "Invalid payment ID" });

                await _paymentService.DeletePayment(paymentId);

                return Ok(new { success = true, message = "Payment deleted successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { success = false, message = "Payment not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting payment {PaymentId}", paymentId);
                return StatusCode(500, new { success = false, message = "Error deleting payment", error = ex.Message });
            }
        }
    }
}
