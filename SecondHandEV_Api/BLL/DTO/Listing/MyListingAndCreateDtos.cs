// BLL/DTO/MyListingAndCreateDtos.cs
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTO.Listing
{
    // Dùng cho GET /api/listings/my
    public class MyListingSearchRequest
    {
        public string? Status { get; set; } // draft | active | rejected | ...
        [Range(1, int.MaxValue)] public int Page { get; set; } = 1;
        [Range(1, 200)] public int PageSize { get; set; } = 12;
        public string? SortBy { get; set; } = "createdAt";
        public string? SortDir { get; set; } = "desc";
    }

    // POST /api/listings/battery
    public class CreateBatteryListingRequest
    {
        [Required] public string Title { get; set; } = default!;
        [MaxLength(1000)] public string? Description { get; set; }
        public int? Year { get; set; }
        [Range(0, double.MaxValue)] public decimal Price { get; set; }
        [Range(0, double.MaxValue)] public decimal? CommissionPrice { get; set; }

        public string? ListingType { get; set; } = "sale";
        public string? ListingStatus { get; set; } = "draft";

        public string? PrimaryImageUrl { get; set; }
        public List<string>? ImageUrls { get; set; }

        public string? Brand { get; set; }
        public string? Model { get; set; }
        public decimal? Voltage { get; set; }
        public int? CapacityWh { get; set; }
        public decimal? WeightKg { get; set; }
        public string? Condition { get; set; }
        public int? AgeYears { get; set; }
    }

    // POST /api/listings/ebike
    public class CreateEbikeListingRequest
    {
        [Required] public string Title { get; set; } = default!;
        [MaxLength(1000)] public string? Description { get; set; }
        public int? Year { get; set; }
        [Range(0, double.MaxValue)] public decimal Price { get; set; }
        [Range(0, double.MaxValue)] public decimal? CommissionPrice { get; set; }
        public string? ListingType { get; set; } = "sale";
        public string? ListingStatus { get; set; } = "draft";

        public string? PrimaryImageUrl { get; set; }
        public List<string>? ImageUrls { get; set; }

        public string? Brand { get; set; }
        public string? Model { get; set; }
        public int? MotorPowerW { get; set; }
        public decimal? BatteryVoltage { get; set; }
        public int? RangeKm { get; set; }
        public string? FrameSize { get; set; }
        public string? Condition { get; set; }
        public int? MileageKm { get; set; }
        public decimal? WeightKg { get; set; }
        public int? YearOfManufacture { get; set; }
    }

    public class UpdateListingStatusRequest
    {
        [Required] public string Status { get; set; } = default!;
        public string? Reason { get; set; }
    }
}
