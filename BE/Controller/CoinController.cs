using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;


[Route("api/Coins")]
[ApiController]
public class CoinController : ControllerBase
{
    private readonly CoinServices _coinServices;
    public CoinController(CoinServices coinServices)
    {
        _coinServices = coinServices;
    }

    [HttpGet("getCoins")]
    public async Task<IActionResult> GetCoins()
    {
        var data = await _coinServices.GetAllCoinAsync();
        return Ok(data);

    }
    [HttpGet("GetCoinByName/{name}")]
    public async Task<IActionResult> GetCoinByName([DefaultValue("btc")] string name)
    {
        var data = await _coinServices.GetCoinbyNameAsync(name);
        return Ok(data);
    }

    [HttpPost("Add1Coins")]
    public async Task<IActionResult> AddCoins(CoinModel coin)
    {
        await _coinServices.AddOneCoin(coin);
        return CreatedAtAction(nameof(GetCoinByName), new { name = coin.Name }, coin);

    }
    [HttpPost("addCoins")]
    public async Task<IActionResult> AddCoins()
    {
        try
        {
            await _coinServices.AddCoinFromGecko();
            return Ok("Coins added successfully");
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
            await _coinServices.UpdateCoinAsync();
            return Ok("Coins updated successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    [HttpDelete("delAllCoins")]
    public async Task<IActionResult> DelAllCoins()
    {
        await _coinServices.DeleteAllCoinAsync();
        return Ok("Delete all coins succesfully");
    }
    [HttpDelete("delCoin/{id}")]
    public async Task<IActionResult> DelCoin(string id)
    {
        await _coinServices.DeleteCoinAsync(id);
        return Ok("Delete coin succesfully");
    }
    [HttpGet("get20Coin")]
    public async Task<IActionResult> Get20Coin()
    {
        var data = await _coinServices.Get20CoinAsync();
        return Ok(data);
    }
    [HttpGet("getTop5Gainers")]
    public async Task<IActionResult> GetTop5Gainers()
    {
        var data = await _coinServices.GetTop5GainersAsync();
        return Ok(data);
    }
}