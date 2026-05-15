using BLL.DTO;
using BLL.Interfaces;
using DAL.Enums;
using DAL.Interfaces;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class AuctionService : IAuctionService
    {
        private readonly IAuctionRepository _auctionRepository;
        private readonly IListingRepository _listingRepository;
        private readonly IMemberRepository _memberRepository;

        public AuctionService(
            IAuctionRepository auctionRepository,
            IListingRepository listingRepository,
            IMemberRepository memberRepository)
        {
            _auctionRepository = auctionRepository;
            _listingRepository = listingRepository;
            _memberRepository = memberRepository;
        }

        public async Task<AuctionResponse> CreateAuction(AuctionCreateRequest auction, int memberId)
        {
            if (auction.EndDate <= auction.StartDate)
                throw new Exception("End date must be after start date.");
            if (auction.StartDate <= DateTime.UtcNow)
                throw new Exception("Start date must be in the future.");
            if (auction.EndDate <= DateTime.UtcNow)
                throw new Exception("End date must be in the future.");
            if (auction.StartingPrice <= 0)
                throw new Exception("Starting price must be greater than zero.");

            var listing = await _listingRepository.GetByIdAsync(auction.ListingId)
                          ?? throw new Exception("Listing not found.");
            if (listing.MemberId != memberId)
                throw new UnauthorizedAccessException("You are not the owner of this listing.");

            // Không cho tạo trùng auction theo ListingId
            var existed = await _auctionRepository.GetByListingId(auction.ListingId);
            if (existed != null)
                throw new Exception("An auction for this listing already exists.");

            // đồng bộ type
            listing.ListingType = "auction";
            _listingRepository.Update(listing);

            var auctionEntity = new Auction
            {
                ListingId = auction.ListingId,
                StartPrice = auction.StartingPrice,
                AuctionStart = auction.StartDate,
                AuctionEnd = auction.EndDate,
            };
            var created = await _auctionRepository.CreateAuction(auctionEntity);
            return await MapToResponseAsync(created);
        }

        public async Task DeleteAuction(int auctionId)
        {
            // Get auction before deleting to update listing type
            var auction = await _auctionRepository.GetAuctionById(auctionId);
            if (auction != null)
            {
                if (auction.AuctionStart <= DateTime.UtcNow)
                    throw new Exception("Cannot delete an auction that has already started.");
                if (auction.CurrentWinner != null)
                    throw new Exception("Cannot delete an auction that has bids.");

                var listing = await _listingRepository.GetByIdAsync(auction.ListingId);
                if (listing != null)
                {
                    listing.ListingType = "sale";
                    _listingRepository.Update(listing);
                }
            }

            await _auctionRepository.DeleteAuction(auctionId);
        }

        public async Task<PagedResult<AuctionResponse>> GetActiveAuctions(int page, int pageSize)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var (items, total) = await _auctionRepository.GetActiveAsync(page, pageSize);
            var responses = new List<AuctionResponse>(items.Count);
            foreach (var auction in items)
            {
                responses.Add(await MapToResponseAsync(auction));
            }
            return new PagedResult<AuctionResponse>
            {
                Items = responses,
                TotalItems = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<AuctionResponse>> GetAllAuctions(int page, int pageSize)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var (items, total) = await _auctionRepository.GetAllAsync(page, pageSize);
            var responses = new List<AuctionResponse>(items.Count);
            foreach (var auction in items)
            {
                responses.Add(await MapToResponseAsync(auction));
            }
            return new PagedResult<AuctionResponse>
            {
                Items = responses,
                TotalItems = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<AuctionResponse?> GetAuctionById(int auctionId)
        {
            var auction = await _auctionRepository.GetAuctionById(auctionId);
            if (auction == null) return null;

            return await MapToResponseAsync(auction);
        }

        public async Task<AuctionResponse?> GetAuctionByListingId(int listingId)
        {
            var auction = await _auctionRepository.GetByListingId(listingId);
            if (auction == null) return null;

            return await MapToResponseAsync(auction);
        }

        public async Task<PagedResult<AuctionResponse>> GetAuctionsBySellerId(int sellerId, int page, int pageSize)
        {
            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);
            var (items, total) = await _auctionRepository.GetBySellerAsync(sellerId, page, pageSize);
            var responses = new List<AuctionResponse>(items.Count);
            foreach (var auction in items)
            {
                responses.Add(await MapToResponseAsync(auction));
            }
            return new PagedResult<AuctionResponse>
            {
                Items = responses,
                TotalItems = total,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<AuctionResponse> UpdateAuction(int auctionId, AuctionUpdateRequest update)
        {
            var auction = await _auctionRepository.GetAuctionById(auctionId)
                         ?? throw new Exception($"Auction with ID {auctionId} not found.");

            var effectiveStart = update.StartDate ?? auction.AuctionStart;
            var effectiveEnd = update.EndDate ?? auction.AuctionEnd;
            var effectiveStartPrice = update.StartingPrice ?? auction.StartPrice;

            if (effectiveEnd <= effectiveStart)
                throw new Exception("End date must be after start date.");
            if (effectiveStart <= DateTime.UtcNow)
                throw new Exception("Start date must be in the future.");
            if (effectiveEnd <= DateTime.UtcNow)
                throw new Exception("End date must be in the future.");
            if (update.StartingPrice.HasValue && effectiveStartPrice <= 0)
                throw new Exception("Starting price must be greater than zero.");
            if (auction.Bids != null && auction.Bids.Any())
                throw new Exception("Cannot update auction that already has bids.");

            auction.StartPrice = effectiveStartPrice;
            auction.AuctionStart = effectiveStart;
            auction.AuctionEnd = effectiveEnd;
            auction.Status = AuctionStatus.Upcoming;

            var updated = await _auctionRepository.UpdateAuction(auction);
            return await MapToResponseAsync(updated);
        }
        private async Task<AuctionResponse> MapToResponseAsync(Auction auction)
        {
            // Fetch listing details (may already be included via navigation property)
            var listing = await _listingRepository.GetListingByIdAsync(auction.ListingId);

            // Fetch seller details
            MemberInfoDto? seller = null;
            if (listing != null)
            {
                var sellerEntity = await _memberRepository.GetByIdAsync(listing.MemberId);
                if (sellerEntity != null)
                {
                    seller = new MemberInfoDto
                    {
                        MemberId = sellerEntity.MemberId,
                        DisplayName = sellerEntity.DisplayName,
                        Email = sellerEntity.Email,
                        Phone = sellerEntity.Phone
                    };
                }
            }


            return new AuctionResponse
            {
                Id = auction.AuctionId,
                Listing = listing != null ? new ListingInfoDto
                {
                    ListingId = listing.ListingId,
                    Title = listing.Title,
                    Description = listing.Description,
                    PrimaryImageURL = listing.ListingImages?.FirstOrDefault(x=>x.IsPrimary == true)?.Url ?? string.Empty,
                    Price = listing.Price,
                    ListingType = "auction" // lowercase nhất quán
                } : new ListingInfoDto { ListingId = auction.ListingId, ListingType = "auction" },
                StartingPrice = auction.StartPrice,
                CurrentPrice = auction.CurrentPrice,
                totalBids = auction.Bids?.Count ?? 0,
                StartDate = auction.AuctionStart,
                EndDate = auction.AuctionEnd,
                Status = auction.Status.ToString(),
                Seller = seller ?? new MemberInfoDto { MemberId = listing?.MemberId ?? 0 }
            };
        }
    }
}
