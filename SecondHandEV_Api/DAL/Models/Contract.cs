using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Contract
{
    public int ContractId { get; set; }

    public int OrderId { get; set; }

    public string? ContractData { get; set; }

    public bool? SignedBySeller { get; set; }

    public bool? SignedByBuyer { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Order Order { get; set; } = null!;
}
