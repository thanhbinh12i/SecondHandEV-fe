using BLL.DTO;
using BLL.DTO.Listing;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IListingService
    {
        Task<PagedResult<ListingDto>> SearchAsync(ListingSearchRequest req);
        Task<ListingDto?> GetByIdAsync(int id);
        Task<int> CreateAsync(int memberId, ListingCreateRequest req);
        Task<bool> UpdateAsync(int id, int memberId, ListingUpdateRequest req);
        Task<bool> DeleteAsync(int id, int memberId);

        Task<PagedResult<ListingDto>> GetMyListingsAsync(int memberId, MyListingSearchRequest req);
        Task<bool> UpdateStatusAsync(int id, string status);

        Task<int> CreateBatteryAsync(int memberId, CreateBatteryListingRequest req);
        Task<int> CreateEbikeAsync(int memberId, CreateEbikeListingRequest req);
    }
}
