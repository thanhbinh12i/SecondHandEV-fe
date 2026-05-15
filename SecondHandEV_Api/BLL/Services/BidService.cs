using BLL.DTO;
using BLL.Interfaces;
using DAL.Interfaces;
using DAL.Models;
using DAL.Enums;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BLL.Hubs;

namespace BLL.Services
{
    public class BidService : IBidService
    {
        private readonly IBidRepository _bidRepository;
        private readonly IAuctionRepository _auctionRepository;
        private readonly IHubContext<AuctionHub> _hubContext;

        public BidService(
            IBidRepository bidRepository,
            IAuctionRepository auctionRepository,
            IHubContext<AuctionHub> hubContext)
        {
            _bidRepository = bidRepository;
            _auctionRepository = auctionRepository;
            _hubContext = hubContext;
        }

        public async Task<BidResponse> PlaceBid(int auctionId, BidCreateRequest request, int bidderId)
        {
            // Get auction with current bids
            var auction = await _auctionRepository.GetAuctionById(auctionId);
            if (auction == null)
            {
                throw new Exception("Auction not found.");
            }

            // Validate auction status
            if (auction.Status != AuctionStatus.Active)
            {
                throw new Exception("Auction is not active.");
            }

            // Validate auction timing
            var now = DateTime.UtcNow;
            if (now < auction.AuctionStart)
            {
                throw new Exception("Auction has not started yet.");
            }
            if (now > auction.AuctionEnd)
            {
                throw new Exception("Auction has ended.");
            }

            // Validate bidder is not the seller
            if (bidderId == auction.Listing.MemberId)
            {
                throw new Exception("Seller cannot bid on their own auction.");
            }

            // Validate bid amount
            var minAcceptableAmount = Math.Max(auction.CurrentPrice ?? auction.StartPrice, auction.StartPrice) + 1;
            if (request.Amount < minAcceptableAmount)
            {
                throw new Exception($"Bid amount must be greater than or equal to {minAcceptableAmount}.");
            }

            var bid = new Bid
            {
                AuctionId = auctionId,
                BidderId = bidderId,
                Amount = request.Amount,
                CreatedAt = DateTime.UtcNow
            };

            var createdBid = await _bidRepository.CreateBid(bid);

            var response = new BidResponse
            {
                BidId = createdBid.BidId,
                AuctionId = createdBid.AuctionId,
                BidderId = createdBid.BidderId,
                BidderName = createdBid.Bidder?.DisplayName ?? "Unknown",
                Amount = createdBid.Amount,
                CreatedAt = createdBid.CreatedAt ?? DateTime.UtcNow
            };

            // Send real-time update via SignalR
            await NotifyNewBid(auction.AuctionId, response);

            return response;
        }

        // public async Task<List<BidResponse>> GetBidsByAuctionId(int auctionId)
        // {
        //     var bids = await _bidRepository.GetBidsByAuctionId(auctionId);
        //     return bids.Select(b => new BidResponse
        //     {
        //         BidId = b.BidId,
        //         AuctionId = b.AuctionId,
        //         BidderId = b.BidderId,
        //         BidderName = b.Bidder?.DisplayName ?? "Unknown",
        //         Amount = b.Amount,
        //         CreatedAt = b.CreatedAt ?? DateTime.UtcNow
        //     }).OrderByDescending(b => b.Amount).ToList();
        // }

        // public async Task<List<BidResponse>> GetBidsByBidderId(int bidderId)
        // {
        //     var bids = await _bidRepository.GetBidsByBidderId(bidderId);
        //     return bids.Select(b => new BidResponse
        //     {
        //         BidId = b.BidId,
        //         AuctionId = b.AuctionId,
        //         BidderId = b.BidderId,
        //         Amount = b.Amount,
        //         CreatedAt = b.CreatedAt ?? DateTime.UtcNow
        //     }).OrderByDescending(b => b.CreatedAt).ToList();
        // }

        public async Task<PagedResult<BidResponse>> GetBidsByAuctionId(int auctionId, int page, int pageSize, string? sortBy, string? sortDir)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var (items, total) = await _bidRepository.GetByAuctionAsync(auctionId, page, pageSize, sortBy ?? "createdAt", (sortDir ?? "desc").Equals("asc", StringComparison.OrdinalIgnoreCase));
            var mapped = items.Select(b => new BidResponse
            {
                BidId = b.BidId,
                AuctionId = b.AuctionId,
                BidderId = b.BidderId,
                BidderName = b.Bidder?.DisplayName ?? "Unknown",
                Amount = b.Amount,
                CreatedAt = b.CreatedAt ?? DateTime.UtcNow
            }).ToList();
            return new PagedResult<BidResponse>
            {
                Items = mapped,
                TotalItems = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<BidResponse>> GetBidsByBidderId(int bidderId, int? auctionId, int page, int pageSize, string? sortBy, string? sortDir)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var (items, total) = await _bidRepository.GetByBidderAsync(bidderId, auctionId, page, pageSize, sortBy ?? "createdAt", (sortDir ?? "desc").Equals("asc", StringComparison.OrdinalIgnoreCase));
            var mapped = items.Select(b => new BidResponse
            {
                BidId = b.BidId,
                AuctionId = b.AuctionId,
                BidderId = b.BidderId,
                BidderName = b.Bidder?.DisplayName ?? "Unknown",
                Amount = b.Amount,
                CreatedAt = b.CreatedAt ?? DateTime.UtcNow
            }).ToList();
            return new PagedResult<BidResponse>
            {
                Items = mapped,
                TotalItems = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<BidResponse?> GetHighestBid(int auctionId)
        {
            var bid = await _bidRepository.GetHighestBid(auctionId);
            if (bid == null) return null;

            return new BidResponse
            {
                BidId = bid.BidId,
                AuctionId = bid.AuctionId,
                BidderId = bid.BidderId,
                BidderName = bid.Bidder?.DisplayName ?? "Unknown",
                Amount = bid.Amount,
                CreatedAt = bid.CreatedAt ?? DateTime.UtcNow
            };
        }

        private async Task NotifyNewBid(int auctionId, BidResponse bid)
        {
            await _hubContext.Clients.Group($"auction_{auctionId}").SendAsync("ReceiveBid", bid);
        }
    }
}