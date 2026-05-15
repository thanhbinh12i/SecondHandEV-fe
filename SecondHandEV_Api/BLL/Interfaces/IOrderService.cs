using BLL.DTO;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IOrderService
    {
        Task<OrderResponse> CreateOrder(int listingId, int memberId);
        Task<OrderResponse?> GetOrderById(int orderId);
        // Task<List<OrderResponse>> GetOrdersByBuyerId(int buyerId);
        // Task<List<OrderResponse>> GetOrdersBySellerId(int sellerId);
        Task<PagedResult<OrderResponse>> GetOrdersByBuyerId(int buyerId, int page, int pageSize, string? sortBy, string? sortDir);
        Task<PagedResult<OrderResponse>> GetOrdersBySellerId(int sellerId, int page, int pageSize, string? sortBy, string? sortDir);
        Task<OrderResponse> UpdateOrder(int orderId, OrderUpdateRequest order);
        Task DeleteOrder(int orderId);
        // Task<List<OrderResponse>?> GetAllOrders();
        Task<PagedResult<OrderResponse>> GetAllOrders(int page, int pageSize, string? sortBy, string? sortDir);
    }
}
