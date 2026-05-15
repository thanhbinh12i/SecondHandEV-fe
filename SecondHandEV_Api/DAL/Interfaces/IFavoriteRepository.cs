using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models;

namespace DAL.Interfaces
{
    public interface IFavoriteRepository : IGenericRepository<Favorite>
    {
        Task<bool> ExistsAsync(int memberId, int listingId);
        Task<Favorite?> GetByMemberAndListingAsync(int memberId, int listingId);
        Task RemoveByMemberAndListingAsync(int memberId, int listingId);

        Task<(IReadOnlyList<Favorite> Items, int Total)> GetByMemberAsync(
            int memberId, int page, int pageSize);
    }
}
