public class TransactionDto
{
    public string TransactionId { get; set; }
    public string? userName { get; set; }
    public TransactionModel.TrxType TrxType { get; set; }
    public string buySource { get; set; }
    public string CoinName { get; set; }
    public decimal? current_price { get; set; }
    public decimal quantity { get; set; }
    public decimal? totalAmount { get; set; }
    public DateTime TimeExecute { get; set; }

}