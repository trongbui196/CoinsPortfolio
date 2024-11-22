using MongoDB.Driver;
public class PortfolioService : MongoDBService
{
    public PortfolioService(IConfiguration config) : base(config)
    {
    }
    public async Task<PortfolioDto> GetPortfolioAsync(string userid)
    {
        var port = await _PortCollection.Find(x => x.userId == userid).FirstOrDefaultAsync();
        if (port.Assets.Count == 0)
        {
            var data = new PortfolioDto
            {
                Msg = "Empty"
            };
            return data;
        }
        else
        {
            var data2 = new List<portfolioCoinDto>();
            double? averageAsset = 0;
            double? curMoney = 0;
            foreach (var coin in port.Assets)
            {
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
    public async Task<PortfolioModel> AddtoPortManual(TransactionModel trx)
    {
        var coin = await _CoinCollection.Find(x => x.Id == trx.coinId).FirstOrDefaultAsync();
        var port = await _PortCollection.Find(x => x.userId == trx.UserId).FirstOrDefaultAsync();
        var coinfilter = Builders<PortfolioCoinModel>.Filter.And(
            Builders<PortfolioCoinModel>.Filter.Eq(x => x.coinId, trx.coinId),
            Builders<PortfolioCoinModel>.Filter.Eq(x => x.portId, port.portId)
        );
        var coininPort = await _PortfolioCoinCollection.Find(coinfilter).FirstOrDefaultAsync();
        if (coininPort == null)
        {
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
        Console.WriteLine($"AddtoPort called with userId: {trx.UserId}, coinId: {trx.coinId}, quantity: {trx.quantity}");

        var coin = await _CoinCollection.Find(x => x.Id == trx.coinId).FirstOrDefaultAsync();
        var port = await _PortCollection.Find(x => x.userId == trx.UserId).FirstOrDefaultAsync();

        Console.WriteLine($"Found portfolio: {port?.portId}");

        var coinfilter = Builders<PortfolioCoinModel>.Filter.And(
            Builders<PortfolioCoinModel>.Filter.Eq(x => x.coinId, trx.coinId),
            Builders<PortfolioCoinModel>.Filter.Eq(x => x.portId, port.portId)
        );
        var coininPort = await _PortfolioCoinCollection.Find(coinfilter).FirstOrDefaultAsync();
        if (coininPort == null)
        {
            Console.WriteLine("Creating new portfolio coin entry");
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
            Console.WriteLine($"Updating existing portfolio coin entry: {coininPort.id}");
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
        if (trx == null)
        {
            throw new ArgumentNullException(nameof(trx));
        }

        var coin = await _CoinCollection.Find(x => x.Id == trx.coinId).FirstOrDefaultAsync();
        if (coin == null)
        {
            throw new Exception($"Coin not found");
        }

        var port = await _PortCollection.Find(x => x.userId == trx.UserId).FirstOrDefaultAsync();
        if (port == null)
        {
            throw new Exception($"Portfolio not found");
        }

        var coinfilter = Builders<PortfolioCoinModel>.Filter.And(
            Builders<PortfolioCoinModel>.Filter.Eq(x => x.coinId, trx.coinId),
            Builders<PortfolioCoinModel>.Filter.Eq(x => x.portId, port.portId)
        );
        var coininPort = await _PortfolioCoinCollection.Find(coinfilter).FirstOrDefaultAsync();

        if (coininPort == null)
        {
            throw new Exception("Cannot sell coin that is not in portfolio");
        }

        if (coininPort.totalQuantity < trx.quantity)
        {
            throw new Exception("Insufficient coins to sell");
        }

        var filter = Builders<PortfolioCoinModel>.Filter.Eq(x => x.id, coininPort.id);
        var update = Builders<PortfolioCoinModel>.Update.Combine(
            Builders<PortfolioCoinModel>.Update.Inc(x => x.totalQuantity, -trx.quantity),
            Builders<PortfolioCoinModel>.Update.Inc(x => x.totalMoney, -trx.quantity * coin.current_price),
            Builders<PortfolioCoinModel>.Update.Inc(x => x.totalChange, -trx.quantity * (coin.current_price - trx.coinPrice))
        );

        await _PortfolioCoinCollection.UpdateOneAsync(filter, update);

        // If all coins are sold, remove from portfolio
        var updatedCoin = await _PortfolioCoinCollection.Find(filter).FirstOrDefaultAsync();
        if (updatedCoin.totalQuantity <= 0)
        {
            await RemoveCoinfromPortAsync(trx.UserId, trx.coinId);
        }

        return await _PortCollection.Find(x => x.userId == trx.UserId).FirstOrDefaultAsync();
    }
    public async Task<PortfolioModel> ConvertInPort(string userid, string coinA, string coinB, double coinAquantity)
    {
        // Get coin info for both coins
        var CoinA = await _CoinCollection.Find(x => x.Id == coinA).FirstOrDefaultAsync();
        var CoinB = await _CoinCollection.Find(x => x.Id == coinB).FirstOrDefaultAsync();

        if (CoinA == null || CoinB == null)
        {
            throw new Exception("One or both coins not found");
        }

        // Calculate conversion amounts
        var sellAmountUSD = coinAquantity * CoinA.current_price;
        var buyQuantityB = sellAmountUSD / CoinB.current_price;

        // Create sell transaction for CoinA
        var sellTrx = new TransactionModel
        {
            UserId = userid,
            coinId = coinA,
            quantity = coinAquantity,
            coinPrice = CoinA.current_price,
            trxType = TransactionModel.TrxType.Convert,
            notes = $"Convert to {CoinB.Name}"
        };

        // Create buy transaction for CoinB
        var buyTrx = new TransactionModel
        {
            UserId = userid,
            coinId = coinB,
            quantity = buyQuantityB,
            coinPrice = CoinB.current_price,
            trxType = TransactionModel.TrxType.Convert,
            notes = $"Convert from {CoinA.Name}"
        };

        // For debugging, use string interpolation properly:
        Console.WriteLine($"userid parameter: {userid}");
        Console.WriteLine($"sellTrx.UserId: {sellTrx.UserId}");

        // Handle the conversion in portfolio
        await SelltoPort(sellTrx);
        return await AddtoPort(buyTrx);
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
    public async Task RemoveCoinfromPortAsync(string userid, string coinid)
    {
        var port = await _PortCollection.Find(x => x.userId == userid).FirstOrDefaultAsync();
        var coinPort = await _PortfolioCoinCollection.Find(x => x.coinId == coinid && x.portId == port.portId).FirstOrDefaultAsync();
        var filter = Builders<PortfolioModel>.Filter.Eq(x => x.userId, userid);
        var update = Builders<PortfolioModel>.Update.Pull(x => x.Assets, coinPort.id);
        await _PortCollection.UpdateOneAsync(filter, update);
    }
    // 22/11 : adjust the sell part in convert in port, it crash there.
}
