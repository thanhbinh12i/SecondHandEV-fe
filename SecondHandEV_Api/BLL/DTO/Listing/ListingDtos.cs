// BLL/DTO/ListingDto.cs
using BLL.DTO.Listing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTO.Listing
{
    public class ListingDto
    {
        public int ListingId { get; set; }
        public int MemberId { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public int? Year { get; set; }
        public decimal? Price { get; set; }
        public decimal? CommissionPrice { get; set; }
        public string? ListingType { get; set; }   // fixed / buy_now ...
        public string? ListingStatus { get; set; } // active / draft ...
        public DateTime? CreatedAt { get; set; }

        // Seller
        public string? SellerDisplayName { get; set; }
        public string? SellerEmail { get; set; }

        // Images
        public string? PrimaryImageUrl { get; set; }
        public List<string> ImageUrls { get; set; } = new();

        // Tóm tắt nhanh (để filter/list nhanh)
        public string? Brand { get; set; }
        public string? Model { get; set; }

        // Chi tiết (tuỳ Category)
        public BatteryDetailDto? Battery { get; set; }
        public EbikeDetailDto? Ebike { get; set; }
    }
}
