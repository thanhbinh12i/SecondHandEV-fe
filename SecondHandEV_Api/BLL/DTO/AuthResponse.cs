namespace BLL.DTO;

/// <summary>
/// Response trả về cho các API authentication
/// </summary>
public class AuthResponse
{
    /// <summary>
    /// Trạng thái thành công hay thất bại
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// Thông báo kết quả
    /// </summary>
    public string Message { get; set; } = null!;

    /// <summary>
    /// JWT Token (chỉ có khi Success = true)
    /// </summary>
    public string? Token { get; set; }

    /// <summary>
    /// Thông tin member (chỉ có khi Success = true)
    /// </summary>
    public MemberDto? Member { get; set; }
}

