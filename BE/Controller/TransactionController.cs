using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;

[Route("api/Transactions")]
[ApiController]
public class TransactionController : ControllerBase
{
    private readonly TransactionService _transactionService;
    public TransactionController(TransactionService transactionService)
    {
        _transactionService = transactionService;
    }
    [HttpGet("getAllTrx4Admin")]
    public async Task<IActionResult> AdminGetAllTrx()
    {
        var data = await _transactionService.GetAllTrxAsync();
        return Ok(data);
    }

    [HttpGet("{userid}/Trxs")]
    public async Task<IActionResult> GetTrxsbyUser([DefaultValue("67260d795577ce6acec7b318")] string userid)
    {
        var data = await _transactionService.GetTrxsByUserAsync(userid);
        return Ok(data);
    }
    [HttpGet("{userid}/Trx/{trxid}")]
    public async Task<IActionResult> TrxDetail([DefaultValue("67262daa9a76635de4a8716d")] string userid, string trxid)
    {
        var data = await _transactionService.GetTrxDetailAsync(userid, trxid);
        return Ok(data);
    }
    [HttpPost("addTrx")]
    public async Task<IActionResult> NewTrx([FromBody] TransactionModel trx)
    {
        await _transactionService.addTrxAsync(trx);
        return Ok("add success");
    }
    [HttpPost("addTrxManual")]
    public async Task<IActionResult> NewTrxManual([FromBody] TransactionModel trx)
    {
        await _transactionService.addTrxManuallyAsync(trx);
        return CreatedAtAction(nameof(TrxDetail), new { userid = trx.UserId, trxid = trx.Id }, trx);
    }
    [HttpDelete("{userid}/Trx/{trxid}")]
    public async Task<IActionResult> DelTrx(string trxid)
    {
        await _transactionService.DeleteTrxAsync(trxid);
        return Ok("del success");
    }
}