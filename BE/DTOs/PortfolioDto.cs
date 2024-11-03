public class PortfolioDto
{
    public string UserId { get; set; }
    public int NumberofTokenHold { get; set; }
    public List<portfolioCoinDto>? Assets { get; set; }
    public decimal AssetMoney { get; set; } // in usd
    public decimal? changeTotal { get; set; }
}
public class portfolioCoinDto
{
    public string CoinName { get; set; }
    public decimal TotalQuantity { get; set; }
    public decimal AveragePrice { get; set; }
    public decimal CurrentValue { get; set; }
    public decimal Change { get; set; } = 0; //profit or loss in % 

}