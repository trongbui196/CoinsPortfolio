using Newtonsoft.Json;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using BE.Models;

public class MongoDBService
{
    protected readonly IMongoCollection<UserModel> _UserCollection;
    protected readonly IMongoCollection<CoinModel> _CoinCollection;
    protected readonly IMongoCollection<PortfolioCoinModel> _PortfolioCoinCollection;
    protected readonly IMongoCollection<FavoriteListModel> _FavoriteListCollection;
    protected readonly IMongoCollection<AdminModel> _AdminCollection;
    protected readonly IMongoCollection<PortfolioModel> _PortCollection;
    protected readonly IMongoCollection<TransactionModel> _TransactionCollection;
    protected readonly IMongoCollection<RefreshTokenModel> _refreshTokens;
    protected string? _baseUrl { get; }
    protected string? _apiKey { get; }
    public IMongoDatabase _database { get; }
    public MongoDBService(IConfiguration config)
    {
        var client = new MongoClient(config.GetValue<string>("MongoDB:Server"));
        var database = client.GetDatabase(config.GetValue<string>("MongoDB:Database"));
        _UserCollection = database.GetCollection<UserModel>("User");
        _CoinCollection = database.GetCollection<CoinModel>("Coins");
        _AdminCollection = database.GetCollection<AdminModel>("Admin");
        _FavoriteListCollection = database.GetCollection<FavoriteListModel>("FavoriteList");
        _PortCollection = database.GetCollection<PortfolioModel>("Portfolio");
        _TransactionCollection = database.GetCollection<TransactionModel>("Transaction");
        _PortfolioCoinCollection = database.GetCollection<PortfolioCoinModel>("PortCoin");
        _refreshTokens = database.GetCollection<RefreshTokenModel>("RefreshTokens");
        _baseUrl = config.GetValue<string>("CoinGecko:Api");
        _apiKey = config.GetValue<string>("CoinGecko:Key");
        _database = database;
    }
}