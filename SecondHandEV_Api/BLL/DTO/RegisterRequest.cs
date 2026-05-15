using System.ComponentModel.DataAnnotations;

namespace BLL.DTO;

public class RegisterRequest
{
    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
    public string Password { get; set; } = null!;

    [Required(ErrorMessage = "Tên hiển thị là bắt buộc")]
    [MinLength(2, ErrorMessage = "Tên hiển thị phải có ít nhất 2 ký tự")]
    public string DisplayName { get; set; } = null!;

    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? Phone { get; set; }

    // Thông tin profile (optional khi đăng ký)
    public string? FullName { get; set; }
    public string? Address { get; set; }
    public DateOnly? DateOfBirth { get; set; }

    // ← NEW: Chọn Role khi đăng ký (default: User)
    public string Role { get; set; } = "User";
}