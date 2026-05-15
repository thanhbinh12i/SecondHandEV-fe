using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class BatteryDetail
{
    public int ListingId { get; set; }

    public string? Brand { get; set; }

    public string? Model { get; set; }

    public decimal? Voltage { get; set; }

    public int? CapacityWh { get; set; }

    public decimal? WeightKg { get; set; }

    public string? Condition { get; set; }

    public int? AgeYears { get; set; }

    public virtual Listing Listing { get; set; } = null!;
}
