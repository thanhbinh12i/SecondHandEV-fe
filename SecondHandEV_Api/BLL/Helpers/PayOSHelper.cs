using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Helpers
{
    public static class PayOSHelper
    {
        public static string GenerateSignature(string amount, string cancelUrl, string description, string orderCode, string returnUrl, string checksumKey)
        {
            // Step 1: Sort and format parameters alphabetically
            string data = $"amount={amount}&cancelUrl={cancelUrl}&description={description}&orderCode={orderCode}&returnUrl={returnUrl}";

            // Step 2: Convert key and message to bytes
            var keyBytes = Encoding.UTF8.GetBytes(checksumKey);
            var dataBytes = Encoding.UTF8.GetBytes(data);

            // Step 3: Compute HMAC-SHA256
            using (var hmac = new HMACSHA256(keyBytes))
            {
                var hashBytes = hmac.ComputeHash(dataBytes);
                // Step 4: Convert to lowercase hex string
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
            }
        }
    }
}
