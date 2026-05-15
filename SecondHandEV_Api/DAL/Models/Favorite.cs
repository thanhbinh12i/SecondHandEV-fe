using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Favorite
{
    public int FavoriteId { get; set; }

    public int MemberId { get; set; }

    public int ListingId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Listing Listing { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
