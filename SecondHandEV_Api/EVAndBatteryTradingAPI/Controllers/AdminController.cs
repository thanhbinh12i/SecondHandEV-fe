using BLL.DTO;
using BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVAndBatteryTradingAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] // ← CHỈ Admin mới truy cập được
[Produces("application/json")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    // ==================== User Management ====================

    /// <summary>
    /// Lấy danh sách tất cả users với pagination và filter
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] bool? isActive = null)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 10;

        var result = await _adminService.GetAllUsersAsync(page, pageSize, search, isActive);
        return Ok(result);
    }

    /// <summary>
    /// Lấy thông tin chi tiết một user
    /// </summary>
    [HttpGet("users/{memberId}")]
    public async Task<IActionResult> GetUserById(int memberId)
    {
        var user = await _adminService.GetUserByIdAsync(memberId);
        if (user == null)
        {
            return NotFound(new { message = $"Không tìm thấy user với ID {memberId}" });
        }

        return Ok(user);
    }

    /// <summary>
    /// Cập nhật thông tin user
    /// </summary>
    [HttpPut("users/{memberId}")]
    public async Task<IActionResult> UpdateUser(int memberId, [FromBody] UpdateUserRequest request)
    {
        var success = await _adminService.UpdateUserAsync(memberId, request);
        if (!success)
        {
            return NotFound(new { message = $"Không tìm thấy user với ID {memberId}" });
        }

        return Ok(new { message = "Cập nhật thông tin user thành công" });
    }

    /// <summary>
    /// Khóa/Mở khóa user
    /// </summary>
    [HttpPost("users/{memberId}/toggle-status")]
    public async Task<IActionResult> ToggleUserStatus(int memberId, [FromBody] ToggleUserStatusRequest request)
    {
        var success = await _adminService.ToggleUserStatusAsync(memberId, request.IsActive, request.Reason);
        if (!success)
        {
            return NotFound(new { message = $"Không tìm thấy user với ID {memberId}" });
        }

        var statusText = request.IsActive ? "mở khóa" : "khóa";
        return Ok(new { message = $"Đã {statusText} user thành công" });
    }

    /// <summary>
    /// Xóa user (soft delete)
    /// </summary>
    [HttpDelete("users/{memberId}")]
    public async Task<IActionResult> DeleteUser(int memberId)
    {
        var success = await _adminService.DeleteUserAsync(memberId);
        if (!success)
        {
            return NotFound(new { message = $"Không tìm thấy user với ID {memberId}" });
        }

        return Ok(new { message = "Đã xóa user thành công" });
    }

    // ==================== Dashboard ====================

    /// <summary>
    /// Lấy thống kê tổng quan cho dashboard
    /// </summary>
    [HttpGet("dashboard/stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var stats = await _adminService.GetDashboardStatsAsync();
        return Ok(stats);
    }

    /// <summary>
    /// Lấy các hoạt động gần đây
    /// </summary>
    [HttpGet("dashboard/recent-activities")]
    public async Task<IActionResult> GetRecentActivities([FromQuery] int count = 10)
    {
        if (count < 1 || count > 50) count = 10;

        var activities = await _adminService.GetRecentActivitiesAsync(count);
        return Ok(activities);
    }

    /// <summary>
    /// Lấy thống kê theo thời gian (cho biểu đồ)
    /// </summary>
    [HttpGet("dashboard/time-series")]
    public async Task<IActionResult> GetTimeSeriesStats(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        // Default: last 30 days
        var end = endDate ?? DateTime.UtcNow;
        var start = startDate ?? end.AddDays(-30);

        if (start > end)
        {
            return BadRequest(new { message = "startDate không được lớn hơn endDate" });
        }

        if ((end - start).TotalDays > 365)
        {
            return BadRequest(new { message = "Khoảng thời gian không được vượt quá 365 ngày" });
        }

        var stats = await _adminService.GetTimeSeriesStatsAsync(start, end);
        return Ok(stats);
    }

    /// <summary>
    /// Lấy top performers (sellers, buyers, listings)
    /// </summary>
    [HttpGet("dashboard/top-performers")]
    public async Task<IActionResult> GetTopPerformers([FromQuery] int count = 10)
    {
        if (count < 1 || count > 50) count = 10;

        var performers = await _adminService.GetTopPerformersAsync(count);
        return Ok(performers);
    }

    /// <summary>
    /// Export danh sách users ra CSV
    /// </summary>
    [HttpGet("users/export")]
    public async Task<IActionResult> ExportUsers()
    {
        var allUsers = await _adminService.GetAllUsersAsync(1, 10000); // Get all users

        var csv = "MemberId,DisplayName,Email,Phone,IsActive,CreatedAt,TotalListings,TotalOrders\n";
        foreach (var user in allUsers.Users)
        {
            csv += $"{user.MemberId}," +
                   $"\"{user.DisplayName}\"," +
                   $"\"{user.Email}\"," +
                   $"\"{user.Phone}\"," +
                   $"{user.IsActive}," +
                   $"{user.CreatedAt:yyyy-MM-dd HH:mm:ss}," +
                   $"{user.TotalListings}," +
                   $"{user.TotalOrders}\n";
        }

        var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
        var fileName = $"users_export_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";

        return File(bytes, "text/csv", fileName);
    }
}