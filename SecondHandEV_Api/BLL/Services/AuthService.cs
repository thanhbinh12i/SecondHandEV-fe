using BLL.DTO;
using BLL.Interfaces;
using DAL.Interfaces;
using DAL.Models;
using DAL.Repositories;

namespace BLL.Services;

public class AuthService : IAuthService
{
    private readonly IMemberRepository _memberRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public AuthService(
        IMemberRepository memberRepository,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _memberRepository = memberRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        try
        {
            // Kiểm tra email đã tồn tại (sử dụng method từ MemberRepository)
            if (await _memberRepository.EmailExistsAsync(request.Email))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Email đã được sử dụng"
                };
            }

            // Kiểm tra số điện thoại đã tồn tại (sử dụng method từ MemberRepository)
            if (!string.IsNullOrWhiteSpace(request.Phone) &&
                await _memberRepository.PhoneExistsAsync(request.Phone))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Số điện thoại đã được sử dụng"
                };
            }

            // Validate role
            if (request.Role != "User" && request.Role != "Admin")
            {
                request.Role = "User"; // Default to User if invalid
            }

            // Tạo Member
            var member = new Member
            {
                Email = request.Email.ToLower().Trim(),
                DisplayName = request.DisplayName.Trim(),
                Phone = request.Phone?.Trim(),
                Role = request.Role, // ← Lưu role từ request
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            // ✅ Sử dụng AddAsync từ GenericRepository
            await _memberRepository.AddAsync(member);
            await _memberRepository.SaveChangesAsync(); // Save để có MemberId

            // Tạo MemberAuth với password hash
            var memberAuth = new MemberAuth
            {
                MemberId = member.MemberId, // Đã có sau khi SaveChanges
                AuthType = "local",
                PasswordHash = _passwordHasher.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            // ✅ Sử dụng CreateAuthAsync từ MemberRepository
            await _memberRepository.CreateAuthAsync(memberAuth);

            // Tạo MemberProfile
            var memberProfile = new MemberProfile
            {
                MemberId = member.MemberId,
                FullName = request.FullName,
                Address = request.Address,
                DateOfBirth = request.DateOfBirth,
                CreatedAt = DateTime.UtcNow
            };

            // ✅ Sử dụng CreateProfileAsync từ MemberRepository
            await _memberRepository.CreateProfileAsync(memberProfile);

            // Generate JWT token
            var token = _jwtService.GenerateToken(
                member.MemberId,
                member.Email!,
                member.DisplayName!,
                member.Role // ← Pass role to JWT
            );

            return new AuthResponse
            {
                Success = true,
                Message = "Đăng ký thành công",
                Token = token,
                Member = new MemberDto
                {
                    MemberId = member.MemberId,
                    DisplayName = member.DisplayName,
                    Email = member.Email,
                    Phone = member.Phone,
                    IsActive = member.IsActive,
                    CreatedAt = member.CreatedAt,
                    FullName = memberProfile.FullName,
                    Address = memberProfile.Address,
                    DateOfBirth = memberProfile.DateOfBirth
                }
            };
        }
        catch (Exception ex)
        {
            return new AuthResponse
            {
                Success = false,
                Message = $"Lỗi khi đăng ký: {ex.Message}"
            };
        }
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        try
        {
            // ✅ Sử dụng GetByEmailAsync từ MemberRepository (có Include Auth & Profile)
            var member = await _memberRepository.GetByEmailAsync(request.Email.ToLower().Trim());

            if (member == null)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Email hoặc mật khẩu không đúng"
                };
            }

            // Kiểm tra tài khoản có active không
            if (member.IsActive == false)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Tài khoản đã bị khóa"
                };
            }

            // Kiểm tra auth type
            if (member.MemberAuth == null || member.MemberAuth.AuthType != "local")
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Tài khoản này không hỗ trợ đăng nhập bằng mật khẩu"
                };
            }

            // Verify password
            if (!_passwordHasher.VerifyPassword(request.Password, member.MemberAuth.PasswordHash!))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Email hoặc mật khẩu không đúng"
                };
            }

            // Generate JWT token
            var token = _jwtService.GenerateToken(
                member.MemberId,
                member.Email!,
                member.DisplayName!,
                member.Role
            );

            return new AuthResponse
            {
                Success = true,
                Message = "Đăng nhập thành công",
                Token = token,
                Member = new MemberDto
                {
                    MemberId = member.MemberId,
                    DisplayName = member.DisplayName,
                    Email = member.Email,
                    Phone = member.Phone,
                    Role = member.Role, // ← NEW: Include Role
                    IsActive = member.IsActive,
                    CreatedAt = member.CreatedAt,
                    FullName = member.MemberProfile?.FullName,
                    Address = member.MemberProfile?.Address,
                    DateOfBirth = member.MemberProfile?.DateOfBirth,
                    Bio = member.MemberProfile?.Bio
                }
            };
        }
        catch (Exception ex)
        {
            return new AuthResponse
            {
                Success = false,
                Message = $"Lỗi khi đăng nhập: {ex.Message}"
            };
        }
    }

    public async Task<MemberDto?> GetProfileAsync(int memberId)
    {
        try
        {
            var member = await _memberRepository.GetByIdAsync(memberId);

            if (member == null)
                return null;

            return new MemberDto
            {
                MemberId = member.MemberId,
                DisplayName = member.DisplayName,
                Email = member.Email,
                Phone = member.Phone,
                Role = member.Role,
                IsActive = member.IsActive,
                CreatedAt = member.CreatedAt,
                FullName = member.MemberProfile?.FullName,
                Address = member.MemberProfile?.Address,
                DateOfBirth = member.MemberProfile?.DateOfBirth,
                Bio = member.MemberProfile?.Bio
            };
        }
        catch
        {
            return null;
        }
    }
}