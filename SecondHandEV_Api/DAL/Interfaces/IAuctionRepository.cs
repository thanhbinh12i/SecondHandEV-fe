using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IAuctionRepository
    {
        Task<Auction> CreateAuction(Auction auction);
        Task<Auction?> GetAuctionById(int auctionId);
        // Task<List<Auction>> GetAuctionsBySellerId(int sellerId);

        Task<Auction> UpdateAuction(Auction auction);
        Task DeleteAuction(int auctionId);
        // Task<List<Auction>> GetAllAuctions();
        // Task<List<Auction>> GetActiveAuctions();
        Task<List<Auction>> GetAuctionsToStartAsync(DateTime nowUtc);
        Task<List<Auction>> GetAuctionsToEndAsync(DateTime nowUtc);

        // Paged variants (renamed, now canonical)
        Task<(IReadOnlyList<Auction> Items, int Total)> GetAllAsync(int page, int pageSize);
        Task<(IReadOnlyList<Auction> Items, int Total)> GetActiveAsync(int page, int pageSize);
        Task<(IReadOnlyList<Auction> Items, int Total)> GetBySellerAsync(int sellerId, int page, int pageSize);

        Task<Auction?> GetByListingId(int listingId);
    }
}
