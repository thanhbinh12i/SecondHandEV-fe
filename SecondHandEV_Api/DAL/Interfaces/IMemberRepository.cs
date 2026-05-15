using DAL.Models;

namespace DAL.Interfaces;


public interface IMemberRepository : IGenericRepository<Member>
{
    // Các method đặc thù cho Member (không có trong Generic)
    Task<Member?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> PhoneExistsAsync(string phone);

    // Method xử lý Auth và Profile
    Task<MemberAuth> CreateAuthAsync(MemberAuth memberAuth);
    Task<MemberProfile> CreateProfileAsync(MemberProfile memberProfile);

}