using MongoDB.Driver;
using Newtonsoft.Json;

public class CoinServices : MongoDBService
{
    public CoinServices(IConfiguration iconfig) : base(iconfig)
    { }
    public async Task<List<CoinModel>> GetAllCoinAsync()
    {
        return await _CoinCollection.Find(_ => true).ToListAsync();
    }
    public async Task<string> GetNameByIdAsync(string coinId)
    {
        var coin = await _CoinCollection.Find(x => x.CoinId == coinId).FirstOrDefaultAsync();
        return coin.Name;
    }
    public async Task<List<CoinModel>> Get20CoinAsync()
    {
        return await _CoinCollection.Find(_ => true).SortByDescending(x => x.market_cap).Limit(20).ToListAsync();
    }
    public async Task<List<CoinModel>> GetTop5GainersAsync()
    {
        return await _CoinCollection.Find(_ => true).SortByDescending(x => x.price_change_percentage_24h).Limit(5).ToListAsync();
    }
    public async Task<CoinModel> GetCoinbyNameAsync(string coinid)
    {
        var data = await _CoinCollection.Find(x => x.CoinId == coinid).FirstOrDefaultAsync();
        return data;
    }
    public async Task<string> UpdateCoinAsync()
    {
        List<CoinModel> coinlist = await FetchCoinsFromApi();
        var updated = 0;
        foreach (var coin in coinlist)
        {


            var existcoin = await _CoinCollection.Find(x => x.CoinId == coin.Id).FirstOrDefaultAsync();
            if (existcoin != null)
            {
                var oldprice = existcoin.current_price;
                updated++;
                var filter = Builders<CoinModel>.Filter.Eq(x => x.CoinId, coin.Id);


                var update = Builders<CoinModel>.Update

                .Set(c => c.current_price, coin.current_price ?? 0)
                .Set(c => c.market_cap, coin.market_cap ?? 0)
                .Set(c => c.total_volume, coin.total_volume ?? 0)
                .Set(c => c.high_24h, coin.high_24h ?? 0)
                .Set(c => c.low_24h, coin.low_24h ?? 0)
                .Set(c => c.price_change_24h, coin.price_change_24h ?? 0)
                .Set(c => c.price_change_percentage_24h, coin.price_change_percentage_24h ?? 0)
                .Set(c => c.circulating_supply, coin.circulating_supply ?? 0)
                .Set(c => c.total_supply, coin.total_supply ?? 0)
                .Set(c => c.max_supply, coin.max_supply ?? 0)
                .Set(c => c.ath, coin.ath ?? 0)
                .Set(c => c.atl, coin.atl ?? 0)
                .Set(c => c.UpdateAt, DateTime.Now);
                await _CoinCollection.UpdateOneAsync(filter, update);
                //Console.WriteLine($"{coin.Name} updated from {oldprice} to {coin.current_price}");

            }
            else Console.WriteLine($"{coin.Name} not updated");

        }
        return $"updated {updated} coins";
    }
    public async Task DeleteCoinAsync(string id)
    {
        await _CoinCollection.DeleteOneAsync(x => x.Id == id);
    }
    public async Task DeleteAllCoinAsync()
    {
        await _CoinCollection.DeleteManyAsync(_ => true);
    }
    public async Task<List<CoinModel>> FetchCoinsFromApi()
    {
        string url = $"{_baseUrl}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&price_change_percentage=24h?x_cg_demo_api_key={_apiKey}";
        Console.WriteLine(url);
        using var httpClient = new HttpClient();
        var response = await httpClient.GetStringAsync(url);
        var convertedresponse = JsonConvert.DeserializeObject<List<CoinModel>>(response);
        if (convertedresponse == null)
        {
            throw new Exception("no coin fetched from api");
        }
        return convertedresponse;
    }
    public async Task AddOneCoin(CoinModel coin)
    {
        await _CoinCollection!.InsertOneAsync(coin);
    }
    public async Task AddCoinFromGecko()
    {
        List<CoinModel> response = await FetchCoinsFromApi();
        var coinList = new List<CoinModel>();
        foreach (var coin in response)
        {
            var data = new CoinModel
            {
                CoinId = coin.Id,
                Symbol = coin.Symbol,
                Name = coin.Name,
                Image = coin.Image,
                current_price = coin.current_price ?? 0,
                market_cap = coin.market_cap ?? 0,
                total_volume = coin.total_volume ?? 0,
                high_24h = coin.high_24h ?? 0,
                low_24h = coin.low_24h ?? 0,
                price_change_24h = coin.price_change_24h ?? 0,
                price_change_percentage_24h = coin.price_change_percentage_24h ?? 0,
                circulating_supply = coin.circulating_supply ?? 0,
                total_supply = coin.total_supply ?? 0,
                max_supply = coin.max_supply ?? 0,
                ath = coin.ath ?? 0,
                atl = coin.atl ?? 0,
                UpdateAt = DateTime.Now
            };
            coinList.Add(data);

        }
        await _CoinCollection!.InsertManyAsync(coinList);
    }
    public async Task<ChartDataModel> GetChartDataAsync(string coinid, int days)
    {
        try
        {   //symbol like 'bitcoin' 
            string url = $"{_baseUrl}coins/{coinid}/market_chart?vs_currency=usd&days={days}&x_cg_demo_api_key={_apiKey}";

            using var httpClient = new HttpClient();
            var response = await httpClient.GetStringAsync(url);
            var chartData = JsonConvert.DeserializeObject<ChartDataModel>(response);

            if (chartData == null)
            {
                throw new Exception("Failed to fetch chart data from API");
            }

            return chartData;
        }
        catch (Exception ex)
        {
            throw new Exception($"Error fetching chart data: {ex.Message}");
        }
    }
}