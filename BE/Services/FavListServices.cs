using MongoDB.Driver;

public class FavListService : MongoDBService
{

    public FavListService(IConfiguration config) : base(config)
    {
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
}