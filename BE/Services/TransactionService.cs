using MongoDB.Driver;
public class TransactionService : MongoDBService
{
    private readonly PortfolioService _portService;
    public TransactionService(IConfiguration config, PortfolioService portfolioService) : base(config)
    {
        _portService = portfolioService;
    }
    public async Task addTrxAsync(TransactionModel trx)
    {
        Console.WriteLine("add trx");
        Console.WriteLine($"id={trx.coinId}");
        Console.WriteLine($"price={trx.coinPrice}");
        Console.WriteLine($"id={trx.quantity}");
        Console.WriteLine($"id={trx.UserId}");
        Console.WriteLine($"type={trx.trxType}");

        //luc chuyen qua selltoport thieu coinprice
        if (trx.notes == null) trx.notes = "default note";
        var coin = await _CoinCollection.Find(x => x.Name == trx.coinId).FirstOrDefaultAsync();
        Console.WriteLine(coin.current_price);

        var port = await _PortCollection.Find(x => x.userId == trx.UserId).FirstOrDefaultAsync();
        Console.WriteLine($"before enter swtich id={trx.coinId}");
        switch (trx.trxType)
        {
            case 0:
                Console.WriteLine("add to port", trx.coinId);
                await _portService.AddtoPort(trx);


                break;
            case (TransactionModel.TrxType)1:
                Console.WriteLine("sell to port:", trx.coinId);

                await _portService.SelltoPort(trx);
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
        if (data == null) Console.WriteLine("data null at addtrx");

        await _TransactionCollection.InsertOneAsync(data);
    }
    public async Task addTrxManuallyAsync(TransactionModel trx)
    {
        var coin = await _CoinCollection.Find(x => x.CoinId == trx.coinId).FirstOrDefaultAsync();
        switch (trx.trxType)
        {
            case 0:
                await _portService.AddtoPortManual(trx);
                break;
            case (TransactionModel.TrxType)1:
                await _portService.SelltoPort(trx);
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
            var user = await _UserCollection.Find(x => x.Id == data.UserId).FirstOrDefaultAsync();
            var coin = await _CoinCollection.Find(x => x.Name == data.coinId).FirstOrDefaultAsync();
            var res = new TransactionDto
            {
                TransactionId = data.Id,

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
            Builders<TransactionModel>.Filter.Eq(x => x.UserId, userid)
        );
        var trx = await _TransactionCollection.Find(filter).FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Transaction not found.");
        var coin = await _CoinCollection.Find(x => x.Name == trx.coinId).FirstOrDefaultAsync();
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
        var trx = await _TransactionCollection.Find(x => x.UserId == userid).ToListAsync();
        var result = new List<TransactionDto>();
        if (trx == null)
        {
            throw new ArgumentNullException(nameof(trx), "user dont have trx");
        }
        foreach (var data in trx)
        {
            var coin = await _CoinCollection.Find(x => x.Name == data.coinId).FirstOrDefaultAsync();
            var res = new TransactionDto
            {
                TransactionId = data.Id,
                TrxType = data.trxType,
                buySource = data.buySource,
                CoinName = coin.Name,
                coinPrice = data.coinPrice,
                quantity = data.quantity,
                totalAmount = data.quantity * coin.current_price,
                TimeExecute = data.CreateAt,
                Notes = data.notes
            };
            result.Add(res);
        }
        return result;
    }
    public async Task DeleteTrxAsync(string trxid)
    {
        await _TransactionCollection.DeleteOneAsync(x => x.Id == trxid);
    }
    public async Task DepositAsync(string userid, double amount)
    {
        var port = await _PortCollection.Find(x => x.userId == userid).FirstOrDefaultAsync();
        var coin = await _CoinCollection.Find(x => x.Id == "6750300893645cec58c9d1d7").FirstOrDefaultAsync();
        var data = new TransactionModel
        {
            UserId = userid,
            trxType = TransactionModel.TrxType.Deposit,
            buySource = "Bank",
            coinId = "Tether", // mac dinh la usdt
            coinPrice = coin.current_price,
            quantity = amount,
            notes = "Deposit from bank",
            CreateAt = DateTime.Now
        };
        await _portService.AddtoPort(data);
        await _TransactionCollection.InsertOneAsync(data);
    }
    public async Task WithdrawAsync(string userid, double amount, string coinid)
    {
        var port = await _PortCollection.Find(x => x.userId == userid).FirstOrDefaultAsync();
        var coin = await _CoinCollection.Find(x => x.Name == coinid).FirstOrDefaultAsync();
        var coininPort = await _PortfolioCoinCollection.Find(x => x.portId == port.portId && x.coinId == coin.CoinId).FirstOrDefaultAsync();
        if (coininPort.totalQuantity < amount)
        {
            throw new ArgumentException("Not enough coin in port");
        }
        var trxdata = new TransactionModel
        {
            UserId = userid,
            trxType = TransactionModel.TrxType.Withdraw,
            buySource = "Bank",
            coinId = coin.Name,
            coinPrice = coin.current_price,
            quantity = amount,
            notes = "Withdraw to bank",
            CreateAt = DateTime.Now
        };
        await _portService.SelltoPort(trxdata);
        await _TransactionCollection.InsertOneAsync(trxdata);
    }
}