using DAL.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTO
{
    public class OrderCreateRequest
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "ListingId must be a positive integer.")]
        public int ListingId { get; set; }
    }

    public class OrderUpdateRequest
    {
        [StringLength(50, ErrorMessage = "OrderStatus cannot exceed 50 characters.")]
        public string? OrderStatus { get; set; }
    }
    public class OrderResponse
    {
        public int OrderId { get; set; }
        public required ListingInfoDto Listing { get; set; }
        public required MemberInfoDto Buyer { get; set; }
        public required MemberInfoDto Seller { get; set; } 
        public decimal OrderAmount { get; set; }
        public string? OrderStatus { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
    public class MemberInfoDto
    {
        public int MemberId { get; set; }
        public string? DisplayName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
    public class ListingInfoDto
    {
        public int ListingId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string PrimaryImageURL { get; set; } = null!;
        public decimal Price { get; set; }
        public decimal? CommissionPrice { get; set; }
        public string? ListingType { get; set; }
    }
}
