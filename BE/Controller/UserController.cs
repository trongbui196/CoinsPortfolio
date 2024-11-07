using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.ComponentModel;
using System.Linq;

[Route("api/User")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly MongoDBService _mongoservice;
    public UserController(MongoDBService mongoDBService)
    {
        _mongoservice = mongoDBService;
    }
    [HttpGet("GetUsers")]
    public async Task<IActionResult> getAllUser()
    {
        var data = await _mongoservice.GetAllUserAsync();
        return Ok(data);
    }
    [HttpGet("GetUserByPhone/{phone}")]
    public async Task<IActionResult> GetUserByPhone([DefaultValue("132131231")] string phone)
    {
        var data = await _mongoservice.GetUserByPhoneAsync(phone);
        return Ok(data);
    }
    [HttpPost("AddUser")]
    public async Task<IActionResult> AddUser([FromBody] UserModel user)
    {
        await _mongoservice.AddUserAsync(user);
        return CreatedAtAction(nameof(AddUser), new { id = user.Id }, user);
    }

    [HttpGet("Favlists")]
    public async Task<IActionResult> GetAllFavlists()
    {
        var data = await _mongoservice.GetAllFavList();
        return Ok(data);
    }
    [HttpGet("{userId}/Favlist")]
    public async Task<IActionResult> GetFavolist([DefaultValue("67262daa9a76635de4a8716d")] string userId)
    {
        var data = await _mongoservice.GetFavoriteListAsync(userId);
        return Ok(data);
    }
    [HttpPost("Favlist/{listId}/Add/{coinId}")]
    public async Task<IActionResult> AddtoFavolist([DefaultValue("67262daa9a76635de4a8716e")] string listId, [DefaultValue("6726004cd800267247bb5dbe")] string coinId)
    {
        await _mongoservice.AddCointoFavListAsync(listId, coinId);
        return Ok($"{coinId} added to {listId}");
    }
    [HttpPatch("Favlist/{listId}/Remove/{coinId}")]
    public async Task<IActionResult> RemovefromFavList([DefaultValue("67262daa9a76635de4a8716e")] string listId, [DefaultValue("6726004cd800267247bb5dbe")] string coinId)
    {
        await _mongoservice.RemoveCoinfromFavListAsync(listId, coinId);
        return Ok($"{coinId} removed to {listId}");
    }

    // TRX
    [HttpGet("getalltrxforadmin")]
    public async Task<IActionResult> AdminGetAllTrx()
    {
        var data = await _mongoservice.GetAllTrxAsync();
        return Ok(data);
    }

    [HttpGet("/{userid}/Trxs")]
    public async Task<IActionResult> GetTrxsbyUser([DefaultValue("67260d795577ce6acec7b318")] string userid)
    {
        var data = await _mongoservice.GetTrxsByUserAsync(userid);
        return Ok(data);
    }
    [HttpGet("/{userid}/Trx/{trxid}")]
    public async Task<IActionResult> TrxDetail([DefaultValue("67262daa9a76635de4a8716d")] string userid, string trxid)
    {
        var data = await _mongoservice.GetTrxDetailAsync(userid, trxid);
        return Ok(data);
    }
    [HttpPost("/addTrx")]
    public async Task<IActionResult> NewTrx([FromBody] TransactionModel trx)
    {
        await _mongoservice.addTrxAsync(trx);
        return Ok("trx added success");
    }
    [HttpPost("/addTrxManual")]
    public async Task<IActionResult> NewTrxManual([FromBody] TransactionModel trx)
    {
        await _mongoservice.addTrxManuallyAsync(trx);
        return Ok("trx added manually success");
    }
    [HttpDelete("/{userid}/Trx/{trxid}")]
    public async Task<IActionResult> DelTrx(string trxid)
    {
        await _mongoservice.DeleteTrxAsync(trxid);
        return Ok("del success");
    }
    [HttpGet("getPortfolio")]
    public async Task<IActionResult> getuserPortfolio(string userid)
    {
        var data = await _mongoservice.GetPortfolioAsync(userid);
        return Ok(data);
    }
    [HttpPost("CreatePort")]
    public async Task<IActionResult> CreatePort(string userid)
    {
        await _mongoservice.InitPort(userid);
        return Ok($"Port created for {userid}");
    }

}