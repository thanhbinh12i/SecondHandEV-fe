using DAL.Enums;
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
    public class AuctionRepository : GenericRepository<Auction>, IAuctionRepository
    {
        public AuctionRepository(VehicleBatteryMarketDbContext context) : base(context)
        {
        }

        public async Task<Auction> CreateAuction(Auction auction)
        {
            await AddAsync(auction);
            await _context.SaveChangesAsync();
            return auction;
        }

        public async Task DeleteAuction(int auctionId)
        {
            var auction = await _context.Auctions.FindAsync(auctionId);
            if (auction != null)
            {
                Remove(auction);
                await _context.SaveChangesAsync();
            }
        }

        // public async Task<List<Auction>> GetActiveAuctions()
        // {
        //     return await _context.Auctions
        //         .Where(a => a.Status.Equals(AuctionStatus.Active) && a.AuctionEnd > DateTime.UtcNow)
        //         .ToListAsync();
        // }

        // public async Task<List<Auction>> GetAllAuctions()
        // {
        //     return await _context.Auctions.ToListAsync();
        // }

        public async Task<Auction?> GetAuctionById(int auctionId)
        {
            return await _context.Auctions
                .Include(a => a.Bids)
                .Include(a => a.Listing)
                .FirstOrDefaultAsync(a => a.AuctionId == auctionId);
        }

        // public async Task<List<Auction>> GetAuctionsBySellerId(int sellerId)
        // {
        //     return await _context.Auctions
        //         .Include(a => a.Listing)
        //         .Where(a => a.Listing.MemberId == sellerId)
        //         .ToListAsync();
        // }

        public async Task<Auction> UpdateAuction(Auction auction)
        {
            Update(auction);
            await _context.SaveChangesAsync();
            return auction;
        }

        public async Task<List<Auction>> GetAuctionsToStartAsync(DateTime nowUtc)
        {
            return await _context.Auctions
                .Where(a => a.Status == AuctionStatus.Upcoming && a.AuctionStart <= nowUtc)
                .ToListAsync();
        }

        public async Task<List<Auction>> GetAuctionsToEndAsync(DateTime nowUtc)
        {
            return await _context.Auctions
                .Include(a => a.Bids)
                .Where(a => a.Status == AuctionStatus.Active && a.AuctionEnd <= nowUtc)
                .ToListAsync();
        }

        public async Task<(IReadOnlyList<Auction> Items, int Total)> GetAllAsync(int page, int pageSize)
        {
            var q = _context.Auctions.AsNoTracking().Include(x=>x.Listing).Include(x=>x.Bids);
            var total = await q.CountAsync();
            var items = await q
                .OrderByDescending(a => a.CreatedAt)
                .ThenByDescending(a => a.AuctionId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, total);
        }

        public async Task<(IReadOnlyList<Auction> Items, int Total)> GetActiveAsync(int page, int pageSize)
        {
            var now = DateTime.UtcNow;
            var q = _context.Auctions
                .AsNoTracking().Include(x=>x.Listing).Include(x=>x.Bids)
                .Where(a => a.Status.Equals(AuctionStatus.Active) && a.AuctionEnd > now);
            var total = await q.CountAsync();
            var items = await q
                .OrderBy(a => a.AuctionEnd)
                .ThenByDescending(a => a.AuctionId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, total);
        }

        public async Task<(IReadOnlyList<Auction> Items, int Total)> GetBySellerAsync(int sellerId, int page, int pageSize)
        {
            var q = _context.Auctions
                .AsNoTracking()
                .Include(a => a.Listing)
                .Include(a => a.Bids)
                .Where(a => a.Listing.MemberId == sellerId);
            var total = await q.CountAsync();
            var items = await q
                .OrderByDescending(a => a.CreatedAt)
                .ThenByDescending(a => a.AuctionId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (items, total);
        }

        public Task<Auction?> GetByListingId(int listingId)   // NEW
        {
            return _context.Auctions
                .Include(a => a.Bids)
                .Include(a => a.Listing)
                .FirstOrDefaultAsync(a => a.ListingId == listingId);
        }
    }
}
