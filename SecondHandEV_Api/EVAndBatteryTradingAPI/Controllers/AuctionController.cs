using BLL.DTO;
using BLL.Interfaces;
using BLL.Services;
using EVAndBatteryTradingAPI.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace APIEVAndBatteryTradingAPI.Controllers
{
    [ApiController]
    [Route("api/auction")]

    public class AuctionController : ControllerBase
    {
        private readonly IAuctionService _auctionService;
        private readonly IBidService _bidService;

        public AuctionController(IAuctionService auctionService, IBidService bidService)
        {
            _auctionService = auctionService;
            _bidService = bidService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllAuctions([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var result = await _auctionService.GetAllAuctions(page, pageSize);
                return Ok(new
                {
                    success = true,
                    message = "Auctions retrieved successfully",
                    data = result.Items,
                    page = result.Page,
                    pageSize = result.PageSize,
                    total = result.TotalItems
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [Authorize]
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveAuctions([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var result = await _auctionService.GetActiveAuctions(page, pageSize);
                return Ok(new
                {
                    success = true,
                    message = "Active auctions retrieved successfully",
                    data = result.Items,
                    page = result.Page,
                    pageSize = result.PageSize,
                    total = result.TotalItems
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyAuctions([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = User.GetLoggedInMemberId();
                var result = await _auctionService.GetAuctionsBySellerId(userId, page, pageSize);
                return Ok(new
                {
                    success = true,
                    message = "Your auctions retrieved successfully",
                    data = result.Items,
                    page = result.Page,
                    pageSize = result.PageSize,
                    total = result.TotalItems
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuctionById(int id)
        {
            try
            {
                var auction = await _auctionService.GetAuctionById(id);
                if (auction == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Auction not found"
                    });
                }
                return Ok(new
                {
                    success = true,
                    message = "Auction retrieved successfully",
                    data = auction
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [HttpGet("listing/{listingId}")]
        public async Task<IActionResult> GetAuctionByListingId(int listingId)
        {
            try
            {
                var auction = await _auctionService.GetAuctionByListingId(listingId);
                if (auction == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "No auction found for this listing"
                    });
                }
                return Ok(new
                {
                    success = true,
                    message = "Auction retrieved successfully",
                    data = auction
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateAuction([FromBody] AuctionCreateRequest request)
        {
            try
            {
                var memberId = User.GetLoggedInMemberId();
                var auction = await _auctionService.CreateAuction(request, memberId);
                return Ok(new
                {
                    success = true,
                    message = "Auction created successfully",
                    data = auction
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuction(int id, [FromBody] AuctionUpdateRequest request)
        {
            try
            {
                var userId = User.GetLoggedInMemberId();
                var auction = await _auctionService.GetAuctionById(id);
                if (auction == null)
                {
                    return NotFound(new { success = false, message = "Auction not found" });
                }
                if (auction.Seller == null || auction.Seller.MemberId != userId)
                {
                    return Forbid();
                }
/*                if (id != request.Id)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID mismatch"
                    });
                }*/
                var result = await _auctionService.UpdateAuction(id, request);
                return Ok(new
                {
                    success = true,
                    message = "Auction updated successfully",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuction(int id)
        {
            try
            {
                var userId = User.GetLoggedInMemberId();
                var auction = await _auctionService.GetAuctionById(id);
                if (auction == null)
                {
                    return NotFound(new { success = false, message = "Auction not found" });
                }
                if (auction.Seller == null || auction.Seller.MemberId != userId)
                {
                    return Forbid();
                }
                // Prevent deletion if auction has ended and there exists a highest bid
                if (auction.EndDate <= DateTime.UtcNow)
                {
                    var highestBid = await _bidService.GetHighestBid(id);
                    if (highestBid != null)
                    {
                        return BadRequest(new { success = false, message = "Cannot delete an ended auction with existing highest bid. It serves as proof." });
                    }
                }
                await _auctionService.DeleteAuction(id);
                return Ok(new
                {
                    success = true,
                    message = "Auction deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [Authorize]
        // Bid Endpoints
        [HttpPost("{auctionId}/bids")]
        public async Task<IActionResult> PlaceBid(int auctionId, [FromBody] BidCreateRequest request)
        {
            try
            {
                var bidderId = User.GetLoggedInMemberId();
                var bid = await _bidService.PlaceBid(auctionId, request, bidderId);
                return Ok(new
                {
                    success = true,
                    message = "Bid placed successfully",
                    data = bid
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [HttpGet("{auctionId}/bids")]
        public async Task<IActionResult> GetBidsByAuction(int auctionId, [FromQuery] string? sortBy = null, [FromQuery] string? sortDir = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var result = await _bidService.GetBidsByAuctionId(auctionId, page, pageSize, sortBy, sortDir);
                return Ok(new
                {
                    success = true,
                    message = "Bids retrieved successfully",
                    data = result.Items,
                    page = result.Page,
                    pageSize = result.PageSize,
                    total = result.TotalItems
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [Authorize]
        [HttpGet("{auctionId}/bids/highest")]
        public async Task<IActionResult> GetHighestBid(int auctionId)
        {
            try
            {
                var bid = await _bidService.GetHighestBid(auctionId);
                if (bid == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "No bids found for this auction"
                    });
                }
                return Ok(new
                {
                    success = true,
                    message = "Highest bid retrieved successfully",
                    data = bid
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

    }

    [ApiController]
    [Route("api/bid")]
    [Authorize]
    public class BidController : ControllerBase
    {
        private readonly IBidService _bidService;

        public BidController(IBidService bidService)
        {
            _bidService = bidService;
        }
        [HttpGet("my")]
        public async Task<IActionResult> GetMyBids([FromQuery] int? auctionId = null, [FromQuery] string? sortBy = null, [FromQuery] string? sortDir = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = User.GetLoggedInMemberId();
                var result = await _bidService.GetBidsByBidderId(userId, auctionId, page, pageSize, sortBy, sortDir);
                return Ok(new
                {
                    success = true,
                    message = "Your bids retrieved successfully",
                    data = result.Items,
                    page = result.Page,
                    pageSize = result.PageSize,
                    total = result.TotalItems
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [HttpGet("bidder/{bidderId}")]
        public async Task<IActionResult> GetBidsByBidder(int bidderId, [FromQuery] int? auctionId = null, [FromQuery] string? sortBy = null, [FromQuery] string? sortDir = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var result = await _bidService.GetBidsByBidderId(bidderId, auctionId, page, pageSize, sortBy, sortDir);
                return Ok(new
                {
                    success = true,
                    message = "Bids retrieved successfully",
                    data = result.Items,
                    page = result.Page,
                    pageSize = result.PageSize,
                    total = result.TotalItems
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

    }

}