using MongoDB.Driver;

namespace BE.Services
{
    public class AdminService : MongoDBService
    {

        private readonly JwtService _jwtService;

        public AdminService(IConfiguration config, JwtService jwtService) : base(config)
        {
            _jwtService = jwtService;
        }
        public async Task<AdminModel> FindAdmin(string username)
        {
            return await _AdminCollection.Find(x => x.Username == username).FirstOrDefaultAsync();
        }
        public async Task<List<AdminModel>> GetAdminAsync()
        {
            return await _AdminCollection.Find(x => true).ToListAsync();
        }
        public async Task AddAdminrAsync(AdminModel admin)
        {
            await _AdminCollection.InsertOneAsync(admin);
        }


    }
}