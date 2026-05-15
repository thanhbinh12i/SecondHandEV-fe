using BLL.DTO;
using BLL.DTO.Listing;
using BLL.Interfaces;
using DAL;
using DAL.Interfaces;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ListingService : IListingService
    {
        private readonly IListingRepository _repo;
        private readonly VehicleBatteryMarketDbContext _db;
        private readonly IAuctionService _auctionService; // NEW

        public ListingService(
            IListingRepository repo,
            VehicleBatteryMarketDbContext db,
            IAuctionService auctionService)                 // NEW
        {
            _repo = repo;
            _db = db;
            _auctionService = auctionService;              // NEW
        }

        public async Task<PagedResult<ListingDto>> SearchAsync(ListingSearchRequest req)
        {
            var (items, total) = await _repo.SearchAsync(
                req.Keyword, req.CategoryId, req.MinPrice, req.MaxPrice,
                req.ListingType, req.ListingStatus, req.YearFrom, req.YearTo,
                req.SortBy ?? "createdAt",
                (req.SortDir ?? "desc").Equals("asc", StringComparison.OrdinalIgnoreCase),
                Math.Max(1, req.Page),
                Math.Clamp(req.PageSize, 1, 200));

            return new PagedResult<ListingDto>
            {
                Items = items.Select(ToDto).ToList(),
                TotalItems = total,
                Page = Math.Max(1, req.Page),
                PageSize = Math.Clamp(req.PageSize, 1, 200)
            };
        }

        public async Task<ListingDto?> GetByIdAsync(int id)
        {
            var e = await _repo.GetWithDetailsAsync(id);
            return e == null ? null : ToDto(e);
        }

        public async Task<int> CreateAsync(int memberId, ListingCreateRequest req)
        {
            var listing = new Listing
            {
                MemberId = memberId,
                CategoryId = req.CategoryId,
                Title = req.Title,
                Description = req.Description,
                Year = req.Year,
                Price = req.Price,
                CommissionPrice = req.CommissionPrice ?? 0,
                ListingType = string.IsNullOrWhiteSpace(req.ListingType) ? "sale" : req.ListingType!.ToLower(),
                ListingStatus = string.IsNullOrWhiteSpace(req.ListingStatus) ? "active" : req.ListingStatus,
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(listing);
            await _repo.SaveChangesAsync();

            // Images
            var imgs = new List<(string Url, bool IsPrimary)>();
            if (!string.IsNullOrWhiteSpace(req.PrimaryImageUrl)) imgs.Add((req.PrimaryImageUrl!, true));
            if (req.ImageUrls != null)
                imgs.AddRange(req.ImageUrls.Where(u => !string.IsNullOrWhiteSpace(u)).Select(u => (u, false)));
            if (imgs.Count > 0) await _repo.ReplaceImagesAsync(listing.ListingId, imgs);

            // Sub-details (tối thiểu brand/model cho create chung)
            if (!string.IsNullOrWhiteSpace(req.Brand) || !string.IsNullOrWhiteSpace(req.Model))
            {
                if (req.CategoryId == 1)
                {
                    _db.BatteryDetails.Add(new BatteryDetail
                    {
                        ListingId = listing.ListingId,
                        Brand = req.Brand,
                        Model = req.Model
                    });
                }
                else if (req.CategoryId == 2)
                {
                    _db.EbikeDetails.Add(new EbikeDetail
                    {
                        ListingId = listing.ListingId,
                        Brand = req.Brand,
                        Model = req.Model
                    });
                }
            }

            await _repo.SaveChangesAsync();
            return listing.ListingId;
        }

        public async Task<bool> UpdateAsync(int id, int memberId, ListingUpdateRequest req)
        {
            var e = await _repo.GetWithDetailsAsync(id);
            if (e == null || e.MemberId != memberId) return false;

            if (req.Title != null) e.Title = req.Title;
            if (req.Description != null) e.Description = req.Description;
            if (req.Year.HasValue && req.Year > 0) e.Year = req.Year;
            if (req.Price > 0) e.Price = req.Price;

            // ====== Detect change ListingType ======
            if (req.ListingType != null)
            {
                var target = req.ListingType.ToLower().Trim();
                if (target != "sale" && target != "auction")
                    throw new InvalidOperationException("listingType must be either 'sale' or 'auction'.");

                var current = (e.ListingType ?? "").ToLower();

                if (target == "auction" && current != "auction")
                {
                    // Đã có auction?
                    var existed = await _db.Auctions.AnyAsync(a => a.ListingId == e.ListingId);
                    if (!existed)
                    {
                        // dựng tham số mặc định nếu không truyền
                        var start = req.AuctionStartDate ?? DateTime.UtcNow.AddMinutes(1);
                        var end = req.AuctionEndDate ?? start.AddDays(7);
                        var startPrice = req.AuctionStartingPrice ?? (e.Price > 0 ? e.Price : 1);

                        await _auctionService.CreateAuction(new AuctionCreateRequest
                        {
                            ListingId = e.ListingId,
                            StartingPrice = startPrice,
                            StartDate = start,
                            EndDate = end
                        }, memberId);
                    }
                    e.ListingType = "auction";
                }
                else if (target == "sale" && current != "sale")
                {
                    // nếu có auction thì xoá (service có rule bảo vệ)
                    e.ListingType = "sale";
                }
            }

            if (req.ListingStatus != null) e.ListingStatus = req.ListingStatus;
            if (req.CommissionPrice != null) e.CommissionPrice = (decimal)req.CommissionPrice;

            _repo.Update(e);

            // Replace images nếu cung cấp
            if (req.PrimaryImageUrl != null || req.ImageUrls != null)
            {
                var imgs = new List<(string Url, bool IsPrimary)>();
                if (!string.IsNullOrWhiteSpace(req.PrimaryImageUrl)) imgs.Add((req.PrimaryImageUrl!, true));
                if (req.ImageUrls != null)
                    imgs.AddRange(req.ImageUrls.Where(u => !string.IsNullOrWhiteSpace(u)).Select(u => (u, false)));
                await _repo.ReplaceImagesAsync(e.ListingId, imgs);
            }

            // ===== Update full sub-details theo loại hiện có =====
            if (e.BatteryDetail != null)
            {
                // chung
                if (req.Brand != null) e.BatteryDetail.Brand = req.Brand;
                if (req.Model != null) e.BatteryDetail.Model = req.Model;
                if (req.Condition != null) e.BatteryDetail.Condition = req.Condition;
                if (req.WeightKg.HasValue) e.BatteryDetail.WeightKg = req.WeightKg;

                // battery-only
                if (req.Voltage.HasValue) e.BatteryDetail.Voltage = req.Voltage;
                if (req.CapacityWh.HasValue) e.BatteryDetail.CapacityWh = req.CapacityWh;
                if (req.AgeYears.HasValue) e.BatteryDetail.AgeYears = req.AgeYears;
            }
            else if (e.EbikeDetail != null)
            {
                // chung
                if (req.Brand != null) e.EbikeDetail.Brand = req.Brand;
                if (req.Model != null) e.EbikeDetail.Model = req.Model;
                if (req.Condition != null) e.EbikeDetail.Condition = req.Condition;
                if (req.WeightKg.HasValue) e.EbikeDetail.WeightKg = req.WeightKg;

                // ebike-only
                if (req.MotorPowerW.HasValue) e.EbikeDetail.MotorPowerW = req.MotorPowerW;
                if (req.BatteryVoltage.HasValue) e.EbikeDetail.BatteryVoltage = req.BatteryVoltage;
                if (req.RangeKm.HasValue) e.EbikeDetail.RangeKm = req.RangeKm;
                if (req.FrameSize != null) e.EbikeDetail.FrameSize = req.FrameSize;
                if (req.MileageKm.HasValue) e.EbikeDetail.MileageKm = req.MileageKm;
                if (req.YearOfManufacture.HasValue) e.EbikeDetail.YearOfManufacture = req.YearOfManufacture;
            }

            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id, int memberId)
        {
            var e = await _repo.GetWithDetailsAsync(id);
            if (e == null || e.MemberId != memberId) return false;

            await _repo.DeleteSubDetailsIfAnyAsync(e.ListingId);
            _repo.Remove(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResult<ListingDto>> GetMyListingsAsync(int memberId, MyListingSearchRequest req)
        {
            var (items, total) = await _repo.GetByMemberAsync(
                memberId,
                req.Status,
                req.SortBy ?? "createdAt",
                (req.SortDir ?? "desc").Equals("asc", StringComparison.OrdinalIgnoreCase),
                Math.Max(1, req.Page),
                Math.Clamp(req.PageSize, 1, 200));

            return new PagedResult<ListingDto>
            {
                Items = items.Select(ToDto).ToList(),
                TotalItems = total,
                Page = Math.Max(1, req.Page),
                PageSize = Math.Clamp(req.PageSize, 1, 200)
            };
        }

        public Task<bool> UpdateStatusAsync(int id, string status)
            => _repo.UpdateStatusAsync(id, status);

        public async Task<int> CreateBatteryAsync(int memberId, CreateBatteryListingRequest req)
        {
            var listing = new Listing
            {
                MemberId = memberId,
                CategoryId = 1,
                Title = req.Title,
                Description = req.Description,
                Year = req.Year,
                Price = req.Price,
                CommissionPrice = req.CommissionPrice ?? 0,
                ListingType = string.IsNullOrWhiteSpace(req.ListingType) ? "sale" : req.ListingType!.ToLower(),
                ListingStatus = string.IsNullOrWhiteSpace(req.ListingStatus) ? "draft" : req.ListingStatus,
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(listing);
            await _repo.SaveChangesAsync();

            _db.BatteryDetails.Add(new BatteryDetail
            {
                ListingId = listing.ListingId,
                Brand = req.Brand,
                Model = req.Model,
                Voltage = req.Voltage,
                CapacityWh = req.CapacityWh,
                WeightKg = req.WeightKg,
                Condition = req.Condition,
                AgeYears = req.AgeYears
            });

            var imgs = new List<(string Url, bool IsPrimary)>();
            if (!string.IsNullOrWhiteSpace(req.PrimaryImageUrl)) imgs.Add((req.PrimaryImageUrl!, true));
            if (req.ImageUrls != null)
                imgs.AddRange(req.ImageUrls.Where(u => !string.IsNullOrWhiteSpace(u)).Select(u => (u, false)));
            if (imgs.Count > 0) await _repo.ReplaceImagesAsync(listing.ListingId, imgs);

            await _repo.SaveChangesAsync();
            return listing.ListingId;
        }

        public async Task<int> CreateEbikeAsync(int memberId, CreateEbikeListingRequest req)
        {
            var listing = new Listing
            {
                MemberId = memberId,
                CategoryId = 2,
                Title = req.Title,
                Description = req.Description,
                Year = req.Year,
                Price = req.Price,
                CommissionPrice = req.CommissionPrice ?? 0,
                ListingType = string.IsNullOrWhiteSpace(req.ListingType) ? "sale" : req.ListingType!.ToLower(),
                ListingStatus = string.IsNullOrWhiteSpace(req.ListingStatus) ? "draft" : req.ListingStatus,
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(listing);
            await _repo.SaveChangesAsync();

            _db.EbikeDetails.Add(new EbikeDetail
            {
                ListingId = listing.ListingId,
                Brand = req.Brand,
                Model = req.Model,
                MotorPowerW = req.MotorPowerW,
                BatteryVoltage = req.BatteryVoltage,
                RangeKm = req.RangeKm,
                FrameSize = req.FrameSize,
                Condition = req.Condition,
                MileageKm = req.MileageKm,
                WeightKg = req.WeightKg,
                YearOfManufacture = req.YearOfManufacture
            });

            var imgs = new List<(string Url, bool IsPrimary)>();
            if (!string.IsNullOrWhiteSpace(req.PrimaryImageUrl)) imgs.Add((req.PrimaryImageUrl!, true));
            if (req.ImageUrls != null)
                imgs.AddRange(req.ImageUrls.Where(u => !string.IsNullOrWhiteSpace(u)).Select(u => (u, false)));
            if (imgs.Count > 0) await _repo.ReplaceImagesAsync(listing.ListingId, imgs);

            await _repo.SaveChangesAsync();
            return listing.ListingId;
        }

        private static ListingDto ToDto(Listing e)
        {
            var primary = e.ListingImages.FirstOrDefault(i => i.IsPrimary == true)?.Url
                          ?? e.ListingImages.FirstOrDefault()?.Url;

            return new ListingDto
            {
                ListingId = e.ListingId,
                MemberId = e.MemberId,
                CategoryId = e.CategoryId,
                CategoryName = e.Category?.Name,
                Title = e.Title,
                Description = e.Description,
                Year = e.Year,
                Price = e.Price,
                CommissionPrice = e.CommissionPrice,
                ListingType = e.ListingType,
                ListingStatus = e.ListingStatus,
                CreatedAt = e.CreatedAt,
                SellerDisplayName = e.Member?.DisplayName,
                SellerEmail = e.Member?.Email,
                PrimaryImageUrl = primary,
                ImageUrls = e.ListingImages.Select(i => i.Url).ToList(),
                Brand = e.BatteryDetail?.Brand ?? e.EbikeDetail?.Brand,
                Model = e.BatteryDetail?.Model ?? e.EbikeDetail?.Model,

                Battery = e.BatteryDetail == null ? null : new BatteryDetailDto
                {
                    Brand = e.BatteryDetail.Brand,
                    Model = e.BatteryDetail.Model,
                    Voltage = e.BatteryDetail.Voltage,
                    CapacityWh = e.BatteryDetail.CapacityWh,
                    WeightKg = e.BatteryDetail.WeightKg,
                    Condition = e.BatteryDetail.Condition,
                    AgeYears = e.BatteryDetail.AgeYears
                },
                Ebike = e.EbikeDetail == null ? null : new EbikeDetailDto
                {
                    Brand = e.EbikeDetail.Brand,
                    Model = e.EbikeDetail.Model,
                    MotorPowerW = e.EbikeDetail.MotorPowerW,
                    BatteryVoltage = e.EbikeDetail.BatteryVoltage,
                    RangeKm = e.EbikeDetail.RangeKm,
                    FrameSize = e.EbikeDetail.FrameSize,
                    Condition = e.EbikeDetail.Condition,
                    MileageKm = e.EbikeDetail.MileageKm,
                    WeightKg = e.EbikeDetail.WeightKg,
                    YearOfManufacture = e.EbikeDetail.YearOfManufacture
                }
            };
        }
    }
}
