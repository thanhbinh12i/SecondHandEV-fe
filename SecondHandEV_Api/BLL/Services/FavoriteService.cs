using System;
using System.Linq;
using System.Threading.Tasks;
using BLL.DTO;
using BLL.DTO.Favorite;
using BLL.DTO.Listing;
using BLL.Interfaces;
using DAL.Interfaces;
using DAL.Models;

namespace BLL.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favRepo;

        public FavoriteService(IFavoriteRepository favRepo)
        {
            _favRepo = favRepo;
        }

        public async Task<int> AddAsync(int memberId, int listingId)
        {
            if (await _favRepo.ExistsAsync(memberId, listingId))
                return (await _favRepo.GetByMemberAndListingAsync(memberId, listingId))!.FavoriteId;

            var fav = new Favorite
            {
                MemberId = memberId,
                ListingId = listingId,
                CreatedAt = DateTime.UtcNow
            };
            await _favRepo.AddAsync(fav);
            await _favRepo.SaveChangesAsync();
            return fav.FavoriteId;
        }

        public async Task<bool> RemoveAsync(int memberId, int listingId)
        {
            var exists = await _favRepo.ExistsAsync(memberId, listingId);
            if (!exists) return false;

            await _favRepo.RemoveByMemberAndListingAsync(memberId, listingId);
            return true;
        }

        public async Task<bool> IsFavoritedAsync(int memberId, int listingId)
            => await _favRepo.ExistsAsync(memberId, listingId);

        public async Task<PagedResult<FavoriteItemDto>> GetMyAsync(int memberId, int page, int pageSize)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);

            var (items, total) = await _favRepo.GetByMemberAsync(memberId, page, pageSize);

            var dtos = items
                .Where(f => f.Listing != null)
                .Select(f =>
                {
                    var e = f.Listing!;
                    var primary = e.ListingImages.FirstOrDefault(i => i.IsPrimary == true)?.Url
                                  ?? e.ListingImages.FirstOrDefault()?.Url;

                    return new FavoriteItemDto
                    {
                        FavoriteId = f.FavoriteId,
                        IsFavorited = true,
                        ListingId = e.ListingId,
                        MemberId = e.MemberId,
                        CategoryId = e.CategoryId,
                        CategoryName = e.Category?.Name,
                        Title = e.Title,
                        Description = e.Description,
                        Year = e.Year,
                        Price = e.Price,
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
                })
                .ToList();

            return new PagedResult<FavoriteItemDto>
            {
                Items = dtos,
                TotalItems = total,
                Page = page,
                PageSize = pageSize
            };
        }
    }
}
