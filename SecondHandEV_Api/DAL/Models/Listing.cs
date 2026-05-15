using DAL.Enums;
using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Listing
{
    public int ListingId { get; set; }

    public int MemberId { get; set; }

    public int CategoryId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int? Year { get; set; }

    public decimal Price { get; set; }
    public decimal CommissionPrice { get; set; }

    public string? ListingType { get; set; }

    public string? ListingStatus { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Auction? Auction { get; set; }

    public virtual BatteryDetail? BatteryDetail { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual EbikeDetail? EbikeDetail { get; set; }

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual ICollection<ListingImage> ListingImages { get; set; } = new List<ListingImage>();

    public virtual Member Member { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<TransactionsLog> TransactionsLogs { get; set; } = new List<TransactionsLog>();
}
