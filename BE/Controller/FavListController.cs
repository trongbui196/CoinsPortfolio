using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;

[Route("api/FavList")]
[ApiController]
public class FavListController : ControllerBase
{
    private readonly FavListService _favListService;
    private readonly CoinServices _coinService;
    public FavListController(FavListService favListService, CoinServices coinService)
    {
        _favListService = favListService;
        _coinService = coinService;
    }
    [HttpGet("AllLists")]
    public async Task<IActionResult> GetAllFavlists()
    {
        var data = await _favListService.GetAllFavList();
        return Ok(data);
    }
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetFavolist([DefaultValue("6742b8321475d1cb45a231ec")] string userId)
    {
        var data = await _favListService.GetFavoriteListbyIdAsync(userId);
        return Ok(data);
    }
    [HttpPost("{userid}/Add/{coinId}")]
    public async Task<IActionResult> AddtoFavolist([DefaultValue("67262daa9a76635de4a8716e")] string userid, [DefaultValue("6726004cd800267247bb5dbe")] string coinId)
    {
        var coinList = await _favListService.GetFavoriteListbyIdAsync(userid);
        var acoinid = await _coinService.GetCoinbyNameAsync(coinId);
        foreach (var coin in coinList)
        {
            if (coin.Id == acoinid.Id)
            {
                return BadRequest(new { message = $"{coinId} already in {userid} list", isInList = true });
            }
        }

        await _favListService.AddCointoFavListAsync(userid, acoinid.Id.ToString());
        return Ok(new { message = $"{coinId} added to {userid} list", isInList = true });
    }
    [HttpPatch("{listId}/Remove/{coinId}")]
    public async Task<IActionResult> RemovefromFavList([DefaultValue("67262daa9a76635de4a8716e")] string listId, [DefaultValue("6726004cd800267247bb5dbe")] string coinId)
    {
        await _favListService.RemoveCoinfromFavListAsync(listId, coinId);
        return Ok($"{coinId} removed to {listId}");
    }
}