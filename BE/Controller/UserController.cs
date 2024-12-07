using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.ComponentModel;
using BE.Services;
using BE.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

[Route("api/User")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly JwtService _jwtService;
    public UserController(UserService userService, JwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }
    [HttpGet("GetUsers")]
    //[Authorize(Roles = "Admin")]
    public async Task<IActionResult> getAllUser()
    {
        var data = await _userService.GetAllUserAsync();
        return Ok(data);
    }
    [HttpGet("GetUserByPhone/{phone}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUserByUsername(string username)
    {
        var data = await _userService.GetUserByUsernameAsync(username);
        return Ok(data);
    }
    [HttpGet("{userid}")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> GetUserById(string userid)
    {
        Console.WriteLine(ClaimTypes.NameIdentifier);

        // Get the current user's ID from their token
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Check if user is trying to access their own data
        if (currentUserId != userid)
        {
            return NotFound("No resource found");
        }

        var data = await _userService.GetUserByIdAsync(userid);
        return Ok(data);
    }
    [HttpPost("AddUser")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddUser([FromBody] UserModel user)
    {
        await _userService.AddUserAsync(user);
        return Ok("User added");
    }
    [HttpDelete("DeleteUser/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        await _userService.DeleteUserAsync(id);
        return Ok("User deleted successfully.");
    }
    [HttpPut("UpdateUser")]
    [Authorize(Roles = "Admin,Customer")]
    public async Task<IActionResult> UpdateUser([FromBody] UserModel user)
    {
        // FE must send all the fields of the user object
        await _userService.UpdateUserAsync(user.PhoneNumber, user.userName, user.Email);
        return Ok("User updated");
    }
    // create register, login, logout
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] UserModel user)
    {
        var data = new UserModel
        {
            password = HashPassword(user.password),
            userName = user.userName,
            LastName = user.LastName,
            FirstName = user.FirstName,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            language = "vi",
            currency = "vnd",
            avatarUrl = "https://i.imghippo.com/files/AMJ4821UR.jpg",
            CreatedAt = DateTime.Now,
        };
        await _userService.AddUserAsync(data);
        return Ok("User registered successfully.");
    }
    [HttpPost("Login")]
    // i want
    public async Task<IActionResult> Login([FromBody] LoginModel login)
    {
        if (login.username == null || login.password == null)
        {
            throw new Exception("Empty user data");
        }
        var user = await _userService.GetUserByUsernameAsync(login.username);
        if (user == null)
        {
            throw new Exception("User not exist");
        }
        var passwordcheck = new PasswordHasher<string>().VerifyHashedPassword(login.username, user.password, login.password);
        if (passwordcheck == PasswordVerificationResult.Failed)
        {
            throw new Exception("Incorrect password");
        }
        if (passwordcheck == PasswordVerificationResult.Success)
        {
            Console.WriteLine("Password is correct");
        }
        // Check if user already has an active refresh token
        var existingToken = await _jwtService.GetCheckRefreshTokenAsync(user.Id);

        var accessToken = _jwtService.GenerateAccessToken(user.Id, user.Email, UserRole.Customer);
        var refreshToken = existingToken?.Token ?? await _jwtService.GenerateRefreshToken(user.Id);
        Console.WriteLine($"Login successful for user: {login.username} with access token: {accessToken} and refresh token: {refreshToken}");
        // log the login role
        Console.WriteLine($"Login role: {UserRole.Customer}");
        return Ok(new
        {
            accessToken,
            refreshToken,
            tokenType = "Bearer"
        });
    }
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(string refreshToken)
    {
        Console.WriteLine($"Token refresh attempt with token: {refreshToken?.Substring(0, 10)}...");
        var tokens = await _jwtService.RefreshTokens(refreshToken);

        if (tokens == null)
        {
            return Unauthorized(new { message = "Invalid refresh token" });
        }
        Console.WriteLine($"Token refresh successful with new access token: {tokens.Value.AccessToken?.Substring(0, 10)}...");
        Console.WriteLine($"access token: {tokens.Value.AccessToken}, refresh token: {tokens.Value.RefreshToken}");
        return Ok(new
        {
            accessToken = tokens.Value.AccessToken,
            refreshToken = tokens.Value.RefreshToken,
            tokenType = "Bearer"
        });
    }
    [HttpPost("logout")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Logout(string refreshToken)
    {
        // Revoke the refresh token
        await _jwtService.RevokeRefreshToken(refreshToken);
        return Ok(new { message = "Successfully logged out" });
    }
    private string HashPassword(string password)
    {
        return new PasswordHasher<string>().HashPassword("hehe", password);
    }
    // to do list: replace method use refreshtoken with userid and use jwtservice.findrefreshtoken 
}