using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class ListingImage
{
    public int ImageId { get; set; }

    public int ListingId { get; set; }

    public string Url { get; set; } = null!;

    public bool? IsPrimary { get; set; }

    public virtual Listing Listing { get; set; } = null!;
}
