using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class MemberProfile
{
    public int ProfileId { get; set; }

    public int MemberId { get; set; }

    public string? FullName { get; set; }

    public string? Address { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Bio { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Member Member { get; set; } = null!;
}
