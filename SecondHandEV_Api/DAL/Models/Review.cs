using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Review
{
    public int ReviewId { get; set; }

    public int ReviewerId { get; set; }

    public int RevieweeId { get; set; }

    public int? OrderId { get; set; }

    public byte Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Order? Order { get; set; }

    public virtual Member Reviewee { get; set; } = null!;

    public virtual Member Reviewer { get; set; } = null!;
}
