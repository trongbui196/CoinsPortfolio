using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Security.Cryptography;
using BE.Models;

namespace BE.Services
{
    public class JwtService : MongoDBService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config) : base(config)
        {
            _config = config;
        }

        public string GenerateAccessToken(string userId, string email, UserRole role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role.ToString())
            };

            var audience = role.ToString() == "Admin"
                ? "http://localhost:3001"    // Admin UI
                : "http://localhost:3000";   // Customer UI

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> GenerateRefreshToken(string userId)
        {
            var refreshToken = new RefreshTokenModel
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                UserId = userId,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };
            var existingToken = await _refreshTokens.Find(x => x.UserId == userId).FirstOrDefaultAsync();
            if (existingToken != null)
            {
                await _refreshTokens.ReplaceOneAsync(x => x.Id == existingToken.Id, refreshToken);
            }
            else
            {
                await _refreshTokens.InsertOneAsync(refreshToken);
            }
            return refreshToken.Token;
        }

        public async Task<(string AccessToken, string RefreshToken)?> RefreshTokens(string userId)
        {
            var storedToken = await _refreshTokens.Find(x => x.UserId == userId && !x.IsRevoked)
                .FirstOrDefaultAsync();

            if (storedToken == null || storedToken.ExpiryDate < DateTime.UtcNow)
            {
                return null;
            }

            var user = await _UserCollection.Find(x => x.Id == storedToken.UserId).FirstOrDefaultAsync();

            // Generate only new access token, keep the same refresh token if it's not close to expiry
            var newAccessToken = GenerateAccessToken(user.Id, user.Email, UserRole.Customer);
            var newRefreshToken = storedToken.Token;
            if (storedToken.ExpiryDate < DateTime.UtcNow.AddDays(1))
            {
                newRefreshToken = await GenerateRefreshToken(user.Id);
                // Revoke old refresh token
                await _refreshTokens.UpdateOneAsync(
                    x => x.Token == storedToken.Token,
                    Builders<RefreshTokenModel>.Update.Set(x => x.IsRevoked, true)
                );
            }

            return (newAccessToken, newRefreshToken);
        }

        public async Task RevokeRefreshToken(string userId)
        {
            await _refreshTokens.UpdateOneAsync(x => x.UserId == userId, Builders<RefreshTokenModel>.Update.Set(x => x.IsRevoked, true));
        }
        public async Task<RefreshTokenModel> GetCheckRefreshTokenAsync(string userId)
        {
            return await _refreshTokens.Find(x => x.UserId == userId && !x.IsRevoked && x.ExpiryDate > DateTime.UtcNow).FirstOrDefaultAsync();
        }
        public async Task<RefreshTokenModel> GetRefreshTokenByUserIdAsync(string userId)
        {
            return await _refreshTokens.Find(x => x.UserId == userId).FirstOrDefaultAsync();
        }
    }
}