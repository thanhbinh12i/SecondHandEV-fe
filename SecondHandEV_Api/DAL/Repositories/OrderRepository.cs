using DAL.Interfaces;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(VehicleBatteryMarketDbContext context) : base(context)
        {
        }

        public async Task<Order> CreateOrder(Order order)
        {
            await AddAsync(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task DeleteOrder(int orderId)
        {
            var order = await GetByIdAsync(orderId);
            if (order != null)
            {
                Remove(order);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Order?> GetOrderById(int orderId)
        {
            return await _context.Orders.Include(x=>x.Listing).FirstOrDefaultAsync(x=>x.OrderId == orderId);
        }

        public Task<List<Order>> GetOrdersByBuyerId(int buyerId)
        {
            return _context.Orders.Where(o => o.BuyerId == buyerId).ToListAsync();
        }
        public Task<List<Order>> GetOrdersBySellerId(int sellerId)
        {
            return _context.Orders.Where(o => o.SellerId == sellerId).ToListAsync();
        }

        public async Task<Order> UpdateOrder(Order order)
        {
            Update(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<List<Order>> GetAllOrders()
        {
            return await _context.Orders.ToListAsync();
        }

        public async Task<(IReadOnlyList<Order> Items, int Total)> GetAllAsync(int page, int pageSize, string sortBy, bool asc)
        {
            var q = _context.Orders.AsNoTracking();
            var total = await q.CountAsync();
            (string sb, bool ascending) = ((sortBy ?? "createdAt").ToLower(), asc);
            q = (sb, ascending) switch
            {
                ("amount", true) => q.OrderBy(o => o.OrderAmount).ThenBy(o => o.OrderId),
                ("amount", false) => q.OrderByDescending(o => o.OrderAmount).ThenByDescending(o => o.OrderId),
                ("createdat", true) => q.OrderBy(o => o.CreatedAt).ThenBy(o => o.OrderId),
                _ => q.OrderByDescending(o => o.CreatedAt).ThenByDescending(o => o.OrderId)
            };
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return (items, total);
        }

        public async Task<(IReadOnlyList<Order> Items, int Total)> GetByBuyerAsync(int buyerId, int page, int pageSize, string sortBy, bool asc)
        {
            var q = _context.Orders.AsNoTracking().Where(o => o.BuyerId == buyerId);
            var total = await q.CountAsync();
            (string sb, bool ascending) = ((sortBy ?? "createdAt").ToLower(), asc);
            q = (sb, ascending) switch
            {
                ("amount", true) => q.OrderBy(o => o.OrderAmount).ThenBy(o => o.OrderId),
                ("amount", false) => q.OrderByDescending(o => o.OrderAmount).ThenByDescending(o => o.OrderId),
                ("createdat", true) => q.OrderBy(o => o.CreatedAt).ThenBy(o => o.OrderId),
                _ => q.OrderByDescending(o => o.CreatedAt).ThenByDescending(o => o.OrderId)
            };
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return (items, total);
        }

        public async Task<(IReadOnlyList<Order> Items, int Total)> GetBySellerAsync(int sellerId, int page, int pageSize, string sortBy, bool asc)
        {
            var q = _context.Orders.AsNoTracking().Where(o => o.SellerId == sellerId);
            var total = await q.CountAsync();
            (string sb, bool ascending) = ((sortBy ?? "createdAt").ToLower(), asc);
            q = (sb, ascending) switch
            {
                ("amount", true) => q.OrderBy(o => o.OrderAmount).ThenBy(o => o.OrderId),
                ("amount", false) => q.OrderByDescending(o => o.OrderAmount).ThenByDescending(o => o.OrderId),
                ("createdat", true) => q.OrderBy(o => o.CreatedAt).ThenBy(o => o.OrderId),
                _ => q.OrderByDescending(o => o.CreatedAt).ThenByDescending(o => o.OrderId)
            };
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return (items, total);
        }

        public async Task<Order> GetOrderByListingId(int listingId)
        {
            return await _context.Orders.FirstOrDefaultAsync(p=>p.ListingId == listingId);
        }
    }
}
