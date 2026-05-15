using BLL.DTO;
using BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EVAndBatteryTradingAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Đăng ký tài khoản mới
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Dữ liệu không hợp lệ",
            });
        }

        var result = await _authService.RegisterAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Đăng nhập
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return Unauthorized(new AuthResponse
            {
                Success = false,
                Message = "Dữ liệu không hợp lệ"
            });
        }

        var result = await _authService.LoginAsync(request);

        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Lấy thông tin profile đầy đủ của user hiện tại (yêu cầu JWT token)
    /// </summary>
    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var memberIdClaim = User.FindFirst("MemberId")?.Value;

        if (string.IsNullOrEmpty(memberIdClaim) || !int.TryParse(memberIdClaim, out int memberId))
        {
            return Unauthorized(new { message = "Token không hợp lệ" });
        }

        var profile = await _authService.GetProfileAsync(memberId);

        if (profile == null)
        {
            return NotFound(new { message = "Không tìm thấy thông tin user" });
        }

        return Ok(profile);
    }

    /// <summary>
    /// Test endpoint - Không yêu cầu authentication
    /// </summary>
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new
        {
            message = "Auth API đang hoạt động",
            timestamp = DateTime.UtcNow
        });
    }
}