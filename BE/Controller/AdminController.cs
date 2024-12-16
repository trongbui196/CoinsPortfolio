using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BE.Services;
using Microsoft.AspNetCore.Identity;
using StackExchange.Redis;
using System.Security.Claims;

[ApiController]
[Route("api/Admin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;
    private readonly JwtService _jwtService;

    public AdminController(AdminService adminService, JwtService jwtService)
    {
        _adminService = adminService;
        _jwtService = jwtService;
    }

    [HttpPost("AdminLogin")]
    public async Task<IActionResult> AdminLogin(string username, string password)
    {
        if (username == null || password == null)
        {
            throw new Exception("Empty user data");
        }
        var admin = await _adminService.FindAdmin(username);
        if (admin == null)
        {
            throw new Exception("admin not exist");
        }
        Console.WriteLine($"{username}, {admin.Password},{password}");

        var passwordcheck = new PasswordHasher<string>().VerifyHashedPassword(username, admin.Password, password);
        if (passwordcheck == PasswordVerificationResult.Failed)
        {
            throw new Exception("Incorrect password");
        }
        if (passwordcheck == PasswordVerificationResult.Success)
        {
            Console.WriteLine("Password is correct");
        }
        var accessToken = _jwtService.GenerateAccessToken(admin.Id, admin.Email, UserRole.Admin);
        var refreshToken = await _jwtService.GenerateRefreshToken(admin.Id);
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine($"Login successful for admin: {username} with access token: {accessToken} and refresh token: {refreshToken}");
        Console.WriteLine($"Login role: {UserRole.Admin}");

        return Ok(new
        {
            accessToken,
            refreshToken,
            tokenType = "Bearer",
            admin.Id
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(string adminid)
    {
        var token = await _jwtService.GetRefreshTokenByUserIdAsync(adminid);
        await _jwtService.RevokeRefreshToken(token.Token);
        return Ok(new { message = "Successfully logged out" });
    }
    //[Authorize(Roles = "Admin")]
    [HttpPost("addAdmin")]
    public async Task<IActionResult> CreateAdmin([FromBody] AdminModel admin)
    {
        var data = new AdminModel
        {
            Username = admin.Username,
            Email = admin.Email,
            Password = HashPassword(admin.Password)
        };
        await _adminService.AddAdminrAsync(data);
        return Ok("admin added");
    }
    private string HashPassword(string password)
    {
        return new PasswordHasher<string>().HashPassword("hehe", password);
    }

}

