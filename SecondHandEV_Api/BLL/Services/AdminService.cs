using BLL.DTO;
using BLL.Interfaces;
using DAL;
using DAL.Enums;
using DAL.Interfaces;
using DAL.Models;
using DAL.Repositories;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services;

public class AdminService : IAdminService
{
    private readonly VehicleBatteryMarketDbContext _context;
    private readonly IMemberRepository _memberRepository;

    public AdminService(VehicleBatteryMarketDbContext context, IMemberRepository memberRepository)
    {
        _context = context;
        _memberRepository = memberRepository;
    }

    // ==================== User Management ====================

    public async Task<UserListResponse> GetAllUsersAsync(int page = 1, int pageSize = 10, string? searchTerm = null, bool? isActive = null)
    {
        var query = _context.Members
            .Include(m => m.MemberProfile)
            .Include(m => m.Listings)
            .Include(m => m.OrderBuyers)
            .Include(m => m.ReviewReviewers)
            .AsQueryable();

        // Filter by search term
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.ToLower();
            query = query.Where(m =>
                m.Email!.ToLower().Contains(searchTerm) ||
                m.DisplayName!.ToLower().Contains(searchTerm) ||
                (m.Phone != null && m.Phone.Contains(searchTerm))
            );
        }

        // Filter by active status
        if (isActive.HasValue)
        {
            query = query.Where(m => m.IsActive == isActive.Value);
        }

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var users = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new UserDto
            {
                MemberId = m.MemberId,
                DisplayName = m.DisplayName,
                Email = m.Email,
                Phone = m.Phone,
                Role = m.Role, // ← NEW: Include Role
                IsActive = m.IsActive,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt,
                FullName = m.MemberProfile != null ? m.MemberProfile.FullName : null,
                Address = m.MemberProfile != null ? m.MemberProfile.Address : null,
                DateOfBirth = m.MemberProfile != null ? m.MemberProfile.DateOfBirth : null,
                TotalListings = m.Listings.Count,
                TotalOrders = m.OrderBuyers.Count,
                TotalReviews = m.ReviewReviewers.Count
            })
            .ToListAsync();

        return new UserListResponse
        {
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages,
            Users = users
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(int memberId)
    {
        var member = await _context.Members
            .Include(m => m.MemberProfile)
            .Include(m => m.Listings)
            .Include(m => m.OrderBuyers)
            .Include(m => m.ReviewReviewers)
            .FirstOrDefaultAsync(m => m.MemberId == memberId);

        if (member == null)
            return null;

        return new UserDto
        {
            MemberId = member.MemberId,
            DisplayName = member.DisplayName,
            Email = member.Email,
            Phone = member.Phone,
            IsActive = member.IsActive,
            CreatedAt = member.CreatedAt,
            UpdatedAt = member.UpdatedAt,
            FullName = member.MemberProfile?.FullName,
            Address = member.MemberProfile?.Address,
            DateOfBirth = member.MemberProfile?.DateOfBirth,
            TotalListings = member.Listings.Count,
            TotalOrders = member.OrderBuyers.Count,
            TotalReviews = member.ReviewReviewers.Count
        };
    }

    public async Task<bool> UpdateUserAsync(int memberId, UpdateUserRequest request)
    {
        var member = await _memberRepository.GetByIdAsync(memberId);
        if (member == null)
            return false;

        // Update Member
        if (!string.IsNullOrWhiteSpace(request.DisplayName))
            member.DisplayName = request.DisplayName.Trim();

        if (!string.IsNullOrWhiteSpace(request.Phone))
            member.Phone = request.Phone.Trim();

        // ← NEW: Update Role (Admin có thể thay đổi)
        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            if (request.Role == "User" || request.Role == "Admin")
            {
                member.Role = request.Role;
            }
        }

        member.UpdatedAt = DateTime.UtcNow;
        _memberRepository.Update(member);

        // Update Profile
        var profile = await _context.MemberProfiles.FirstOrDefaultAsync(p => p.MemberId == memberId);
        if (profile != null)
        {
            if (!string.IsNullOrWhiteSpace(request.FullName))
                profile.FullName = request.FullName.Trim();

            if (!string.IsNullOrWhiteSpace(request.Address))
                profile.Address = request.Address.Trim();

            if (request.DateOfBirth.HasValue)
                profile.DateOfBirth = request.DateOfBirth.Value;

            if (!string.IsNullOrWhiteSpace(request.Bio))
                profile.Bio = request.Bio.Trim();

            _context.MemberProfiles.Update(profile);
        }

        await _memberRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleUserStatusAsync(int memberId, bool isActive, string? reason = null)
    {
        var member = await _memberRepository.GetByIdAsync(memberId);
        if (member == null)
            return false;

        member.IsActive = isActive;
        member.UpdatedAt = DateTime.UtcNow;
        _memberRepository.Update(member);

        // Log activity
        var log = new TransactionsLog
        {
            MemberId = memberId,
            EventType = isActive ? "user_activated" : "user_deactivated",
            Data = reason,
            CreatedAt = DateTime.UtcNow
        };
        await _context.TransactionsLogs.AddAsync(log);

        await _memberRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteUserAsync(int memberId)
    {
        var member = await _memberRepository.GetByIdAsync(memberId);
        if (member == null)
            return false;

        // Soft delete - chỉ set IsActive = false
        member.IsActive = false;
        member.UpdatedAt = DateTime.UtcNow;
        _memberRepository.Update(member);

        await _memberRepository.SaveChangesAsync();
        return true;
    }

    // ==================== Dashboard Statistics ====================

    public async Task<DashboardStatsResponse> GetDashboardStatsAsync()
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1);
        var startOfLastMonth = startOfMonth.AddMonths(-1);
        var startOfDay = now.Date;

        // User Stats
        var totalUsers = await _context.Members.CountAsync();
        var activeUsers = await _context.Members.CountAsync(m => m.IsActive == true);
        var inactiveUsers = totalUsers - activeUsers;
        var newUsersThisMonth = await _context.Members.CountAsync(m => m.CreatedAt >= startOfMonth);
        var newUsersToday = await _context.Members.CountAsync(m => m.CreatedAt >= startOfDay);
        var newUsersLastMonth = await _context.Members.CountAsync(m => m.CreatedAt >= startOfLastMonth && m.CreatedAt < startOfMonth);
        var userGrowthRate = newUsersLastMonth > 0 ? ((newUsersThisMonth - newUsersLastMonth) / (double)newUsersLastMonth) * 100 : 0;

        // Listing Stats
        var totalListings = await _context.Listings.CountAsync();
        var activeListings = await _context.Listings.CountAsync(l => l.ListingStatus == "active");
        var draftListings = await _context.Listings.CountAsync(l => l.ListingStatus == "draft");
        var soldListings = await _context.Listings.CountAsync(l => l.ListingStatus == "sold");
        var newListingsThisMonth = await _context.Listings.CountAsync(l => l.CreatedAt >= startOfMonth);
        var newListingsToday = await _context.Listings.CountAsync(l => l.CreatedAt >= startOfDay);

        // Order Stats
        var totalOrders = await _context.Orders.CountAsync();
        var pendingOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Pending);
        var completedOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Completed);
        var cancelledOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Cancelled);
        var newOrdersThisMonth = await _context.Orders.CountAsync(o => o.CreatedAt >= startOfMonth);
        var newOrdersToday = await _context.Orders.CountAsync(o => o.CreatedAt >= startOfDay);

        // Revenue Stats
        var totalRevenue = await _context.Orders.SumAsync(o => (decimal?)o.OrderAmount) ?? 0;
        var revenueThisMonth = await _context.Orders.Where(o => o.CreatedAt >= startOfMonth).SumAsync(o => (decimal?)o.OrderAmount) ?? 0;
        var revenueToday = await _context.Orders.Where(o => o.CreatedAt >= startOfDay).SumAsync(o => (decimal?)o.OrderAmount) ?? 0;
        var revenueLastMonth = await _context.Orders.Where(o => o.CreatedAt >= startOfLastMonth && o.CreatedAt < startOfMonth).SumAsync(o => (decimal?)o.OrderAmount) ?? 0;
        var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        var revenueGrowthRate = revenueLastMonth > 0 ? (double)((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 : 0;

        return new DashboardStatsResponse
        {
            Users = new UserStats
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                InactiveUsers = inactiveUsers,
                NewUsersThisMonth = newUsersThisMonth,
                NewUsersToday = newUsersToday,
                GrowthRate = userGrowthRate
            },
            Listings = new ListingStats
            {
                TotalListings = totalListings,
                ActiveListings = activeListings,
                DraftListings = draftListings,
                SoldListings = soldListings,
                NewListingsThisMonth = newListingsThisMonth,
                NewListingsToday = newListingsToday
            },
            Orders = new OrderStats
            {
                TotalOrders = totalOrders,
                PendingOrders = pendingOrders,
                CompletedOrders = completedOrders,
                CancelledOrders = cancelledOrders,
                NewOrdersThisMonth = newOrdersThisMonth,
                NewOrdersToday = newOrdersToday
            },
            Revenue = new RevenueStats
            {
                TotalRevenue = totalRevenue,
                RevenueThisMonth = revenueThisMonth,
                RevenueToday = revenueToday,
                AverageOrderValue = averageOrderValue,
                RevenueGrowthRate = revenueGrowthRate
            }
        };
    }

    public async Task<RecentActivityResponse> GetRecentActivitiesAsync(int count = 10)
    {
        var activities = await _context.TransactionsLogs
            .Include(t => t.Member)
            .OrderByDescending(t => t.CreatedAt)
            .Take(count)
            .Select(t => new ActivityDto
            {
                ActivityId = t.TxnId,
                ActivityType = t.EventType,
                Description = t.Data ?? "",
                UserId = t.MemberId,
                UserName = t.Member != null ? t.Member.DisplayName : null,
                CreatedAt = t.CreatedAt ?? DateTime.UtcNow
            })
            .ToListAsync();

        return new RecentActivityResponse { Activities = activities };
    }

    public async Task<TimeSeriesStatsResponse> GetTimeSeriesStatsAsync(DateTime startDate, DateTime endDate)
    {
        var userRegistrations = await _context.Members
            .Where(m => m.CreatedAt >= startDate && m.CreatedAt <= endDate)
            .GroupBy(m => m.CreatedAt!.Value.Date)
            .Select(g => new TimeSeriesDataPoint
            {
                Date = g.Key,
                Count = g.Count(),
                Value = 0
            })
            .OrderBy(d => d.Date)
            .ToListAsync();

        var listingCreations = await _context.Listings
            .Where(l => l.CreatedAt >= startDate && l.CreatedAt <= endDate)
            .GroupBy(l => l.CreatedAt!.Value.Date)
            .Select(g => new TimeSeriesDataPoint
            {
                Date = g.Key,
                Count = g.Count(),
                Value = 0
            })
            .OrderBy(d => d.Date)
            .ToListAsync();

        var orderVolume = await _context.Orders
            .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate)
            .GroupBy(o => o.CreatedAt!.Value.Date)
            .Select(g => new TimeSeriesDataPoint
            {
                Date = g.Key,
                Count = g.Count(),
                Value = g.Sum(o => o.OrderAmount)
            })
            .OrderBy(d => d.Date)
            .ToListAsync();

        return new TimeSeriesStatsResponse
        {
            UserRegistrations = userRegistrations,
            ListingCreations = listingCreations,
            OrderVolume = orderVolume,
            Revenue = orderVolume
        };
    }

    public async Task<TopPerformersResponse> GetTopPerformersAsync(int count = 10)
    {
        var topSellers = await _context.Orders
            .GroupBy(o => o.SellerId)
            .Select(g => new
            {
                MemberId = g.Key,
                TotalSales = g.Count(),
                TotalRevenue = g.Sum(o => o.OrderAmount)
            })
            .OrderByDescending(x => x.TotalRevenue)
            .Take(count)
            .Join(_context.Members, x => x.MemberId, m => m.MemberId, (x, m) => new TopSellerDto
            {
                MemberId = m.MemberId,
                DisplayName = m.DisplayName,
                TotalSales = x.TotalSales,
                TotalRevenue = x.TotalRevenue
            })
            .ToListAsync();

        var topBuyers = await _context.Orders
            .GroupBy(o => o.BuyerId)
            .Select(g => new
            {
                MemberId = g.Key,
                TotalPurchases = g.Count(),
                TotalSpent = g.Sum(o => o.OrderAmount)
            })
            .OrderByDescending(x => x.TotalSpent)
            .Take(count)
            .Join(_context.Members, x => x.MemberId, m => m.MemberId, (x, m) => new TopBuyerDto
            {
                MemberId = m.MemberId,
                DisplayName = m.DisplayName,
                TotalPurchases = x.TotalPurchases,
                TotalSpent = x.TotalSpent
            })
            .ToListAsync();

        var topListings = await _context.Listings
            .Select(l => new
            {
                l.ListingId,
                l.Title,
                FavoriteCount = l.Favorites.Count
            })
            .OrderByDescending(x => x.FavoriteCount)
            .Take(count)
            .Select(x => new TopListingDto
            {
                ListingId = x.ListingId,
                Title = x.Title,
                ViewCount = 0, // Có thể thêm tracking view count sau
                FavoriteCount = x.FavoriteCount
            })
            .ToListAsync();

        return new TopPerformersResponse
        {
            TopSellers = topSellers,
            TopBuyers = topBuyers,
            TopListings = topListings
        };
    }
}