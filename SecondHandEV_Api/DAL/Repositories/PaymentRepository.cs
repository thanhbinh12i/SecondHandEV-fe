using DAL.Interfaces;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
 public PaymentRepository(VehicleBatteryMarketDbContext context) : base(context)
        {
        }

        // Payment methods
        public async Task<Payment> CreatePayment(Payment payment)
        {
            await AddAsync(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task DeletePayment(int paymentId)
        {
            var payment = await GetPaymentById(paymentId);
            if (payment != null)
            {
                Remove(payment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Payment>?> GetAllPayments()
        {
            return await _context.Payments.ToListAsync();
        }

        public async Task<Payment?> GetPaymentById(int paymentId)
        {
            return await _context.Payments.FirstOrDefaultAsync(x => x.PaymentId == paymentId);
        }

        public async Task<List<Payment>?> GetPaymentsByOrderId(int orderId)
        {
            return await _context.Payments.Where(x => x.OrderId == orderId).ToListAsync();
        }

        public async Task<Payment> UpdatePayment(Payment payment)
        {
            Update(payment);
            await _context.SaveChangesAsync();
            return payment;
        }


    }
}