using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
[BsonIgnoreExtraElements]
public class TransactionModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("userId")]
    public ObjectId UserId { get; set; }

    [BsonElement("trxType")]
    public string trxType { get; set; } // sell /buy/ convert
    [BsonElement("buySource")]
    public string buySource { get; set; }   // usd or convert from other

    [BsonElement("coinId")]
    public ObjectId coinId { get; set; }

    [BsonElement("quantity")]
    public float quantity { get; set; }
    [BsonElement("totalAmount")]
    public float totalAmount { get; set; }
    [BsonElement("notes")]
    public string notes { get; set; }
    [BsonElement("CreateAt")]

    public DateTime CreateAt { get; set; }
}