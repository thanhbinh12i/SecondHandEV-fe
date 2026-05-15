// BLL/DTO/ListingSearchRequest.cs
using System.ComponentModel.DataAnnotations;

namespace BLL.DTO.Listing
{
    public class ListingSearchRequest
    {
        public string? Keyword { get; set; }
        public int? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? ListingType { get; set; }
        public string? ListingStatus { get; set; }
        public int? YearFrom { get; set; }
        public int? YearTo { get; set; }

        [Range(1, int.MaxValue)] public int Page { get; set; } = 1;
        [Range(1, 200)] public int PageSize { get; set; } = 12;
        public string? SortBy { get; set; } = "createdAt"; // createdAt|price|year|title
        public string? SortDir { get; set; } = "desc";     // asc|desc
    }
}
