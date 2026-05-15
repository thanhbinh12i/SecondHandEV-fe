using System.Threading.Tasks;
using BLL.DTO;
using BLL.DTO.Favorite;

namespace BLL.Interfaces
{
    public interface IFavoriteService
    {
        Task<int> AddAsync(int memberId, int listingId); 
        Task<bool> RemoveAsync(int memberId, int listingId);
        Task<PagedResult<FavoriteItemDto>> GetMyAsync(int memberId, int page, int pageSize);
        Task<bool> IsFavoritedAsync(int memberId, int listingId);
    }
}
