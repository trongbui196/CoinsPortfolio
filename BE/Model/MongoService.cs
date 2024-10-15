using MongoDB.Driver;

namespace BE.Model
{
    public class MongoDBService
    {
        private readonly IMongoCollection<UserModel> _UserCollection;
        private readonly IMongoCollection<AnalyzationModel> _AnalyzationModel;
        private readonly IMongoCollection<FavoriteListModel> _FavoriteListModel;
        private readonly IMongoCollection<CoinModel> _CoinModel;
        private readonly IMongoCollection<PortfolioModel> _PortfolioModel;
        private readonly IMongoCollection<TransactionModel> _TransactionModel;
        public MongoDBService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("MongoDB:Server"));
            var database = client.GetDatabase(config.GetValue<string>("MongoDB:Database"));
            _UserCollection = database.GetCollection<UserModel>("User");
            var indexKeysDefinition = Builders<UserModel>.IndexKeys.Ascending(user => user.userName);
            var indexOptions = new CreateIndexOptions { Unique = true };
            var indexModel = new CreateIndexModel<UserModel>(indexKeysDefinition, indexOptions);
            _UserCollection.Indexes.CreateOne(indexModel);
            _AnalyzationModel = database.GetCollection<AnalyzationModel>("Analyze");
            _FavoriteListModel = database.GetCollection<FavoriteListModel>("FavoriteList");
            _CoinModel = database.GetCollection<CoinModel>("Coins");
            _PortfolioModel = database.GetCollection<PortfolioModel>("Portfolio");
            _TransactionModel = database.GetCollection<TransactionModel>("Transaction");
        }
        //User
        public async Task<List<UserModel>> GetAllUserAsync()
        {
            return await _UserCollection.Find(item => true).ToListAsync();
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
        public async Task DeleteUser(string id)
        {
            await _UserCollection.DeleteOneAsync(item => item.Id == id);
        }
        public async Task UpdateUser(string id, UserModel user)
        {
            await _UserCollection.ReplaceOneAsync(item => item.Id == id, user);
        }
    }
}