using BLL.DTO;                 // PagedResult<>
using BLL.DTO.Listing;         // ListingDto + all request DTOs
using BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EVAndBatteryTradingAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListingsController : ControllerBase
{
    private readonly IListingService _service;

    public ListingsController(IListingService service)
    {
        _service = service;
    }

    // =========================== SEARCH =========================

    // GET: api/listings/search?keyword=...&page=1&pageSize=12&sortBy=price&sortDir=asc
    [HttpGet("search")]
    [ProducesResponseType(typeof(PagedResult<ListingDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search([FromQuery] ListingSearchRequest req)
    {
        var result = await _service.SearchAsync(req);
        return Ok(result);
    }

    // =========================== GET BY ID =========================

    // GET: api/listings/5
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ListingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var dto = await _service.GetByIdAsync(id);
        if (dto == null) return NotFound();
        return Ok(dto);
    }

    // ====================== CREATE CHUNG ==============================

    // POST: api/listings
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] ListingCreateRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var memberId = GetMemberIdFromClaims();
        var newId = await _service.CreateAsync(memberId, req);
        return CreatedAtAction(nameof(GetById), new { id = newId }, new { listingId = newId });
    }

    // ======================== UPDATE/DELETE  ========================

    // PUT: api/listings/5
    [HttpPut("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] ListingUpdateRequest req)
    {
        var memberId = GetMemberIdFromClaims();
        var ok = await _service.UpdateAsync(id, memberId, req);
        if (!ok) return ForbidOrNotFound(id);
        return NoContent();
    }

    // DELETE: api/listings/5
    [HttpDelete("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var memberId = GetMemberIdFromClaims();
        var ok = await _service.DeleteAsync(id, memberId);
        if (!ok) return ForbidOrNotFound(id);
        return NoContent();
    }

    // ============================ 1) MY LISTINGS ===========================

    // GET: api/listings/my?status=active&page=1&pageSize=12&sortBy=createdAt&sortDir=desc
    [HttpGet("my")]
    [Authorize]
    [ProducesResponseType(typeof(PagedResult<ListingDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyListings([FromQuery] MyListingSearchRequest req)
    {
        var memberId = GetMemberIdFromClaims();
        var result = await _service.GetMyListingsAsync(memberId, req);
        return Ok(result);
    }

    // ======================= 2) PHÊ DUYỆT / CẬP NHẬT STATUS ============================

    // PUT: api/listings/{id}/status
    // Body: { "status": "active", "reason": "OK" }
    [HttpPut("{id:int}/status")]
    [Authorize] // nếu chưa bật role, có thể tạm dùng [Authorize] rồi check claim trong runtime
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus([FromRoute] int id, [FromBody] UpdateListingStatusRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var ok = await _service.UpdateStatusAsync(id, req.Status);
        if (!ok) return NotFound(new { message = $"Listing {id} not found" });
        // nếu muốn ghi log reason/adminId => chuyển vào Service như đã note trong phần Service trước
        return NoContent();
    }

    // ========================== 3) POST BATTERY RIÊNG =====================================
    // POST: api/listings/battery
    [HttpPost("battery")]
    [Authorize]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateBattery([FromBody] CreateBatteryListingRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var memberId = GetMemberIdFromClaims();
        var newId = await _service.CreateBatteryAsync(memberId, req);
        return CreatedAtAction(nameof(GetById), new { id = newId }, new { listingId = newId });
    }

    //=================== 4) POST E-BIKE RIÊNG ====================

    // POST: api/listings/ebike
    [HttpPost("ebike")]
    [Authorize]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateEbike([FromBody] CreateEbikeListingRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var memberId = GetMemberIdFromClaims();
        var newId = await _service.CreateEbikeAsync(memberId, req);
        return CreatedAtAction(nameof(GetById), new { id = newId }, new { listingId = newId });
    }

    // ================= Helpers ==============

    private int GetMemberIdFromClaims()
    {
        // JwtService.GenerateToken đã nhúng memberId (thường ClaimTypes.NameIdentifier hoặc "memberId")
        var id = User.FindFirst("memberId")?.Value
                 ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                 ?? throw new InvalidOperationException("Missing member id claim");
        return int.Parse(id);
    }

    private ActionResult ForbidOrNotFound(int id)
    {
        // Không lộ thông tin tài nguyên có tồn tại hay không -> trả 404 để an toàn
        return NotFound(new { message = $"Listing {id} not found or not accessible" });
    }
}
