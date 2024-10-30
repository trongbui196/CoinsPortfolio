using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class portfolioCoinModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId UserId { get; set; }
    [BsonElement("coinId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId CoinId { get; set; }
    [BsonElement("quantity")]
    public float Quantity { get; set; }
    [BsonElement("priceAtBought")]
    public float PriceAtBought { get; set; }
    [BsonElement("timeBought")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime TimeBought { get; set; }
}
