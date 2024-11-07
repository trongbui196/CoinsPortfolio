using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
[BsonIgnoreExtraElements]

public class CoinModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonElement("symbol")]
    public string? Symbol { get; set; }

    [BsonElement("name")]
    public string? Name { get; set; }

    [BsonElement("image")]
    public string? Image { get; set; }

    [BsonElement("currentPrice")]
    public double? current_price { get; set; }

    [BsonElement("marketCap")]
    public double? market_cap { get; set; }

    [BsonElement("volume")]
    public double? total_volume { get; set; }

    [BsonElement("high24h")]
    public double? high_24h { get; set; }

    [BsonElement("low24h")]
    public double? low_24h { get; set; }

    [BsonElement("pricechange24h")]
    public double? price_change_24h { get; set; }

    [BsonElement("percentchange24h")]
    public double? price_change_percentage_24h { get; set; }

    [BsonElement("circulating_supply")]
    public double? circulating_supply { get; set; }

    [BsonElement("totalsupply")]
    public double? total_supply { get; set; }

    [BsonElement("maxsupply")]
    public double? max_supply { get; set; }

    [BsonElement("alltimehigh")]
    public double? ath { get; set; }

    [BsonElement("alltimelow")]
    public double? atl { get; set; }

    [BsonElement("UpdateAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? UpdateAt { get; set; }

}