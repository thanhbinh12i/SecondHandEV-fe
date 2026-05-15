using DAL.Enums;
using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Member
{
    public int MemberId { get; set; }

    public string? DisplayName { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string Role { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Auction> Auctions { get; set; } = new List<Auction>();

    public virtual ICollection<Bid> Bids { get; set; } = new List<Bid>();

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual ICollection<Listing> Listings { get; set; } = new List<Listing>();

    public virtual MemberAuth? MemberAuth { get; set; }

    public virtual MemberProfile? MemberProfile { get; set; }

    public virtual ICollection<Order> OrderBuyers { get; set; } = new List<Order>();

    public virtual ICollection<Order> OrderSellers { get; set; } = new List<Order>();

    public virtual ICollection<Review> ReviewReviewees { get; set; } = new List<Review>();

    public virtual ICollection<Review> ReviewReviewers { get; set; } = new List<Review>();

    public virtual ICollection<TransactionsLog> TransactionsLogs { get; set; } = new List<TransactionsLog>();
}
