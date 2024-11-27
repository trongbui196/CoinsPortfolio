public class ChartDataModel
{
    public List<List<double>> Prices { get; set; } = new();
    public List<List<double>> MarketCaps { get; set; } = new();
    public List<List<double>> TotalVolumes { get; set; } = new();
}
