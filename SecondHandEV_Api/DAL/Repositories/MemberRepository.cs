using DAL.Interfaces;
using DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class MemberRepository : GenericRepository<Member>, IMemberRepository
{
    public MemberRepository(VehicleBatteryMarketDbContext context) : base(context)
    {
    }


    public async Task<Member?> GetByEmailAsync(string email)
    {
        return await _context.Members
            .Include(m => m.MemberAuth)
            .Include(m => m.MemberProfile)
            .FirstOrDefaultAsync(m => m.Email == email);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await ExistsAsync(m => m.Email == email);
    }

    public async Task<bool> PhoneExistsAsync(string phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            return false;

        return await ExistsAsync(m => m.Phone == phone);
    }


    public async Task<MemberAuth> CreateAuthAsync(MemberAuth memberAuth)
    {
        await _context.MemberAuths.AddAsync(memberAuth);
        await _context.SaveChangesAsync();
        return memberAuth;
    }

    public async Task<MemberProfile> CreateProfileAsync(MemberProfile memberProfile)
    {
        await _context.MemberProfiles.AddAsync(memberProfile);
        await _context.SaveChangesAsync();
        return memberProfile;
    }

}