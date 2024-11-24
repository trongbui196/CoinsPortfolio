using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace BE.Models
{
    public class RefreshTokenModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Token { get; set; }
        public string UserId { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}