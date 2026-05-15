using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models;

namespace DAL.Interfaces
{
    public interface IListingRepository : IGenericRepository<Listing>
    {
        Task<(IReadOnlyList<Listing> Items, int Total)> SearchAsync(
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
            int pageSize);

        Task<Listing?> GetWithDetailsAsync(int id);

        Task ReplaceImagesAsync(int listingId, IEnumerable<(string Url, bool IsPrimary)> images);

        /// Xoá sub-details nếu có (BatteryDetail/EbikeDetail) — dùng khi xoá Listing
        Task DeleteSubDetailsIfAnyAsync(int listingId);
        Task<Listing?> GetListingByIdAsync(int listingId);

        /// Lấy listing theo chủ sở hữu (my listings)
        Task<(IReadOnlyList<Listing> Items, int Total)> GetByMemberAsync(
            int memberId,
            string? status,
            string sortBy,
            bool asc,
            int page,
            int pageSize);

        /// Cập nhật trạng thái listing (duyệt/từ chối/khoá…)
        Task<bool> UpdateStatusAsync(int listingId, string newStatus);
    }
}
