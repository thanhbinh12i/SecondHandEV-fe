using BLL.DTO;
using BLL.Interfaces;
using EVAndBatteryTradingAPI.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EVAndBatteryTradingAPI.Controllers
{
    [Route("api/order")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrderController> _logger;

        public OrderController(IOrderService orderService, ILogger<OrderController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        // Create Order
/*        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Request body is required" });
                }
                var memberId = User.GetLoggedInMemberId();
                var order = await _orderService.CreateOrder(request, memberId);

                return Ok(new
                {
                    success = true,
                    message = "Order created successfully",
                    data = order
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error creating order");
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Business rule violation creating order");
                return Conflict(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }
*/
        // Get Order by ID
        [HttpGet("{orderId:int}")]
        public async Task<IActionResult> GetOrderById(int orderId)
        {
            try
            {
                if (orderId <= 0)
                    return BadRequest(new { success = false, message = "Invalid order ID" });

                var order = await _orderService.GetOrderById(orderId);
                if (order == null)
                    return NotFound(new { success = false, message = "Order not found" });

                return Ok(new { success = true, message = "Order retrieved successfully", data = order });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order {OrderId}", orderId);
                return StatusCode(500, new { success = false, message = "Error retrieving order" });
            }
        }

        // Get All Orders
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders([FromQuery] string? sortBy = null, [FromQuery] string? sortDir = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var result = await _orderService.GetAllOrders(page, pageSize, sortBy, sortDir);
                return Ok(new { success = true, message = result.TotalItems == 0 ? "No orders found" : "Orders retrieved successfully", data = result.Items, page = result.Page, pageSize = result.PageSize, total = result.TotalItems });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all orders");
                return StatusCode(500, new { success = false, message = "Error retrieving orders" });
            }
        }

        // Get Orders by Buyer
        [HttpGet("buyer/{buyerId:int}")]
        public async Task<IActionResult> GetOrdersByBuyerId(int buyerId, [FromQuery] string? sortBy = null, [FromQuery] string? sortDir = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                if (buyerId <= 0)
                    return BadRequest(new { success = false, message = "Invalid buyer ID" });

                var result = await _orderService.GetOrdersByBuyerId(buyerId, page, pageSize, sortBy, sortDir);
                return Ok(new { success = true, message = result.TotalItems > 0 ? "Orders retrieved successfully" : "No orders found for this buyer", data = result.Items, page = result.Page, pageSize = result.PageSize, total = result.TotalItems });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders for buyer {BuyerId}", buyerId);
                return StatusCode(500, new { success = false, message = "Error retrieving buyer orders" });
            }
        }

        // Get Orders by Seller
        [HttpGet("seller/{sellerId:int}")]
        public async Task<IActionResult> GetOrdersBySellerId(int sellerId, [FromQuery] string? sortBy = null, [FromQuery] string? sortDir = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                if (sellerId <= 0)
                    return BadRequest(new { success = false, message = "Invalid seller ID" });

                var result = await _orderService.GetOrdersBySellerId(sellerId, page, pageSize, sortBy, sortDir);
                return Ok(new { success = true, message = result.TotalItems > 0 ? "Orders retrieved successfully" : "No orders found for this seller", data = result.Items, page = result.Page, pageSize = result.PageSize, total = result.TotalItems });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders for seller {SellerId}", sellerId);
                return StatusCode(500, new { success = false, message = "Error retrieving seller orders" });
            }
        }

        // Update Order
        [HttpPut("{orderId:int}")]
        public async Task<IActionResult> UpdateOrder(int orderId, [FromBody] OrderUpdateRequest request)
        {
            try
            {
                if (orderId <= 0 || request == null)
                    return BadRequest(new { success = false, message = "Invalid order ID or request body" });

                var result = await _orderService.UpdateOrder(orderId, request);

                return Ok(new { success = true, message = "Order updated successfully", data = result });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Order not found for update (ID: {OrderId})", orderId);
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid update data for order {OrderId}", orderId);
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order {OrderId}", orderId);
                return StatusCode(500, new { success = false, message = "Error updating order" });
            }
        }

        // Delete Order
        [HttpDelete("{orderId:int}")]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            try
            {
                if (orderId <= 0)
                    return BadRequest(new { success = false, message = "Invalid order ID" });

                await _orderService.DeleteOrder(orderId);

                return Ok(new { success = true, message = "Order deleted successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Attempt to delete non-existing order {OrderId}", orderId);
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting order {OrderId}", orderId);
                return StatusCode(500, new { success = false, message = "Error deleting order" });
            }
        }

        // Get Orders for Current User
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders([FromQuery] string? sortBy = null, [FromQuery] string? sortDir = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = User.GetLoggedInMemberId();
                var result = await _orderService.GetOrdersByBuyerId(userId, page, pageSize, sortBy, sortDir);
                return Ok(new { success = true, message = result.TotalItems > 0 ? "Your orders retrieved successfully" : "No orders found", data = result.Items, page = result.Page, pageSize = result.PageSize, total = result.TotalItems });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving current user's orders");
                return StatusCode(500, new { success = false, message = "Error retrieving your orders" });
            }
        }
    }
}