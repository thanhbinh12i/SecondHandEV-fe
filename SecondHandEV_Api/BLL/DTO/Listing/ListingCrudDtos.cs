using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTO.Listing
{
    public class ListingCreateRequest
    {
        [Required] public int CategoryId { get; set; }          // 1 = Battery, 2 = E-Bike
        [Required, MaxLength(300)] public string Title { get; set; } = default!;
        [MaxLength(1000)] public string? Description { get; set; }
        public int? Year { get; set; }
        [Range(0, double.MaxValue)] public decimal Price { get; set; }
        [Range(0, double.MaxValue)] public decimal? CommissionPrice { get; set; }

        /// <summary>sale | auction (mặc định sale). Nếu client gửi khác, service sẽ chuẩn hoá.</summary>
        public string? ListingType { get; set; } = "sale";
        public string? ListingStatus { get; set; } = "active";

        // Images
        public string? PrimaryImageUrl { get; set; }
        public List<string>? ImageUrls { get; set; }

        // Optional subtype (dùng chung)
        public string? Brand { get; set; }
        public string? Model { get; set; }
    }

    public class ListingUpdateRequest
    {
        [MaxLength(300)] public string? Title { get; set; }
        [MaxLength(1000)] public string? Description { get; set; }
        public int? Year { get; set; }
        public decimal Price { get; set; }                        // > 0 mới ghi như service đang xử lý
        public decimal? CommissionPrice { get; set; }
        /// sale | auction
        public string? ListingType { get; set; }
        public string? ListingStatus { get; set; }

        // Images 
        public string? PrimaryImageUrl { get; set; }
        public List<string>? ImageUrls { get; set; }

        // ----- Sub-detail -----
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? Condition { get; set; }     // dùng cho cả Battery/Ebike
        public decimal? WeightKg { get; set; }     // dùng cho cả Battery/Ebike

        // Battery-only
        public decimal? Voltage { get; set; }
        public int? CapacityWh { get; set; }
        public int? AgeYears { get; set; }

        // Ebike-only
        public int? MotorPowerW { get; set; }
        public decimal? BatteryVoltage { get; set; }
        public int? RangeKm { get; set; }
        public string? FrameSize { get; set; }
        public int? MileageKm { get; set; }
        public int? YearOfManufacture { get; set; }

        // ====== Thông số tạo auction ngay khi ListingType = "auction" ======
        public decimal? AuctionStartingPrice { get; set; }     // nếu null sẽ fallback từ Price (>0) hoặc mặc định 1
        public DateTime? AuctionStartDate { get; set; }        // nếu null: now + 1 phút (UTC)
        public DateTime? AuctionEndDate { get; set; }          // nếu null: +7 ngày
    }
}
