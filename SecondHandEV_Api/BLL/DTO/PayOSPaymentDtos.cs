using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTO
{
/*    public class CreatePayOSPaymentRequest
    {
        *//*        public int OrderId { get; set; }
                public long TotalAmount { get; set; }
                public string? Description { get; set; }
                public string? BuyerName { get; set; }
                public string? BuyerEmail { get; set; }
                public string? BuyerPhone { get; set; }
                public List<PaymentItem>? Items { get; set; } = new();*//*
        public int ListingId { get; set; }
    }*/

    public class PaymentItem
    {
        public string Name { get; set; }
        public int Price { get; set; }
    }

    public class CancelPaymentRequest
    {
        public string CancellationReason { get; set; } = "Customer requested cancellation";
    }

    public class ConfirmWebhookRequest
    {
        public string WebhookUrl { get; set; }
    }
}
