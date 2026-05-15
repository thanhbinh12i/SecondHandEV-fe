using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Bid
{
    public int BidId { get; set; }

    public int AuctionId { get; set; }

    public int BidderId { get; set; }

    public decimal Amount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Auction Auction { get; set; } = null!;

    public virtual Member Bidder { get; set; } = null!;
}
