using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IPayOSPaymentRepository
    {
        Task<PayOSPayment> CreatePayOSPayment(PayOSPayment payosPayment);
        Task<PayOSPayment?> GetPayOSPaymentById(int payosPaymentId);
        Task<PayOSPayment?> GetPayOSPaymentByOrderCode(string orderCode);
        Task<PayOSPayment?> GetPayOSPaymentByPaymentId(int paymentId);
        Task<List<PayOSPayment>?> GetPayOSPaymentsByOrderId(int orderId);
        Task<PayOSPayment> UpdatePayOSPayment(PayOSPayment payosPayment);
        Task DeletePayOSPayment(int payosPaymentId);
    }
}
