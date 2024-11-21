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
    public async Task<CoinModel> GetCoinbyNameAsync(string name)
    {
        var data = await _CoinCollection.Find(x => x.Name == name).FirstOrDefaultAsync();
        return data;
    }
    public async Task UpdateCoinAsync()
    {
        List<CoinModel> coinlist = await FetchCoinsFromApi();
        foreach (var coin in coinlist)
        {
            var existcoin = await _CoinCollection.Find(x => x.Symbol == coin.Id).FirstOrDefaultAsync();
            if (existcoin != null)
            {
                var filter = Builders<CoinModel>.Filter.Eq(x => x.Symbol, coin.Id);
                var update = Builders<CoinModel>.Update
                .Set(c => c.current_price, coin.current_price)
                .Set(c => c.market_cap, coin.market_cap)
                .Set(c => c.total_volume, coin.total_volume)
                .Set(c => c.high_24h, coin.high_24h)
                .Set(c => c.low_24h, coin.low_24h)
                .Set(c => c.price_change_24h, coin.price_change_24h)
                .Set(c => c.price_change_percentage_24h, coin.price_change_percentage_24h)
                .Set(c => c.circulating_supply, coin.circulating_supply)
                .Set(c => c.total_supply, coin.total_supply)
                .Set(c => c.max_supply, coin.max_supply)
                .Set(c => c.ath, coin.ath)
                .Set(c => c.atl, coin.atl)
                .Set(c => c.UpdateAt, DateTime.Now);
                await _CoinCollection!.UpdateOneAsync(filter, update);
            }
        }
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
        string url = $"{_baseUrl}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&price_change_percentage=24h?x_cg_demo_api_key={_apiKey}";
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
                Symbol = coin.Symbol,
                Name = coin.Name,
                Image = coin.Image,
                current_price = coin.current_price,
                market_cap = coin.market_cap,
                total_volume = coin.total_volume,
                high_24h = coin.high_24h,
                low_24h = coin.low_24h,
                price_change_24h = coin.price_change_24h,
                price_change_percentage_24h = coin.price_change_percentage_24h,
                circulating_supply = coin.circulating_supply,
                total_supply = coin.total_supply,
                max_supply = coin.max_supply,
                ath = coin.ath,
                atl = coin.atl,
                UpdateAt = DateTime.Now
            };
            coinList.Add(data);

        }
        await _CoinCollection!.InsertManyAsync(coinList);
    }

}