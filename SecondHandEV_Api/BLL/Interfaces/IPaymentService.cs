using BLL.Services;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Net.payOS.Types;
using BLL.DTO;

namespace BLL.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponse> CreatePayment(int orderId);
        Task<PaymentResponse?> GetPaymentById(int paymentId);
        Task<List<PaymentResponse>> GetPaymentsByOrderId(int orderId);
        Task<PaymentResponse> UpdatePayment(int paymentId, PaymentUpdateRequest payment);
        Task DeletePayment(int paymentId);
    }
}
