using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BE.Services;
using Microsoft.AspNetCore.Identity;
using StackExchange.Redis;

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
        var passwordHash = new PasswordHasher<string>().HashPassword("hehe", password);
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
        Console.WriteLine($"Login successful for admin: {username} with access token: {accessToken} and refresh token: {refreshToken}");
        return Ok(new
        {
            accessToken,
            refreshToken,
            tokenType = "Bearer"
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
    [Authorize(Roles = "Admin")]
    [HttpPost("addAdmin")]
    public async Task<IActionResult> CreateAdmin(AdminModel admin)
    {
        await _adminService.AddAdminrAsync(admin);
        return Ok("admin added");
    }

}

