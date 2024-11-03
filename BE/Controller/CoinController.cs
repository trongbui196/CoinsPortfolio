using System.ComponentModel;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[Route("api/Coins")]
[ApiController]
public class CoinController : ControllerBase
{
    private readonly MongoDBService _mongoservice;
    public CoinController(MongoDBService mongoDBService)
    {
        _mongoservice = mongoDBService;
    }

    [HttpDelete("delAllCoins")]
    public async Task<IActionResult> DelAllCoins()
    {
        await _mongoservice.DeleteCoinsAsync();
        return Ok("Delete all succesfully");
    }

    [HttpGet("getCoins")]
    public async Task<IActionResult> GetCoins()
    {
        var data = await _mongoservice.GetAllCoinAsync();
        return Ok(data);

    }
    [HttpGet("GetCoinByName/{name}")]
    public async Task<IActionResult> GetCoinByName([DefaultValue("btc")] string name)
    {
        var data = await _mongoservice.GetCoinByNameAsync(name);
        return Ok(data);
    }

    [HttpPost("Add1Coins")]
    public async Task<IActionResult> AddCoins(CoinModel coin)
    {
        await _mongoservice.AddCoins(coin);
        return CreatedAtAction(nameof(AddCoins), new { id = coin.Id }, coin);

    }
    [HttpPost("addCoins")]
    public async Task<IActionResult> AddCoins()
    {
        try
        {
            await _mongoservice.AddCoinsAsync();
            return Ok("Coins added successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    [HttpPut("updateCoins")]
    public async Task<IActionResult> UpdateCoins()
    {
        try
        {
            await _mongoservice.UpdateCoinsAsync();
            return Ok("Coins updated successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }



}