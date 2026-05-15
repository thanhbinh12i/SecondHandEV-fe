using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class MemberAuth
{
    public int MemberAuthId { get; set; }

    public int MemberId { get; set; }

    public string AuthType { get; set; } = null!;

    public string? Provider { get; set; }

    public string? ProviderUserId { get; set; }

    public string? PasswordHash { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Member Member { get; set; } = null!;
}
