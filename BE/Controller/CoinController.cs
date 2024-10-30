using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[Route("api/CoinsData")]
[ApiController]
public class CoinController : ControllerBase
{
    private readonly MongoDBService _mongoservice;
    public CoinController(MongoDBService mongoDBService)
    {
        _mongoservice = mongoDBService;
    }
    //get call coin from api method
    //get allcoin call above method and then call from database

    [HttpPost("Add1Coins")]
    public async Task<IActionResult> AddCoins([FromBody] CoinModel coin)
    {
        await _mongoservice.AddCoins(coin);
        return CreatedAtAction(nameof(AddCoins), new { id = coin.Id }, coin);

    }

    [HttpGet("getCoins")]
    public async Task<IActionResult> GetCoins()
    {
        var data = await _mongoservice.GetAllCoinAsync();
        return Ok(data);
        /*
        [HttpGet("getCoins")]
public async Task<IActionResult> GetCoins()
{
   try
   {
       var coins = await _mongoService.GetAllCoinsAsync();
       if (coins == null || coins.Count == 0)
       {
           return NotFound("No coins found."); // Return 404 if no coins are found
       }

       return Ok(coins); // Return 200 OK with the list of coins
   }
   catch (Exception ex)
   {
       return StatusCode(500, $"Internal server error: {ex.Message}"); // Handle unexpected errors
   }
}

        */
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