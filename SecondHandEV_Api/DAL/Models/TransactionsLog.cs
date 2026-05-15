using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class TransactionsLog
{
    public int TxnId { get; set; }

    public int? MemberId { get; set; }

    public int? ListingId { get; set; }

    public int? OrderId { get; set; }

    public string EventType { get; set; } = null!;

    public string? Data { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Listing? Listing { get; set; }

    public virtual Member? Member { get; set; }

    public virtual Order? Order { get; set; }
}
