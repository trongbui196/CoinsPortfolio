using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
[BsonIgnoreExtraElements]
public class TransactionModel
{
    public enum TrxType
    {
        [EnumMember(Value = "Buy")]
        Buy,
        [EnumMember(Value = "Sell")]
        Sell,
        [EnumMember(Value = "Convert")]
        Convert,
        [EnumMember(Value = "Deposit")]
        Deposit,
        [EnumMember(Value = "Withdraw")]
        Withdraw
    }
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonElement("userId")]
    [DefaultValue("67260d795577ce6acec7b318")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? UserId { get; set; }

    [BsonElement("trxType")]
    [EnumDataType(typeof(TrxType), ErrorMessage = "only accept given value ( 0,1,2 )")]
    public TrxType trxType { get; set; } = 0;// sell /buy/ convert
    [BsonElement("buySource")]
    [DefaultValue("USD")]
    public string? buySource { get; set; } = "Usd";  // usd or convert from other

    [BsonElement("coinId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? coinId { get; set; }
    [BsonElement("coinPrice")]
    [BsonRepresentation(BsonType.Double)]
    public double? coinPrice { get; set; }

    [BsonElement("quantity")]
    [BsonRepresentation(BsonType.Double)]

    public double? quantity { get; set; }
    [BsonElement("notes")]
    public string? notes { get; set; }
    [BsonElement("CreateAt")]
    public DateTime CreateAt { get; set; }
}