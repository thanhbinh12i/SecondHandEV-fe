using System;
using System.Threading.Tasks;
using BLL.DTO;
using BLL.DTO.Favorite;
using BLL.Interfaces;
using EVAndBatteryTradingAPI.Helper; 
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EVAndBatteryTradingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _service;

        public FavoritesController(IFavoriteService service)
        {
            _service = service;
        }

        // GET: api/favorites/my?page=1&pageSize=12
        [HttpGet("my")]
        [ProducesResponseType(typeof(PagedResult<FavoriteItemDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMy([FromQuery] int page = 1, [FromQuery] int pageSize = 12)
        {
            var memberId = User.GetLoggedInMemberId();
            var result = await _service.GetMyAsync(memberId, page, pageSize);
            return Ok(result);
        }

        // POST: api/favorites
        // Body: { "listingId": 123 }
        [HttpPost]
        [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] FavoriteCreateRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var memberId = User.GetLoggedInMemberId();
            var favId = await _service.AddAsync(memberId, req.ListingId);
            return CreatedAtAction(nameof(Check), new { listingId = req.ListingId }, new { favoriteId = favId });
        }

        // GET: api/favorites/check/123  -> true/false
        [HttpGet("check/{listingId:int}")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        public async Task<IActionResult> Check([FromRoute] int listingId)
        {
            var memberId = User.GetLoggedInMemberId();
            var ok = await _service.IsFavoritedAsync(memberId, listingId);
            return Ok(new { listingId, isFavorited = ok });
        }

        // DELETE: api/favorites/123  (listingId)
        [HttpDelete("{listingId:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete([FromRoute] int listingId)
        {
            var memberId = User.GetLoggedInMemberId();
            await _service.RemoveAsync(memberId, listingId);
            return NoContent();
        }
    }
}
