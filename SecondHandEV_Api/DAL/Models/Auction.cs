using DAL.Enums;
using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Auction
{
    public int AuctionId { get; set; }

    public int ListingId { get; set; }

    public decimal BuyNowPrice { get; set; }

    public decimal StartPrice { get; set; }

    public DateTime AuctionStart { get; set; }

    public DateTime AuctionEnd { get; set; }

    public decimal? CurrentPrice { get; set; }

    public int? CurrentWinnerId { get; set; }

    public AuctionStatus Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Bid> Bids { get; set; } = new List<Bid>();

    public virtual Member? CurrentWinner { get; set; }

    public virtual Listing Listing { get; set; } = null!;
}
