using DAL.Enums;
using DAL.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using BLL.Hubs;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EVAndBatteryTradingAPI.Services
{
    public class AuctionStatusUpdater : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<AuctionStatusUpdater> _logger;

        public AuctionStatusUpdater(IServiceScopeFactory scopeFactory, ILogger<AuctionStatusUpdater> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var cycleStart = DateTime.UtcNow;
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var auctionRepo = scope.ServiceProvider.GetRequiredService<IAuctionRepository>();
                    var bidRepo = scope.ServiceProvider.GetRequiredService<IBidRepository>();
                    var listingRepo = scope.ServiceProvider.GetRequiredService<IListingRepository>();
                    var orderRepo = scope.ServiceProvider.GetRequiredService<IOrderRepository>();
                    var hub = scope.ServiceProvider.GetRequiredService<IHubContext<AuctionHub>>();

                    var now = DateTime.UtcNow;

                    // Start due auctions
                    var toStart = await auctionRepo.GetAuctionsToStartAsync(now);
                    _logger.LogInformation("AuctionStatusUpdater: starting {Count} auctions", toStart?.Count ?? 0);
                    foreach (var a in toStart)
                    {
                        a.Status = AuctionStatus.Active;
                        await auctionRepo.UpdateAuction(a);
                        await hub.Clients.Group($"auction_{a.AuctionId}").SendAsync("AuctionStatusChanged", new
                        {
                            auctionId = a.AuctionId,
                            status = "Active",
                            timestamp = DateTime.UtcNow
                        }, stoppingToken);
                    }

                    // End due auctions
                    var toEnd = await auctionRepo.GetAuctionsToEndAsync(now);
                    _logger.LogInformation("AuctionStatusUpdater: ending {Count} auctions", toEnd?.Count ?? 0);
                    foreach (var a in toEnd)
                    {
                        // Pick highest bid if any
                        var highestBid = a.Bids?
                                .OrderByDescending(b => b.Amount)
                                .ThenBy(b => b.CreatedAt ?? DateTime.MinValue)
                                .FirstOrDefault()
                            ?? await bidRepo.GetHighestBid(a.AuctionId);

                        if (highestBid != null)
                        {
                            a.CurrentWinnerId = highestBid.BidderId;
                            a.CurrentPrice = highestBid.Amount;

                            // Create order for winner and seller
                            var listing = a.Listing ?? await listingRepo.GetByIdAsync(a.ListingId);
                            if (listing != null)
                            {
                                var order = new DAL.Models.Order
                                {
                                    ListingId = a.ListingId,
                                    BuyerId = highestBid.BidderId,
                                    SellerId = listing.MemberId,
                                    OrderAmount = highestBid.Amount,
                                    Status = OrderStatus.Pending,
                                    CreatedAt = DateTime.UtcNow
                                };
                                await orderRepo.CreateOrder(order);
                            }
                            else
                            {
                                // Listing missing, avoid leaving inconsistent winner without an order
                                _logger.LogWarning("AuctionStatusUpdater: listing {ListingId} not found when ending auction {AuctionId}. Clearing winner.", a.ListingId, a.AuctionId);
                                a.CurrentWinnerId = null;
                                a.CurrentPrice = null;
                            }
                        }

                        a.Status = AuctionStatus.Ended;
                        await auctionRepo.UpdateAuction(a);

                        await hub.Clients.Group($"auction_{a.AuctionId}").SendAsync("AuctionStatusChanged", new
                        {
                            auctionId = a.AuctionId,
                            status = "Ended",
                            timestamp = DateTime.UtcNow,
                            winnerId = a.CurrentWinnerId,
                            finalPrice = a.CurrentPrice
                        }, stoppingToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in AuctionStatusUpdater cycle");
                }

                var elapsed = DateTime.UtcNow - cycleStart;
                var delay = TimeSpan.FromMinutes(1) - elapsed;
                if (delay < TimeSpan.Zero) delay = TimeSpan.FromSeconds(5);
                try
                {
                    await Task.Delay(delay, stoppingToken);
                }
                catch (TaskCanceledException) { }
            }
        }
    }
}


