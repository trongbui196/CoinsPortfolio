using Newtonsoft.Json;
using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.VisualBasic;

public class MongoDBService
{
    private readonly IMongoCollection<UserModel> _UserCollection;
    private readonly IMongoCollection<PortfolioCoinModel> _PortfolioCoinCollection;
    private readonly IMongoCollection<AnalyzationModel> _AnalyzationCollection;
    private readonly IMongoCollection<FavoriteListModel> _FavoriteListCollection;
    private readonly IMongoCollection<CoinModel> _CoinCollection;
    private readonly IMongoCollection<PortfolioModel> _PortCollection;
    private readonly IMongoCollection<TransactionModel> _TransactionCollection;
    //private readonly IHttpClientFactory _httpClientFactory;
    private readonly string? _baseUrl;
    private readonly string? _apiKey;
    public MongoDBService(IConfiguration config)
    {
        var client = new MongoClient(config.GetValue<string>("MongoDB:Server"));
        var database = client.GetDatabase(config.GetValue<string>("MongoDB:Database"));
        _UserCollection = database.GetCollection<UserModel>("User");
        // var indexKeysDefinition = Builders<UserModel>.IndexKeys.Ascending(user => user.userName);
        // var indexOptions = new CreateIndexOptions { Unique = true };
        // var indexModel = new CreateIndexModel<UserModel>(indexKeysDefinition, indexOptions);
        // _UserCollection.Indexes.CreateOne(indexModel);
        _AnalyzationCollection = database.GetCollection<AnalyzationModel>("Analyze");
        _FavoriteListCollection = database.GetCollection<FavoriteListModel>("FavoriteList");
        _CoinCollection = database.GetCollection<CoinModel>("Coins");
        _PortCollection = database.GetCollection<PortfolioModel>("Portfolio");
        _TransactionCollection = database.GetCollection<TransactionModel>("Transaction");
        _PortfolioCoinCollection = database.GetCollection<PortfolioCoinModel>("PortCoin");
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
    public async Task<CoinModel> GetCoinByNameAsync(string name)
    {
        return await _CoinCollection.Find(x => x.Symbol == name).FirstOrDefaultAsync();
    }
    public async Task<UserModel> GetUserByPhoneAsync(string phone)
    {
        return await _UserCollection.Find(x => x.PhoneNumber == phone).FirstOrDefaultAsync();
    }
    public async Task AddUserAsync(UserModel user)
    {
        await _UserCollection.InsertOneAsync(user);
        await CreateNewFavolist(user.Id);
    }
    public async Task DeleteCoin(string id)
    {
        await _CoinCollection.DeleteOneAsync(x => x.Id == id);
    }
    public async Task DeleteUser(string id)
    {
        await _UserCollection.DeleteOneAsync(x => x.Id == id);
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
        var response = await httpClient.GetStringAsync(url);
        var convertedresponse = JsonConvert.DeserializeObject<List<CoinModel>>(response);
        return convertedresponse;
    }
    public async Task AddCoins(CoinModel coin)
    {
        await _CoinCollection.InsertOneAsync(coin);
    }
    public async Task AddCoinsAsync()
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
        await _CoinCollection.InsertManyAsync(coinList);

    }

