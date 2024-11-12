public class PortfolioDto
{
    public string? UserId { get; set; }
    public int? NumberofTokenHold { get; set; }
    public List<portfolioCoinDto>? Assets { get; set; }
    public double? AssetMoney { get; set; } // in usd
    public double? changeTotal { get; set; } // profit or loss
    public string? Msg { get; set; }
}
public class portfolioCoinDto
{
    public string? CoinName { get; set; }
    public double? TotalQuantity { get; set; }
    public double? AveragePrice { get; set; }
    public double? CurrentValue { get; set; }
    public double? Change { get; set; } = 0; //profit or loss in % 


}