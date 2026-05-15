using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Interfaces;
using DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class ListingRepository : GenericRepository<Listing>, IListingRepository
    {
        public ListingRepository(VehicleBatteryMarketDbContext context) : base(context) { }

        public async Task<(IReadOnlyList<Listing> Items, int Total)> SearchAsync(
            string? keyword,
            int? categoryId,
            decimal? minPrice,
            decimal? maxPrice,
            string? listingType,
            string? listingStatus,
            int? yearFrom,
            int? yearTo,
            string sortBy,
            bool asc,
            int page,
            int pageSize)
        {
            var q = _context.Listings
                .AsNoTracking()
                .Include(x => x.Member)
                .Include(x => x.Category)
                .Include(x => x.ListingImages)
                .Include(x => x.BatteryDetail)
                .Include(x => x.EbikeDetail)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var k = keyword.Trim().ToLower();
                q = q.Where(x =>
                    x.Title.ToLower().Contains(k)
                    || (x.Description != null && x.Description.ToLower().Contains(k))
                    || (x.BatteryDetail != null && (
                        (x.BatteryDetail.Brand ?? "").ToLower().Contains(k)
                        || (x.BatteryDetail.Model ?? "").ToLower().Contains(k)))
                    || (x.EbikeDetail != null && (
                        (x.EbikeDetail.Brand ?? "").ToLower().Contains(k)
                        || (x.EbikeDetail.Model ?? "").ToLower().Contains(k)))
                );
            }

            if (categoryId.HasValue) q = q.Where(x => x.CategoryId == categoryId.Value);
            if (minPrice.HasValue) q = q.Where(x => x.Price >= minPrice.Value);
            if (maxPrice.HasValue) q = q.Where(x => x.Price <= maxPrice.Value);
            if (!string.IsNullOrWhiteSpace(listingType)) q = q.Where(x => x.ListingType == listingType);
            if (!string.IsNullOrWhiteSpace(listingStatus)) q = q.Where(x => x.ListingStatus == listingStatus);
            if (yearFrom.HasValue) q = q.Where(x => x.Year >= yearFrom.Value);
            if (yearTo.HasValue) q = q.Where(x => x.Year <= yearTo.Value);

            (string sb, bool ascending) = ((sortBy ?? "createdAt").ToLower(), asc);
            q = (sb, ascending) switch
            {
                ("price", true) => q.OrderBy(x => x.Price).ThenByDescending(x => x.ListingId),
                ("price", false) => q.OrderByDescending(x => x.Price).ThenByDescending(x => x.ListingId),
                ("year", true) => q.OrderBy(x => x.Year).ThenByDescending(x => x.ListingId),
                ("year", false) => q.OrderByDescending(x => x.Year).ThenByDescending(x => x.ListingId),
                ("title", true) => q.OrderBy(x => x.Title),
                ("title", false) => q.OrderByDescending(x => x.Title),
                _ => q.OrderByDescending(x => x.CreatedAt).ThenByDescending(x => x.ListingId)
            };

            var total = await q.CountAsync();
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return (items, total);
        }

        public async Task<Listing?> GetWithDetailsAsync(int id)
        {
            return await _context.Listings
                .Include(x => x.Member)
                .Include(x => x.ListingImages)
                .Include(x => x.Category)
                .Include(x => x.BatteryDetail)
                .Include(x => x.EbikeDetail)
                .FirstOrDefaultAsync(x => x.ListingId == id);
        }

        public async Task ReplaceImagesAsync(int listingId, IEnumerable<(string Url, bool IsPrimary)> images)
        {
            var olds = await _context.ListingImages.Where(i => i.ListingId == listingId).ToListAsync();
            if (olds.Count > 0) _context.ListingImages.RemoveRange(olds);

            if (images != null)
            {
                await _context.ListingImages.AddRangeAsync(
                    images.Select(i => new ListingImage
                    {
                        ListingId = listingId,
                        Url = i.Url,
                        IsPrimary = i.IsPrimary
                    })
                );
            }
        }

        public async Task DeleteSubDetailsIfAnyAsync(int listingId)
        {
            var b = await _context.BatteryDetails.FindAsync(listingId);
            if (b != null) _context.BatteryDetails.Remove(b);

            var e = await _context.EbikeDetails.FindAsync(listingId);
            if (e != null) _context.EbikeDetails.Remove(e);
        }
        public async Task<Listing?>GetListingByIdAsync(int listingId)
        {
            return await _context.Listings.Include(x=>x.ListingImages).FirstOrDefaultAsync(x=>x.ListingId == listingId);
        }
        public async Task<(IReadOnlyList<Listing> Items, int Total)> GetByMemberAsync(
            int memberId,
            string? status,
            string sortBy,
            bool asc,
            int page,
            int pageSize)
        {
            var q = _context.Listings
                .AsNoTracking()
                .Include(x => x.Member)
                .Include(x => x.Category)
                .Include(x => x.ListingImages)
                .Include(x => x.BatteryDetail)
                .Include(x => x.EbikeDetail)
                .Where(x => x.MemberId == memberId);

            if (!string.IsNullOrWhiteSpace(status))
                q = q.Where(x => x.ListingStatus == status);

            (string sb, bool ascending) = ((sortBy ?? "createdAt").ToLower(), asc);
            q = (sb, ascending) switch
            {
                ("price", true) => q.OrderBy(x => x.Price).ThenByDescending(x => x.ListingId),
                ("price", false) => q.OrderByDescending(x => x.Price).ThenByDescending(x => x.ListingId),
                ("year", true) => q.OrderBy(x => x.Year).ThenByDescending(x => x.ListingId),
                ("year", false) => q.OrderByDescending(x => x.Year).ThenByDescending(x => x.ListingId),
                ("title", true) => q.OrderBy(x => x.Title),
                ("title", false) => q.OrderByDescending(x => x.Title),
                _ => q.OrderByDescending(x => x.CreatedAt).ThenByDescending(x => x.ListingId)
            };

            var total = await q.CountAsync();
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return (items, total);
        }

        public async Task<bool> UpdateStatusAsync(int listingId, string newStatus)
        {
            var e = await _context.Listings.FirstOrDefaultAsync(x => x.ListingId == listingId);
            if (e == null) return false;

            e.ListingStatus = newStatus;
            _context.Listings.Update(e);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
