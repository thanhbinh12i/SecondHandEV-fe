using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> CreateOrder(Order order);
        Task<Order?> GetOrderById(int orderId);
        Task<List<Order>> GetOrdersByBuyerId(int buyerId);
        Task<List<Order>> GetOrdersBySellerId(int sellerId);
        Task<Order> GetOrderByListingId(int listingId);
        Task<Order> UpdateOrder(Order order);
        
        Task DeleteOrder(int orderId);
        Task<List<Order>> GetAllOrders();
        // Paged variants
        Task<(IReadOnlyList<Order> Items, int Total)> GetAllAsync(int page, int pageSize, string sortBy, bool asc);
        Task<(IReadOnlyList<Order> Items, int Total)> GetByBuyerAsync(int buyerId, int page, int pageSize, string sortBy, bool asc);
        Task<(IReadOnlyList<Order> Items, int Total)> GetBySellerAsync(int sellerId, int page, int pageSize, string sortBy, bool asc);
    }
}
