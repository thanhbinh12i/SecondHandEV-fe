using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTO
{
    /// <summary>
    /// DTO chứa thông tin member để trả về client
    /// </summary>
    public class MemberDto
    {
        public int MemberId { get; set; }
        public string? DisplayName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Role { get; set; } = "User"; // ← NEW: Role
        public bool? IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }

        // Profile information
        public string? FullName { get; set; }
        public string? Address { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Bio { get; set; }
    }
}
