using System.Text.Json.Serialization;
using MongoDB.Bson;

using MongoDB.Bson.Serialization.Attributes;
[BsonIgnoreExtraElements]
public class UserModel
{

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonElement("userName")]
    [BsonRequired]
    public string? userName { get; set; }
    [BsonElement("firstName")]
    [BsonRequired]
    public string? FirstName { get; set; }
    [BsonElement("lastName")]
    [BsonRequired]
    public string? LastName { get; set; }
    [BsonElement("Email")]
    [BsonRequired]
    public string? Email { get; set; }
    [BsonElement("phoneNumber")]
    [BsonRequired]
    public string? PhoneNumber { get; set; }

    [BsonElement("password")]
    [BsonRequired]
    public string? password { get; set; }
    [BsonElement("language")]
    public string? language { get; set; }
    [BsonElement("currency")]
    public string? currency { get; set; }
    [BsonElement("avatarUrl")]
    public string? avatarUrl { get; set; }
    [BsonElement("createdAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? CreatedAt { get; set; }
}