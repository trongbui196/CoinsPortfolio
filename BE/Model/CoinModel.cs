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
    public decimal current_price { get; set; } = 0;

    [BsonElement("marketCap")]
    public decimal? market_cap { get; set; }

    [BsonElement("volume")]
    public decimal? total_volume { get; set; }

    [BsonElement("high24h")]
    public decimal? high_24h { get; set; }

    [BsonElement("low24h")]
    public decimal? low_24h { get; set; }

    [BsonElement("pricechange24h")]
    public decimal? price_change_24h { get; set; }

    [BsonElement("percentchange24h")]
    public decimal? price_change_percentage_24h { get; set; }

    [BsonElement("circulating_supply")]
    public decimal? circulating_supply { get; set; }

    [BsonElement("totalsupply")]
    public decimal? total_supply { get; set; }

    [BsonElement("maxsupply")]
    public decimal? max_supply { get; set; }

    [BsonElement("alltimehigh")]
    public decimal? ath { get; set; }

    [BsonElement("alltimelow")]
    public decimal? atl { get; set; }

    [BsonElement("UpdateAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? UpdateAt { get; set; }

}