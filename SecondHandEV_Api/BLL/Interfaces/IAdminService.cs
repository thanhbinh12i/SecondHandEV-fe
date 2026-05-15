using BLL.DTO;


namespace BLL.Interfaces;

public interface IAdminService
{
    // User Management
    Task<UserListResponse> GetAllUsersAsync(int page = 1, int pageSize = 10, string? searchTerm = null, bool? isActive = null);
    Task<UserDto?> GetUserByIdAsync(int memberId);
    Task<bool> UpdateUserAsync(int memberId, UpdateUserRequest request);
    Task<bool> ToggleUserStatusAsync(int memberId, bool isActive, string? reason = null);
    Task<bool> DeleteUserAsync(int memberId);

    // Dashboard Statistics
    Task<DashboardStatsResponse> GetDashboardStatsAsync();
    Task<RecentActivityResponse> GetRecentActivitiesAsync(int count = 10);
    Task<TimeSeriesStatsResponse> GetTimeSeriesStatsAsync(DateTime startDate, DateTime endDate);
    Task<TopPerformersResponse> GetTopPerformersAsync(int count = 10);
}