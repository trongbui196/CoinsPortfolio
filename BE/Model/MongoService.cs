using Newtonsoft.Json;
using MongoDB.Driver;

public class MongoDBService
{
    private readonly IMongoCollection<UserModel> _UserCollection;
    private readonly IMongoCollection<AnalyzationModel> _AnalyzationCollection;
    private readonly IMongoCollection<FavoriteListModel> _FavoriteListModel;
    private readonly IMongoCollection<CoinModel> _CoinCollection;
    private readonly IMongoCollection<PortfolioModel> _PortfolioModel;
    private readonly IMongoCollection<TransactionModel> _TransactionModel;
    //private readonly IHttpClientFactory _httpClientFactory;
    private readonly string? _baseUrl;
    private readonly string? _apiKey;
    public MongoDBService(IConfiguration config)
    {
        var client = new MongoClient(config.GetValue<string>("MongoDB:Server"));
        var database = client.GetDatabase(config.GetValue<string>("MongoDB:Database"));
        _UserCollection = database.GetCollection<UserModel>("User");
        var indexKeysDefinition = Builders<UserModel>.IndexKeys.Ascending(user => user.userName);
        var indexOptions = new CreateIndexOptions { Unique = true };
        var indexModel = new CreateIndexModel<UserModel>(indexKeysDefinition, indexOptions);
        _UserCollection.Indexes.CreateOne(indexModel);
        _AnalyzationCollection = database.GetCollection<AnalyzationModel>("Analyze");
        _FavoriteListModel = database.GetCollection<FavoriteListModel>("FavoriteList");
        _CoinCollection = database.GetCollection<CoinModel>("Coins");
        _PortfolioModel = database.GetCollection<PortfolioModel>("Portfolio");
        _TransactionModel = database.GetCollection<TransactionModel>("Transaction");
        _baseUrl = config.GetValue<string>("CoinGecko:Api");
        _apiKey = config.GetValue<string>("CoinGecko:Key");
    }
    //User
    public async Task<List<UserModel>> GetAllUserAsync()
    {
        return await _UserCollection.Find(item => true).ToListAsync();
    }
    public async Task<List<CoinModel>> GetAllCoinAsync()
    {
        return await _CoinCollection.Find(item => true).ToListAsync();
    }
    public async Task<UserModel> GetUserById(string id)
    {
        return await _UserCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
    }
    //same with modify 
    public async Task AddUser(UserModel user)
    {
        await _UserCollection.InsertOneAsync(user);
    }
    public async Task AddCoins(CoinModel coin)
    {
        await _CoinCollection.InsertOneAsync(coin);
    }
    public async Task DeleteUser(string id)
    {
        await _UserCollection.DeleteOneAsync(item => item.Id == id);
    }
    public async Task UpdateUser(string id, UserModel user)
    {
        await _UserCollection.ReplaceOneAsync(item => item.Id == id, user);
    }
    public async Task<List<CoinModel>> FetchCoinsFromApi()
    {
        string url = $"{_baseUrl}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&price_change_percentage=24h?x_cg_demo_api_key={_apiKey}";
        Console.WriteLine(url);
        using var httpClient = new HttpClient();
        var response = await httpClient.GetAsync(url);
        Console.WriteLine(response.StatusCode);
        // added below check why api k tra after current price
        Console.WriteLine(response.Content);
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Error fetching data from external API");
        }

        string apiResponse = await response.Content.ReadAsStringAsync();
        var coinsData = JsonConvert.DeserializeObject<List<CoinModel>>(apiResponse);

        return coinsData ?? new List<CoinModel>();
    }
    public async Task AddCoinsAsync()
    {
        var coinsData = await FetchCoinsFromApi();
        Console.WriteLine(coinsData);
        foreach (var coin in coinsData)
        {
            Console.WriteLine(coin.Name);
            var existingCoin = await _CoinCollection.Find(c => c.Symbol == coin.Symbol).FirstOrDefaultAsync();
            if (existingCoin == null)
            {

                await _CoinCollection.InsertOneAsync(coin);
            }
        }
    }
    public async Task UpdateCoinsAsync()
    {
        var coinsData = await FetchCoinsFromApi();

        foreach (var coin in coinsData)
        {
            var existingCoin = await _CoinCollection.Find(c => c.Id == coin.Id).FirstOrDefaultAsync();
            if (existingCoin != null)
            {
                // Update the existing coin with new data
                await _CoinCollection.ReplaceOneAsync(c => c.Id == coin.Id, coin);
            }
        }
    }
}