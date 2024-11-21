using MongoDB.Driver;
using Newtonsoft.Json;

public class UserService : MongoDBService
{

    private readonly FavListService _favListService;

    public UserService(IConfiguration iconfig, FavListService favListService) : base(iconfig)
    {
        _favListService = favListService;
    }
    public async Task<List<UserModel>> GetAllUserAsync()
    {
        return await _UserCollection.Find(item => true).ToListAsync();
    }
    public async Task<UserModel> GetUserByPhoneAsync(string phone)
    {
        return await _UserCollection.Find(x => x.PhoneNumber == phone).FirstOrDefaultAsync();
    }
    public async Task AddUserAsync(UserModel user)
    {
        await _UserCollection.InsertOneAsync(user);
        await _favListService.CreateNewFavolist(user.Id);

    }
    public async Task DeleteUserAsync(string id)
    {
        await _UserCollection.DeleteOneAsync(x => x.Id == id);
    }
    public async Task UpdateUserAsync(string phone, string username, string email)
    {
        var filter = Builders<UserModel>.Filter.Eq(x => x.PhoneNumber, phone);
        var update = Builders<UserModel>.Update
        .Set(x => x.userName, username)
        .Set(x => x.Email, email);
        await _UserCollection.UpdateOneAsync(filter, update);
    }

}