using DAL.Interfaces;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class PayOSPaymentRepository : IPayOSPaymentRepository
    {
        private readonly VehicleBatteryMarketDbContext _context;
        private readonly IGenericRepository<PayOSPayment> _payosRepository;
        public PayOSPaymentRepository(VehicleBatteryMarketDbContext context, IGenericRepository<PayOSPayment> payosRepository)
        {
            _context = context;
            _payosRepository = payosRepository;
        }

        public async Task<PayOSPayment> CreatePayOSPayment(PayOSPayment payosPayment)
        {
            await _payosRepository.AddAsync(payosPayment);
            await _context.SaveChangesAsync();
            return payosPayment;
        }

        public async Task<PayOSPayment?> GetPayOSPaymentById(int payosPaymentId)
        {
            return await _context.PayOSPayments
                .Include(p => p.Payment)
                .FirstOrDefaultAsync(x => x.PayOspaymentId == payosPaymentId);
        }

        public async Task<PayOSPayment?> GetPayOSPaymentByOrderCode(string orderCode)
        {
            return await _context.PayOSPayments
                .Include(p => p.Payment)
                .FirstOrDefaultAsync(x => x.OrderCode == orderCode);
        }

        public async Task<PayOSPayment?> GetPayOSPaymentByPaymentId(int paymentId)
        {
            return await _context.PayOSPayments
                .Include(p => p.Payment)
                .FirstOrDefaultAsync(x => x.PaymentId == paymentId);
        }

        public async Task<List<PayOSPayment>?> GetPayOSPaymentsByOrderId(int orderId)
        {
            return await _context.PayOSPayments
                .Include(p => p.Payment)
                .Where(x => x.Payment.OrderId == orderId)
                .ToListAsync();
        }

        public async Task<PayOSPayment> UpdatePayOSPayment(PayOSPayment payosPayment)
        {
            _payosRepository.Update(payosPayment);
            await _context.SaveChangesAsync();
            return payosPayment;
        }

        public async Task DeletePayOSPayment(int payosPaymentId)
        {
            var payosPayment = await GetPayOSPaymentById(payosPaymentId);
            if (payosPayment != null)
            {
                _payosRepository.Remove(payosPayment);
                await _context.SaveChangesAsync();
            }
        }
    }
}
