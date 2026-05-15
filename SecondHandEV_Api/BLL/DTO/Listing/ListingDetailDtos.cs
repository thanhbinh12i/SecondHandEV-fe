// BLL/DTO/ListingDetailDtos.cs
namespace BLL.DTO.Listing
{
    public class BatteryDetailDto
    {
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public decimal? Voltage { get; set; }
        public int? CapacityWh { get; set; }
        public decimal? WeightKg { get; set; }
        public string? Condition { get; set; }
        public int? AgeYears { get; set; }
    }

    public class EbikeDetailDto
    {
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
}
