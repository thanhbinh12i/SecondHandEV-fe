using BLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IBidService
    {
        Task<BidResponse> PlaceBid(int auctionId, BidCreateRequest request, int bidderId);
        // Task<List<BidResponse>> GetBidsByAuctionId(int auctionId);
        // Task<List<BidResponse>> GetBidsByBidderId(int bidderId);
        Task<PagedResult<BidResponse>> GetBidsByAuctionId(int auctionId, int page, int pageSize, string? sortBy, string? sortDir);
        Task<PagedResult<BidResponse>> GetBidsByBidderId(int bidderId, int? auctionId, int page, int pageSize, string? sortBy, string? sortDir);
        Task<BidResponse?> GetHighestBid(int auctionId);
    }
}
