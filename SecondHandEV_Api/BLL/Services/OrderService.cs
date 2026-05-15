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
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IListingRepository _listingRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly ILogger<OrderService> _logger;

        public OrderService(
            IOrderRepository orderRepository,
            IListingRepository listingRepository,
            IMemberRepository memberRepository,
            ILogger<OrderService> logger)
        {
            _orderRepository = orderRepository;
            _listingRepository = listingRepository;
            _memberRepository = memberRepository;
            _logger = logger;
        }

        public async Task<OrderResponse> CreateOrder(int listingId, int memberId)
        {
            var listing = await _listingRepository.GetByIdAsync(listingId);
            if (listing == null)
            {
                _logger.LogWarning("Attempted to create order for non-existing listing (ID: {ListingId})", listingId);
                throw new KeyNotFoundException("Listing not found.");
            }

            if (memberId <= 0 || listing.MemberId <= 0)
            {
                _logger.LogWarning("Invalid BuyerId or SellerId during order creation.");
                throw new ArgumentException("Invalid BuyerId or SellerId.");
            }

            if (memberId == listing.MemberId)
            {
                _logger.LogWarning("Attempted to create order with same Buyer and Seller.");
                throw new InvalidOperationException("Buyer and Seller cannot be the same user.");
            }

            if (await _orderRepository.GetOrdersByBuyerId(memberId) is { Count: > 50 })
            {
                _logger.LogWarning("Buyer {BuyerId} has exceeded the maximum number of active orders.", memberId);
                throw new InvalidOperationException("Buyer has exceeded the maximum number of active orders.");
            }
            var orderExists = await _orderRepository.GetOrderByListingId(listingId);
            if (orderExists != null)
            {
                return await MapToResponseAsync(orderExists);
            }
            var order = new Order
            {
                ListingId = listingId,
                BuyerId = memberId,
                SellerId = listing.MemberId,
                OrderAmount = listing.Price,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _orderRepository.CreateOrder(order);
            return await MapToResponseAsync(created);
        }

        // public async Task<List<OrderResponse>> GetAllOrders()
        // {
        //     var orders = await _orderRepository.GetAllOrders();
        //     if (orders == null || orders.Count == 0)
        //     {
        //         _logger.LogInformation("No orders found in database.");
        //         return new List<OrderResponse>();
        //     }
        //
        //     var responses = new List<OrderResponse>();
        //     foreach (var order in orders)
        //     {
        //         responses.Add(await MapToResponseAsync(order));
        //     }
        //     return responses;
        // }

        public async Task<PagedResult<OrderResponse>> GetAllOrders(int page, int pageSize, string? sortBy, string? sortDir)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var (items, total) = await _orderRepository.GetAllAsync(page, pageSize, sortBy ?? "createdAt", (sortDir ?? "desc").Equals("asc", StringComparison.OrdinalIgnoreCase));
            var mapped = new List<OrderResponse>(items.Count);
            foreach (var o in items)
            {
                mapped.Add(await MapToResponseAsync(o));
            }
            return new PagedResult<OrderResponse>
            {
                Items = mapped,
                TotalItems = total,
                Page = page,
                PageSize = pageSize
            };
        }

        // public async Task<List<OrderResponse>> GetOrdersByBuyerId(int buyerId)
        // {
        //     var orders = await _orderRepository.GetOrdersByBuyerId(buyerId);
        //     if (orders == null || orders.Count == 0)
        //     {
        //         _logger.LogInformation("No orders found for BuyerId: {BuyerId}", buyerId);
        //         return new List<OrderResponse>();
        //     }
        //
        //     var responses = new List<OrderResponse>();
        //     foreach (var order in orders)
        //     {
        //         responses.Add(await MapToResponseAsync(order));
        //     }
        //     return responses;
        // }

        public async Task<PagedResult<OrderResponse>> GetOrdersByBuyerId(int buyerId, int page, int pageSize, string? sortBy, string? sortDir)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var (items, total) = await _orderRepository.GetByBuyerAsync(buyerId, page, pageSize, sortBy ?? "createdAt", (sortDir ?? "desc").Equals("asc", StringComparison.OrdinalIgnoreCase));
            var mapped = new List<OrderResponse>(items.Count);
            foreach (var o in items)
            {
                mapped.Add(await MapToResponseAsync(o));
            }
            return new PagedResult<OrderResponse>
            {
                Items = mapped,
                TotalItems = total,
                Page = page,
                PageSize = pageSize
            };
        }

        // public async Task<List<OrderResponse>> GetOrdersBySellerId(int sellerId)
        // {
        //     var orders = await _orderRepository.GetOrdersBySellerId(sellerId);
        //     if (orders == null || orders.Count == 0)
        //     {
        //         _logger.LogInformation("No orders found for SellerId: {SellerId}", sellerId);
        //         return new List<OrderResponse>();
        //     }
        //
        //     var responses = new List<OrderResponse>();
        //     foreach (var order in orders)
        //     {
        //         responses.Add(await MapToResponseAsync(order));
        //     }
        //     return responses;
        // }

        public async Task<PagedResult<OrderResponse>> GetOrdersBySellerId(int sellerId, int page, int pageSize, string? sortBy, string? sortDir)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var (items, total) = await _orderRepository.GetBySellerAsync(sellerId, page, pageSize, sortBy ?? "createdAt", (sortDir ?? "desc").Equals("asc", StringComparison.OrdinalIgnoreCase));
            var mapped = new List<OrderResponse>(items.Count);
            foreach (var o in items)
            {
                mapped.Add(await MapToResponseAsync(o));
            }
            return new PagedResult<OrderResponse>
            {
                Items = mapped,
                TotalItems = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<OrderResponse> UpdateOrder(int orderId, OrderUpdateRequest request)
        {
            var existing = await _orderRepository.GetOrderById(orderId);
            if (existing == null)
            {
                _logger.LogWarning("Order {OrderId} not found for update.", orderId);
                throw new KeyNotFoundException("Order not found.");
            }

            if (!string.IsNullOrWhiteSpace(request.OrderStatus))
            {
                if (!Enum.TryParse<OrderStatus>(request.OrderStatus, true, out var newStatus))
                {
                    throw new ArgumentException("Invalid order status.");
                }
                existing.Status = newStatus;
            }

            var updated = await _orderRepository.UpdateOrder(existing);
            return await MapToResponseAsync(updated);
        }

        public async Task DeleteOrder(int orderId)
        {
            var order = await _orderRepository.GetOrderById(orderId);
            if (order == null)
            {
                _logger.LogWarning("Attempt to delete non-existing order {OrderId}", orderId);
                throw new KeyNotFoundException("Order not found.");
            }
            await _orderRepository.DeleteOrder(orderId);
        }

        public async Task<OrderResponse?> GetOrderById(int orderId)
        {
            var order = await _orderRepository.GetOrderById(orderId);
            return order == null ? null : await MapToResponseAsync(order);
        }

        private async Task<OrderResponse> MapToResponseAsync(Order order)
        {
            var buyer = await _memberRepository.GetByIdAsync(order.BuyerId);
            var seller = await _memberRepository.GetByIdAsync(order.SellerId);
            var listing = await _listingRepository.GetByIdAsync(order.ListingId);

            return new OrderResponse
            {
                OrderId = order.OrderId,
                Listing = new ListingInfoDto { ListingId = listing?.ListingId ?? order.ListingId, Title = listing?.Title, Description = listing?.Description, Price = listing?.Price ?? 0, CommissionPrice= listing?.CommissionPrice, ListingType = listing?.ListingType },
                Buyer = new MemberInfoDto { MemberId = buyer?.MemberId ?? order.BuyerId, DisplayName = buyer?.DisplayName, Email = buyer?.Email, Phone = buyer?.Phone },
                Seller = new MemberInfoDto { MemberId = seller?.MemberId ?? order.SellerId, DisplayName = seller?.DisplayName, Email = seller?.Email, Phone = seller?.Phone },
                OrderAmount = order.OrderAmount,
                OrderStatus = order.Status.ToString(),
                CreatedAt = order.CreatedAt
            };
        }
    }
}