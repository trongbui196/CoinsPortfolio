using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;

[Route("api/Porfolio")]
[ApiController]
public class PorfolioController : ControllerBase
{
    public readonly PortfolioService _portfolioService;
    public PorfolioController(PortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }

    [HttpGet("getPortfolio")]
    public async Task<IActionResult> getuserPortfolio([DefaultValue("67260d795577ce6acec7b318")] string userid)
    {
        var data = await _portfolioService.GetPortfolioAsync(userid);
        return Ok(data);
    }
    [HttpPost("CreatePort")]
    public async Task<IActionResult> CreatePort(string userid)
    {
        await _portfolioService.InitPort(userid);
        return Ok($"Port created for {userid}");
    }
    [HttpPatch("RemoveCoinfromPort")]
    public async Task<IActionResult> RemoveCoinfromPort(string userid, string coinid)
    {
        await _portfolioService.RemoveCoinfromPortAsync(userid, coinid);
        return Ok($"{coinid} removed from {userid}'s port");
    }
    [HttpPost("ConvertInPort")]
    public async Task<IActionResult> ConvertInPort([DefaultValue("67260d795577ce6acec7b318")] string userid, [DefaultValue("6726004cd800267247bb5dac")] string coinA, [DefaultValue("6726004cd800267247bb5dad")] string coinB, [DefaultValue(200)] double coinAquantity)
    {
        await _portfolioService.ConvertInPort(userid, coinA, coinB, coinAquantity);
        return Ok($"{coinA} converted to {coinB} for user {userid}");
    }
}