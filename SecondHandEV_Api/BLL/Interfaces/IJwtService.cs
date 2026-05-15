using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(int memberId, string email, string displayName, string role = "User");
        ClaimsPrincipal? ValidateToken(string token);
    }
}
