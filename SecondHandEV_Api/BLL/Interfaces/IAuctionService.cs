using BLL.DTO;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IAuctionService
    {
        Task<AuctionResponse> CreateAuction(AuctionCreateRequest auction, int memberId);
        Task<AuctionResponse?> GetAuctionById(int auctionId);
        // Task<List<AuctionResponse>> GetAuctionsBySellerId(int sellerId);
        Task<AuctionResponse> UpdateAuction(int auctionId, AuctionUpdateRequest auction);
        Task DeleteAuction(int auctionId);
        // Task<List<AuctionResponse>> GetAllAuctions();
        // Task<List<AuctionResponse>> GetActiveAuctions();

        // Paged variants (renamed, now canonical)
        Task<PagedResult<AuctionResponse>> GetAllAuctions(int page, int pageSize);
        Task<PagedResult<AuctionResponse>> GetActiveAuctions(int page, int pageSize);
        Task<PagedResult<AuctionResponse>> GetAuctionsBySellerId(int sellerId, int page, int pageSize);
        Task<AuctionResponse?> GetAuctionByListingId(int listingId);
    }
}
