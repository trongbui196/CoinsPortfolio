using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
[BsonIgnoreExtraElements]

public class CoinModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [BsonElement("coinid")]
    public string? CoinId { get; set; }
    [BsonElement("symbol")]
    public string? Symbol { get; set; }

    [BsonElement("name")]
    public string? Name { get; set; }

    [BsonElement("image")]
    public string? Image { get; set; }

    [BsonElement("currentPrice")]
    public double? current_price { get; set; } = 0;

    [BsonElement("marketCap")]
    public double? market_cap { get; set; } = 0;

    [BsonElement("volume")]
    public double? total_volume { get; set; } = 0;

    [BsonElement("high24h")]
    public double? high_24h { get; set; } = 0;

    [BsonElement("low24h")]
    public double? low_24h { get; set; } = 0;

    [BsonElement("pricechange24h")]
    public double? price_change_24h { get; set; } = 0;

    [BsonElement("percentchange24h")]
    public double? price_change_percentage_24h { get; set; } = 0;

    [BsonElement("circulating_supply")]
    public double? circulating_supply { get; set; } = 0;

    [BsonElement("totalsupply")]
    public double? total_supply { get; set; } = 0;

    [BsonElement("maxsupply")]
    public double? max_supply { get; set; } = 0;

    [BsonElement("alltimehigh")]
    public double? ath { get; set; } = 0;

    [BsonElement("alltimelow")]
    public double? atl { get; set; } = 0;

    [BsonElement("UpdateAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? UpdateAt { get; set; }

}