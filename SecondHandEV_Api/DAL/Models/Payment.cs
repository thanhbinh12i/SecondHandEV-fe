using DAL.Enums;
using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int OrderId { get; set; }

    public decimal Amount { get; set; }

    public string Provider { get; set; } = null!;

    public string? ProviderRef { get; set; }

    public PaymentStatus Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual ICollection<PayOSPayment> PayOspayments { get; set; } = new List<PayOSPayment>();
}
