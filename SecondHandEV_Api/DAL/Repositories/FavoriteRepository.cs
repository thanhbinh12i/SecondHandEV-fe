using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Interfaces;
using DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class FavoriteRepository : GenericRepository<Favorite>, IFavoriteRepository
    {
        public FavoriteRepository(VehicleBatteryMarketDbContext context) : base(context) { }

        public async Task<bool> ExistsAsync(int memberId, int listingId)
        {
            return await _context.Favorites
                .AsNoTracking()
                .AnyAsync(f => f.MemberId == memberId && f.ListingId == listingId);
        }

        public async Task<Favorite?> GetByMemberAndListingAsync(int memberId, int listingId)
        {
            return await _context.Favorites
                .FirstOrDefaultAsync(f => f.MemberId == memberId && f.ListingId == listingId);
        }

        public async Task RemoveByMemberAndListingAsync(int memberId, int listingId)
        {
            var fav = await GetByMemberAndListingAsync(memberId, listingId);
            if (fav != null)
            {
                Remove(fav);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<(IReadOnlyList<Favorite> Items, int Total)> GetByMemberAsync(
            int memberId, int page, int pageSize)
        {
            var q = _context.Favorites
                .AsNoTracking()
                .Where(f => f.MemberId == memberId)
                .Include(f => f.Listing)
                    .ThenInclude(l => l.Member)
                .Include(f => f.Listing)
                    .ThenInclude(l => l.Category)
                .Include(f => f.Listing)
                    .ThenInclude(l => l.ListingImages)
                .Include(f => f.Listing)
                    .ThenInclude(l => l.BatteryDetail)
                .Include(f => f.Listing)
                    .ThenInclude(l => l.EbikeDetail)
                .OrderByDescending(f => f.CreatedAt)
                .ThenByDescending(f => f.FavoriteId);

            var total = await q.CountAsync();
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return (items, total);
        }
    }
}
