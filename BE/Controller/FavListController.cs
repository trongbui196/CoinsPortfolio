
using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;

[Route("api/FavList")]
[ApiController]
public class FavListController : ControllerBase
{
    private readonly FavListService _favListService;
    public FavListController(FavListService favListService)
    {
        _favListService = favListService;
    }
    [HttpGet("Favlists")]
    public async Task<IActionResult> GetAllFavlists()
    {
        var data = await _favListService.GetAllFavList();
        return Ok(data);
    }
    [HttpGet("{userId}/Favlist")]
    public async Task<IActionResult> GetFavolist([DefaultValue("67262daa9a76635de4a8716d")] string userId)
    {
        var data = await _favListService.GetFavoriteListAsync(userId);
        return Ok(data);
    }
    [HttpPost("Favlist/{listId}/Add/{coinId}")]
    public async Task<IActionResult> AddtoFavolist([DefaultValue("67262daa9a76635de4a8716e")] string listId, [DefaultValue("6726004cd800267247bb5dbe")] string coinId)
    {
        await _favListService.AddCointoFavListAsync(listId, coinId);
        return Ok($"{coinId} added to {listId}");
    }
    [HttpPatch("Favlist/{listId}/Remove/{coinId}")]
    public async Task<IActionResult> RemovefromFavList([DefaultValue("67262daa9a76635de4a8716e")] string listId, [DefaultValue("6726004cd800267247bb5dbe")] string coinId)
    {
        await _favListService.RemoveCoinfromFavListAsync(listId, coinId);
        return Ok($"{coinId} removed to {listId}");
    }
}