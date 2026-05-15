using DAL.Enums;
using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public int ListingId { get; set; }

    public int BuyerId { get; set; }

    public int SellerId { get; set; }

    public decimal OrderAmount { get; set; }

    public OrderStatus Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Member Buyer { get; set; } = null!;

    public virtual Contract? Contract { get; set; }

    public virtual Listing Listing { get; set; } = null!;

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual Member Seller { get; set; } = null!;

    public virtual ICollection<TransactionsLog> TransactionsLogs { get; set; } = new List<TransactionsLog>();
}
