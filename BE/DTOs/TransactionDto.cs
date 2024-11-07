public class TransactionDto
{
    public string? TransactionId { get; set; }
    public string? userName { get; set; }
    public TransactionModel.TrxType TrxType { get; set; } = 0;
    public string? buySource { get; set; } = "Usd";
    public string? CoinName { get; set; } = "Unnamed Coin";
    public double? coinPrice { get; set; }
    public double? quantity { get; set; } = 0;
    public double? totalAmount { get; set; }
    public string? Notes { get; set; }
    public DateTime TimeExecute { get; set; }

}