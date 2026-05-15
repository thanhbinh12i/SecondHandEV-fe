using System.ComponentModel.DataAnnotations;

namespace BLL.DTO;

// ==================== User Management DTOs ====================

/// <summary>
/// Response cho danh sách user với pagination
/// </summary>
public class UserListResponse
{
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public List<UserDto> Users { get; set; } = new();
}

/// <summary>
/// DTO thông tin user chi tiết cho admin
/// </summary>
public class UserDto
{
    public int MemberId { get; set; }
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Role { get; set; } = "User"; // ← NEW: Hiển thị role
    public bool? IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Profile
    public string? FullName { get; set; }
    public string? Address { get; set; }
    public DateOnly? DateOfBirth { get; set; }

    // Statistics
    public int TotalListings { get; set; }
    public int TotalOrders { get; set; }
    public int TotalReviews { get; set; }
}

/// <summary>
/// Request để cập nhật user
/// </summary>
public class UpdateUserRequest
{
    public string? DisplayName { get; set; }
    public string? Phone { get; set; }
    public string? FullName { get; set; }
    public string? Address { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Bio { get; set; }

    // ← NEW: Admin có thể thay đổi role
    public string? Role { get; set; }
}

/// <summary>
/// Request để khóa/mở khóa user
/// </summary>
public class ToggleUserStatusRequest
{
    [Required]
    public bool IsActive { get; set; }

    public string? Reason { get; set; }
}

// ==================== Dashboard DTOs ====================

/// <summary>
/// Thống kê tổng quan cho dashboard
/// </summary>
public class DashboardStatsResponse
{
    public UserStats Users { get; set; } = new();
    public ListingStats Listings { get; set; } = new();
    public OrderStats Orders { get; set; } = new();
    public RevenueStats Revenue { get; set; } = new();
}

public class UserStats
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int InactiveUsers { get; set; }
    public int NewUsersThisMonth { get; set; }
    public int NewUsersToday { get; set; }
    public double GrowthRate { get; set; } // % tăng trưởng so với tháng trước
}

public class ListingStats
{
    public int TotalListings { get; set; }
    public int ActiveListings { get; set; }
    public int DraftListings { get; set; }
    public int SoldListings { get; set; }
    public int NewListingsThisMonth { get; set; }
    public int NewListingsToday { get; set; }
}

public class OrderStats
{
    public int TotalOrders { get; set; }
    public int PendingOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int CancelledOrders { get; set; }
    public int NewOrdersThisMonth { get; set; }
    public int NewOrdersToday { get; set; }
}

public class RevenueStats
{
    public decimal TotalRevenue { get; set; }
    public decimal RevenueThisMonth { get; set; }
    public decimal RevenueToday { get; set; }
    public decimal AverageOrderValue { get; set; }
    public double RevenueGrowthRate { get; set; } // % tăng trưởng so với tháng trước
}

/// <summary>
/// Hoạt động gần đây
/// </summary>
public class RecentActivityResponse
{
    public List<ActivityDto> Activities { get; set; } = new();
}

public class ActivityDto
{
    public int ActivityId { get; set; }
    public string ActivityType { get; set; } = null!; // "user_register", "listing_created", "order_placed"
    public string Description { get; set; } = null!;
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Thống kê theo thời gian (biểu đồ)
/// </summary>
public class TimeSeriesStatsResponse
{
    public List<TimeSeriesDataPoint> UserRegistrations { get; set; } = new();
    public List<TimeSeriesDataPoint> ListingCreations { get; set; } = new();
    public List<TimeSeriesDataPoint> OrderVolume { get; set; } = new();
    public List<TimeSeriesDataPoint> Revenue { get; set; } = new();
}

public class TimeSeriesDataPoint
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
    public decimal Value { get; set; }
}

/// <summary>
/// Top performers
/// </summary>
public class TopPerformersResponse
{
    public List<TopSellerDto> TopSellers { get; set; } = new();
    public List<TopBuyerDto> TopBuyers { get; set; } = new();
    public List<TopListingDto> TopListings { get; set; } = new();
}

public class TopSellerDto
{
    public int MemberId { get; set; }
    public string? DisplayName { get; set; }
    public int TotalSales { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class TopBuyerDto
{
    public int MemberId { get; set; }
    public string? DisplayName { get; set; }
    public int TotalPurchases { get; set; }
    public decimal TotalSpent { get; set; }
}

public class TopListingDto
{
    public int ListingId { get; set; }
    public string? Title { get; set; }
    public int ViewCount { get; set; }
    public int FavoriteCount { get; set; }
}