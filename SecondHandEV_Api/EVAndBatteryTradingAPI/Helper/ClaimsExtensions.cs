using System.Security.Claims;

namespace EVAndBatteryTradingAPI.Helper
{
    public static class ClaimsExtensions
    {
        public static int GetLoggedInMemberId(this ClaimsPrincipal user)
        {
            if (user == null)
                throw new UnauthorizedAccessException("User context is missing.");

            var memberIdClaim = user.FindFirst("MemberId")?.Value
                                ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(memberIdClaim))
                throw new UnauthorizedAccessException("User ID not found in token.");

            return int.Parse(memberIdClaim);
        }
    }
}
