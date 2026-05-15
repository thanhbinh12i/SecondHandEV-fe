using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IPaymentRepository
    {
        Task<Payment> CreatePayment(Payment payment);
        Task<Payment?> GetPaymentById(int paymentId);
        Task<List<Payment>?> GetPaymentsByOrderId(int orderId);
        Task<Payment> UpdatePayment(Payment payment);
        Task DeletePayment(int paymentId);
        Task<List<Payment>?> GetAllPayments(); 

    }
}
