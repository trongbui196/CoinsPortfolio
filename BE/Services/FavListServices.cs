using MongoDB.Driver;

public class FavListService : MongoDBService
{

    public FavListService(IConfiguration config) : base(config)
    {
    }
    /*public async Task<List<string>> GetFavoriteListAsync(string userid)
    {
        var list = await _FavoriteListCollection.Find(x => x.UserId == userid).FirstOrDefaultAsync();
        var data = list.FavoriteList;
        return data;
    }*/
    public async Task<List<CoinModel>> GetFavoriteListbyIdAsync(string user)
    {
        var list = await _FavoriteListCollection.Find(x => x.UserId == user).FirstOrDefaultAsync();
        var coinlist = list.FavoriteList;
        var data = new List<CoinModel>();
        foreach (var coin in coinlist)
        {
            var coinid = await _CoinCollection.Find(x => x.Id == coin).FirstOrDefaultAsync();
            data.Add(coinid);
        }
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
    public async Task AddCointoFavListAsync(string userid, string coinId)
    {
        var list = await _FavoriteListCollection.Find(x => x.UserId == userid).FirstOrDefaultAsync();
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
}