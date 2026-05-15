using System.ComponentModel.DataAnnotations;
using BLL.DTO.Listing;

namespace BLL.DTO.Favorite
{
    public class FavoriteCreateRequest
    {
        [Required]
        public int ListingId { get; set; }
    }

    public class FavoriteItemDto : ListingDto
    {
        public int FavoriteId { get; set; }
        public bool IsFavorited { get; set; } = true;
    }
}
