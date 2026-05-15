using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IBidRepository
    {
        Task<Bid> CreateBid(Bid bid);
        Task<Bid?> GetBidById(int bidId);
        Task<List<Bid>> GetBidsByAuctionId(int auctionId);
        Task DeleteBid(int bidId);
        Task<List<Bid>> GetBidsByBidderId(int bidderId);
        Task<Bid?> GetHighestBid(int auctionId);
        Task<int> GetBidCountForAuction(int auctionId);

        // Paged variants
        Task<(IReadOnlyList<Bid> Items, int Total)> GetByAuctionAsync(int auctionId, int page, int pageSize, string sortBy, bool asc);
        Task<(IReadOnlyList<Bid> Items, int Total)> GetByBidderAsync(int bidderId, int? auctionId, int page, int pageSize, string sortBy, bool asc);

    }
}
