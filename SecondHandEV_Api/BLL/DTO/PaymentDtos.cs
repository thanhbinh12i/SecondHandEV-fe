using System;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTO
{
    public class PaymentCreateRequest
    {
        public int ListingId { get; set; }
    }

    public class PaymentUpdateRequest
    {
        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
        public string? Status { get; set; }

        [StringLength(100, ErrorMessage = "ProviderRef cannot exceed 100 characters.")]
        public string? ProviderRef { get; set; }
    }
    public class PaymentResponse
    {
        public int PaymentId { get; set; }

        public int OrderId { get; set; }

        public decimal Amount { get; set; }

        public string Provider { get; set; } = null!;

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
