using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class PayOSPayment
{
    public int PayOspaymentId { get; set; }

    public int PaymentId { get; set; }

    public string OrderCode { get; set; } = null!;

    public string? CheckoutUrl { get; set; }

    public string? AccountNumber { get; set; }

    public string? AccountName { get; set; }

    public string? Reference { get; set; }

    public string? Qrcode { get; set; }

    public DateTime? PaidAt { get; set; }

    public string? CancelReason { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Payment Payment { get; set; } = null!;
}
