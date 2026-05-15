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
    public class BidRepository : GenericRepository<Bid>, IBidRepository
    {
        public BidRepository(VehicleBatteryMarketDbContext context) : base(context)
        {
        }
        public async Task<Bid> CreateBid(Bid bid)
        {
            await AddAsync(bid);
            await _context.SaveChangesAsync();
            return await _context.Bids
                .Include(b => b.Bidder)
                .FirstAsync(b => b.BidId == bid.BidId);
        }
        public async Task DeleteBid(int bidId)
        {
            var bid = await GetByIdAsync(bidId);
            if (bid != null)
            {
                Remove(bid);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<Bid?> GetBidById(int bidId)
        {
            return await _context.Bids
                .Include(b => b.Bidder)
                .FirstOrDefaultAsync(b => b.BidId == bidId);
        }

        public async Task<int> GetBidCountForAuction(int auctionId)
        {
            return await _context.Bids.CountAsync(b => b.AuctionId == auctionId);
        }

        public async Task<List<Bid>> GetBidsByAuctionId(int auctionId)
        {
            return await _context.Bids.Where(b => b.AuctionId == auctionId).ToListAsync();
        }

        public async Task<List<Bid>> GetBidsByBidderId(int bidderId)
        {
            return await _context.Bids.Where(b => b.BidderId == bidderId).ToListAsync();
        }

        public async Task<Bid?> GetHighestBid(int auctionId)
        {
            return await _context.Bids
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.Amount)
                .ThenBy(b => b.CreatedAt)
                .FirstOrDefaultAsync();
        }
        /*        public async Task UpdateBid(Bid bid)
       {
           Update(bid);
       }*/

        public async Task<(IReadOnlyList<Bid> Items, int Total)> GetByAuctionAsync(int auctionId, int page, int pageSize, string sortBy, bool asc)
        {
            var q = _context.Bids.AsNoTracking().Include(x=>x.Bidder).Where(b => b.AuctionId == auctionId);
            var total = await q.CountAsync();
            (string sb, bool ascending) = ((sortBy ?? "createdAt").ToLower(), asc);
            q = (sb, ascending) switch
            {
                ("amount", true) => q.OrderBy(b => b.Amount).ThenBy(b => b.BidId),
                ("amount", false) => q.OrderByDescending(b => b.Amount).ThenByDescending(b => b.BidId),
                ("createdat", true) => q.OrderBy(b => b.CreatedAt).ThenBy(b => b.BidId),
                _ => q.OrderByDescending(b => b.CreatedAt).ThenByDescending(b => b.BidId)
            };
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return (items, total);
        }

        public async Task<(IReadOnlyList<Bid> Items, int Total)> GetByBidderAsync(int bidderId, int? auctionId, int page, int pageSize, string sortBy, bool asc)
        {
            var q = _context.Bids.AsNoTracking().Include(x=>x.Bidder).Where(b => b.BidderId == bidderId);
            if (auctionId.HasValue) q = q.Where(b => b.AuctionId == auctionId.Value);
            var total = await q.CountAsync();
            (string sb, bool ascending) = ((sortBy ?? "createdAt").ToLower(), asc);
            q = (sb, ascending) switch
            {
                ("amount", true) => q.OrderBy(b => b.Amount).ThenBy(b => b.BidId),
                ("amount", false) => q.OrderByDescending(b => b.Amount).ThenByDescending(b => b.BidId),
                ("createdat", true) => q.OrderBy(b => b.CreatedAt).ThenBy(b => b.BidId),
                _ => q.OrderByDescending(b => b.CreatedAt).ThenByDescending(b => b.BidId)
            };
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return (items, total);
        }

    }
}
