using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Threading.Tasks;
using DAL.Enums;

namespace BLL.DTO
{
    public class AuctionResponse
    {
        public int Id { get; set; }
        public required ListingInfoDto Listing { get; set; }
        public decimal StartingPrice { get; set; }
        public decimal? CurrentPrice { get; set; } 
        public int totalBids { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = null!;
        public required MemberInfoDto Seller { get; set; }
    }
    public class AuctionCreateRequest
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "ListingId must be a positive integer.")]
        public int ListingId { get; set; }

        [Required]
        [Range(typeof(decimal), "0.01", "79228162514264337593543950335", ErrorMessage = "StartingPrice must be greater than 0.")]
        public decimal StartingPrice { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime StartDate { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime EndDate { get; set; }
    }
    public class AuctionUpdateRequest
    {
        [Range(typeof(decimal), "0.01", "79228162514264337593543950335", ErrorMessage = "StartingPrice must be greater than 0.")]
        public decimal? StartingPrice { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? StartDate { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? EndDate { get; set; }
    }
}
