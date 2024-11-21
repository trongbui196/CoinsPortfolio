using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.ComponentModel;
using System.Linq;

[Route("api/User")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    public UserController(UserService userService)
    {
        _userService = userService;
    }
    [HttpGet("GetUsers")]
    public async Task<IActionResult> getAllUser()
    {
        var data = await _userService.GetAllUserAsync();
        return Ok(data);
    }
    [HttpGet("GetUserByPhone/{phone}")]
    public async Task<IActionResult> GetUserByPhone([DefaultValue("132131231")] string phone)
    {
        var data = await _userService.GetUserByPhoneAsync(phone);
        return Ok(data);
    }
    [HttpPost("AddUser")]
    public async Task<IActionResult> AddUser([FromBody] UserModel user)
    {
        await _userService.AddUserAsync(user);
        return CreatedAtAction(nameof(GetUserByPhone), new { phone = user.PhoneNumber }, user);
    }
    [HttpDelete("DeleteUser/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        await _userService.DeleteUserAsync(id);
        return Ok("User deleted successfully.");
    }
    [HttpPut("UpdateUser")]
    public async Task<IActionResult> UpdateUser([FromBody] UserModel user)
    {
        // FE must send all the fields of the user object
        await _userService.UpdateUserAsync(user.PhoneNumber, user.userName, user.Email);
        return CreatedAtAction(nameof(GetUserByPhone), new { phone = user.PhoneNumber }, user);
    }

}