    public async Task DeleteCoinsAsync()
    {
        await _CoinCollection.DeleteManyAsync(x => true);
    }
    public async Task UpdateCoinsAsync()
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
                await _CoinCollection.UpdateOneAsync(filter, update);
            }
        }
    }
    public async Task UpdateUserAsync(string phone, string username, string email)
    {
        var filter = Builders<UserModel>.Filter.Eq(x => x.PhoneNumber, phone);
        var update = Builders<UserModel>.Update
        .Set(x => x.userName, username)
        .Set(x => x.Email, email);
        await _UserCollection.UpdateOneAsync(filter, update);
    }
    public async Task<List<CoinModel>> GetFavoriteListAsync(string userid)
    {
        var list = await _FavoriteListCollection.Find(x => x.UserId == userid).FirstOrDefaultAsync();
        var filter = Builders<CoinModel>.Filter.In(x => x.Id, list.FavoriteList);
        var data = await _CoinCollection.Find(filter).ToListAsync();
        return data;
    }
    public async Task CreateNewFavolist(string userid)
    {
        var data = new FavoriteListModel
        {
            UserId = userid,
            FavoriteList = new List<string>()
        };
        await _FavoriteListCollection.InsertOneAsync(data);

    }
    public async Task AddCointoFavListAsync(string listId, string coinId)
    {
        var list = await _FavoriteListCollection.Find(x => x.Id == listId).FirstOrDefaultAsync();
        list.FavoriteList.Add(coinId);
        list.UpdatedAt = DateTime.Now;
        await _FavoriteListCollection.ReplaceOneAsync(x => x.Id == list.Id, list);
    }
    public async Task RemoveCoinfromFavListAsync(string listId, string coinId)
    {
        var list = await _FavoriteListCollection.Find(x => x.Id == listId).FirstOrDefaultAsync();
        list.FavoriteList.Remove(coinId);
        list.UpdatedAt = DateTime.Now;
        await _FavoriteListCollection.ReplaceOneAsync(x => x.Id == list.Id, list);
    }
    public async Task<List<FavoriteListModel>> GetAllFavList()
    {
        return await _FavoriteListCollection.Find(x => true).ToListAsync();
    }
    // add trx
    // get all
    // get details
    // get all from user
    public async Task<PortfolioModel> AddtoPortManual(TransactionModel trx)
    {
        var coin = await _CoinCollection.Find(x => x.Id == trx.coinId).FirstOrDefaultAsync();
        var port = await _PortCollection.Find(x => x.userId == trx.UserId).FirstOrDefaultAsync();
        var coinfilter = Builders<PortfolioCoinModel>.Filter.And(
            Builders<PortfolioCoinModel>.Filter.Eq(x => x.coinId, trx.coinId),
            Builders<PortfolioCoinModel>.Filter.Eq(x => x.portId, port.portId)
        );
        var coininPort = await _PortfolioCoinCollection.Find(coinfilter).FirstOrDefaultAsync();
        //var coininPort = await _PortfolioCoinCollection.Find(x => x.portId == port.portId).FirstOrDefaultAsync();
        if (coininPort == null)
        {
            Console.WriteLine("coininport null");

            var data = new PortfolioCoinModel
            {
                portId = port.portId,
                coinId = trx.coinId,
                totalQuantity = trx.quantity,
                totalMoney = trx.quantity * trx.coinPrice,
                totalChange = trx.quantity * (coin.current_price - trx.coinPrice)
            };
            await _PortfolioCoinCollection.InsertOneAsync(data);
            var filter = Builders<PortfolioModel>.Filter.Eq(x => x.userId, trx.UserId);
            var update = Builders<PortfolioModel>.Update.Push(x => x.Assets, data.id);
            await _PortCollection.UpdateOneAsync(filter, update);
        }
        else
        {
            var filter = Builders<PortfolioCoinModel>.Filter.Eq(x => x.id, coininPort.id);
            var averesult = (coininPort.totalQuantity * coininPort.averagePrice + trx.quantity * trx.coinPrice) / (trx.quantity + coininPort.totalQuantity);
            var update = Builders<PortfolioCoinModel>.Update.Combine(
                Builders<PortfolioCoinModel>.Update.Inc(x => x.totalQuantity, trx.quantity),
                Builders<PortfolioCoinModel>.Update.Inc(x => x.totalMoney, trx.quantity * trx.coinPrice),
                Builders<PortfolioCoinModel>.Update.Inc(x => x.totalChange, trx.quantity * (coin.current_price - trx.coinPrice)),
                Builders<PortfolioCoinModel>.Update.Set(x => x.averagePrice, averesult)
            );
            await _PortfolioCoinCollection.UpdateOneAsync(filter, update);
        }
        return await _PortCollection.Find(x => x.userId == trx.UserId).FirstOrDefaultAsync();
    }
    public async Task<PortfolioModel> AddtoPort(TransactionModel trx)
    {
        var coin = await _CoinCollection.Find(x => x.Id == trx.coinId).FirstOrDefaultAsync();
        if (coin != null)
            Console.WriteLine("4");
        var port = await _PortCollection.Find(x => x.userId == trx.UserId).FirstOrDefaultAsync();
        if (port != null)
            Console.WriteLine("5");
        var coinfilter = Builders<PortfolioCoinModel>.Filter.And(
            Builders<PortfolioCoinModel>.Filter.Eq(x => x.coinId, trx.coinId),
            Builders<PortfolioCoinModel>.Filter.Eq(x => x.portId, port.portId)
        );
        if (coinfilter != null)
            Console.WriteLine("6");

        var coininPort = await _PortfolioCoinCollection.Find(coinfilter).FirstOrDefaultAsync();
        if (coininPort == null)
        {
            Console.WriteLine("null");

            var data = new PortfolioCoinModel
            {
                portId = port.portId,
                coinId = trx.coinId,
                totalQuantity = trx.quantity,
                totalMoney = trx.quantity * coin.current_price,
                totalChange = trx.quantity * (coin.current_price - trx.coinPrice),
                averagePrice = coin.current_price
            };
            await _PortfolioCoinCollection.InsertOneAsync(data);
            var filter = Builders<PortfolioModel>.Filter.Eq(x => x.userId, trx.UserId);
            var update = Builders<PortfolioModel>.Update.Push(x => x.Assets, data.id);
            await _PortCollection.UpdateOneAsync(filter, update);
        }
        else
        {
            var averesult = (coininPort.totalQuantity * coininPort.averagePrice + trx.quantity * trx.coinPrice) / (trx.quantity + coininPort.totalQuantity);
            var filter = Builders<PortfolioCoinModel>.Filter.Eq(x => x.id, coininPort.id);
            var update = Builders<PortfolioCoinModel>.Update.Combine(
                Builders<PortfolioCoinModel>.Update.Inc(x => x.totalQuantity, trx.quantity),
                Builders<PortfolioCoinModel>.Update.Inc(x => x.totalMoney, trx.quantity * coin.current_price),
                Builders<PortfolioCoinModel>.Update.Inc(x => x.totalChange, trx.quantity * (coin.current_price - trx.coinPrice)),
                Builders<PortfolioCoinModel>.Update.Set(x => x.averagePrice, averesult)
            );
            await _PortfolioCoinCollection.UpdateOneAsync(filter, update);
        }
        return await _PortCollection.Find(x => x.userId == trx.UserId).FirstOrDefaultAsync();
    }
    public async Task<PortfolioModel> SelltoPort(TransactionModel trx)
    {
        //     var coin = await _CoinCollection.Find(x => x.Id == trx.coinId).FirstOrDefaultAsync();
        //     var port = await _PortCollection.Find(x => x.userId == trx.UserId).FirstOrDefaultAsync();
        //     var coininPort = port.Assets.Find(x => x.)
        return null;
    }
    public async Task<PortfolioModel> ConvertInPort(TransactionModel trx)
    {
        return null;
    }

    public async Task addTrxAsync(TransactionModel trx)
    {
        var coin = await _CoinCollection.Find(x => x.Id == trx.coinId).FirstOrDefaultAsync();
        if (coin != null)
            Console.WriteLine("1");

        var port = await _PortCollection.Find(x => x.userId == trx.UserId.ToString()).FirstOrDefaultAsync();
        if (port != null)
            Console.WriteLine("2");
        switch (trx.trxType)
        {
            case 0:
                Console.WriteLine("3");

                await AddtoPort(trx);
                break;
            case (TransactionModel.TrxType)1:
                await SelltoPort(trx);
                break;
            case (TransactionModel.TrxType)2:
                await ConvertInPort(trx);
                break;
        }
        var data = new TransactionModel
        {
            UserId = trx.UserId,
            trxType = trx.trxType,
            buySource = trx.buySource,
            coinId = trx.coinId,
            coinPrice = coin.current_price,
            quantity = trx.quantity,
            notes = trx.notes,
            CreateAt = DateTime.Now
        };
        await _TransactionCollection.InsertOneAsync(data);
    }
    public async Task addTrxManuallyAsync(TransactionModel trx)
    {
        var coin = await _CoinCollection.Find(x => x.Id == trx.coinId).FirstOrDefaultAsync();
        switch (trx.trxType)
        {
            case 0:
                await AddtoPortManual(trx);
                break;
            case (TransactionModel.TrxType)1:
                await SelltoPort(trx);
                break;
            case (TransactionModel.TrxType)2:
                await ConvertInPort(trx);
                break;
        }
        var data = new TransactionModel
        {
            UserId = trx.UserId,
            trxType = trx.trxType,
            buySource = trx.buySource,
            coinId = trx.coinId,
            coinPrice = trx.coinPrice,
            quantity = trx.quantity,
            notes = trx.notes,
            CreateAt = DateTime.Now
        };
        await _TransactionCollection.InsertOneAsync(data);
    }
    public async Task<List<TransactionDto>> GetAllTrxAsync()
    {
        var trx = await _TransactionCollection.Find(x => true).ToListAsync();
        var result = new List<TransactionDto>();
        if (trx == null)
        {
            throw new ArgumentNullException(nameof(trx), "cannot find trx");
        }
        foreach (var data in trx)
        {
            var user = await _UserCollection.Find(x => x.Id == data.UserId.ToString()).FirstOrDefaultAsync();
            var coin = await _CoinCollection.Find(x => x.Id == data.coinId.ToString()).FirstOrDefaultAsync();
            var res = new TransactionDto
            {
                TransactionId = data.Id,
                userName = user.userName,
                TrxType = data.trxType,
                buySource = data.buySource,
                CoinName = coin.Name,
                coinPrice = data.coinPrice,
                quantity = data.quantity,
                totalAmount = data.quantity * coin.current_price,
                Notes = data.notes,
                TimeExecute = data.CreateAt
            };
            result.Add(res);
        }
        return result;
    }
    public async Task<TransactionDto> GetTrxDetailAsync(string userid, string trxid)
    {
        var filter = Builders<TransactionModel>.Filter.And(
            Builders<TransactionModel>.Filter.Eq(x => x.Id, trxid),
            Builders<TransactionModel>.Filter.Eq(x => x.UserId.ToString(), userid)
        );
        var trx = await _TransactionCollection.Find(filter).FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Transaction not found.");
        var coin = await _CoinCollection.Find(x => x.Id == trx.coinId.ToString()).FirstOrDefaultAsync();
        var res = new TransactionDto
        {
            TransactionId = trx.Id,
            TrxType = trx.trxType,
            buySource = trx.buySource,
            CoinName = coin.Name,
            coinPrice = trx.coinPrice,
            quantity = trx.quantity,
            totalAmount = trx.quantity * coin.current_price,
            TimeExecute = trx.CreateAt
        };
        return res;
    }
    public async Task<List<TransactionDto>> GetTrxsByUserAsync(string userid)
    {
        var trx = await _TransactionCollection.Find(x => x.UserId.ToString() == userid).ToListAsync();
        var result = new List<TransactionDto>();
        if (trx == null)
        {
            throw new ArgumentNullException(nameof(trx), "user dont have trx");
        }
        foreach (var data in trx)
        {
            var coin = await _CoinCollection.Find(x => x.Id == data.coinId.ToString()).FirstOrDefaultAsync();
            var res = new TransactionDto
            {
                TransactionId = data.Id,
                TrxType = data.trxType,
                buySource = data.buySource,
                CoinName = coin.Name,
                coinPrice = data.coinPrice,
                quantity = data.quantity,
                totalAmount = data.quantity * coin.current_price,
                TimeExecute = data.CreateAt
            };
            result.Add(res);
        }
        return result;
    }
    public async Task DeleteTrxAsync(string trxid)
    {
        await _TransactionCollection.DeleteOneAsync(x => x.Id == trxid);
    }
    // 4/11 : use Aggregation for port data
    public async Task<PortfolioDto> GetPortfolioAsync(string userid)
    {
        var port = await _PortCollection.Find(x => x.userId == userid).FirstOrDefaultAsync();
        if (port == null)
        {
            Console.WriteLine("1");
        }
        Console.WriteLine(port.userId);
        Console.WriteLine(port.Assets.Count);

        if (port.Assets.Count == 0)
        {
            Console.WriteLine(2);

            var data = new PortfolioDto
            {
                Msg = "Empty"
            };
            return data;
        }
        else
        {
            Console.WriteLine(3);

            var data2 = new List<portfolioCoinDto>();
            Console.WriteLine("data 2: ", data2);

            double? averageAsset = 0; //initial dep
            double? curMoney = 0;
            foreach (var coin in port.Assets)
            {
                Console.WriteLine(coin);
                var portCoinInfo = await _PortfolioCoinCollection.Find(x => x.id == coin).FirstOrDefaultAsync();
                var coinInfo = await _CoinCollection.Find(x => x.Id == portCoinInfo.coinId).FirstOrDefaultAsync();
                data2.Add(new portfolioCoinDto
                {
                    CoinName = coinInfo.Name,
                    TotalQuantity = portCoinInfo.totalQuantity,
                    AveragePrice = portCoinInfo.averagePrice,
                    CurrentValue = coinInfo.current_price,
                    Change = portCoinInfo.totalQuantity * (coinInfo.current_price - portCoinInfo.averagePrice),
                });
                averageAsset += portCoinInfo.totalQuantity * portCoinInfo.averagePrice;
                curMoney += portCoinInfo.totalQuantity * coinInfo.current_price;
                Console.WriteLine($"total ave:{averageAsset} ");
                Console.WriteLine($"total cur money: {curMoney}");

            }

            var data = new PortfolioDto
            {
                UserId = userid,
                NumberofTokenHold = port.Assets.Count,
                Assets = data2,
                AssetMoney = averageAsset,
                changeTotal = curMoney - averageAsset,
                Msg = "success"
            };

            return data;
        }



    }
    public async Task InitPort(string userid)
    {
        var port = await _PortCollection.Find(x => x.userId == userid).FirstOrDefaultAsync();
        if (port != null)
        {
            throw new Exception("user already have portf");

        }
        var data = new PortfolioModel
        {
            userId = userid,
            Assets = new List<string>()
        };
        await _PortCollection.InsertOneAsync(data);
    }
    // 06/11 : next time task: add notes to trxdto
    // 06/11 : change coinId in trx to objectId to do aggregation if possible 
    // 07/11: -> dont change to objectID, notes in trxdto added : create a port model to store ( so dont need to query mongo for port, based on trxtype to adjust port)



}
