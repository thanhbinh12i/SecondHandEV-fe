using DAL.Models;
using Net.payOS.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IPayOSPaymentService
    {
        Task<(bool Success, PayOSPayment? PayOSPayment, CreatePaymentResult? PaymentResult, string? Error)>
            CreatePaymentLinkAsync(int orderId, decimal amount, string description, List<ItemData> items, string cancelUrl, string returnUrl);

        Task<PaymentLinkInformation?> GetPaymentInfoAsync(string orderCode);

        Task<(bool Success, string? Error)> CancelPaymentAsync(string orderCode, string cancellationReason);

        Task<(bool Success, string? Error)> HandlePaymentWebhookAsync(WebhookData verifiedData);

        Task<PayOSPayment?> GetPayOSPaymentByOrderCodeAsync(string orderCode);

        Task<PayOSPayment?> GetPayOSPaymentByPaymentIdAsync(int paymentId);

        Task<List<PayOSPayment>?> GetPayOSPaymentsByOrderIdAsync(int orderId);

        Task<bool> UpdatePaymentStatusAsync(string orderCode, string status, DateTime? paidAt = null);

        Task<bool> DeletePayOSPaymentAsync(int payosPaymentId);
    }
}
