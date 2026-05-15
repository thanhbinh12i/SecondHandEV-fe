using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class EbikeDetail
{
    public int ListingId { get; set; }

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

    public virtual Listing Listing { get; set; } = null!;
}
