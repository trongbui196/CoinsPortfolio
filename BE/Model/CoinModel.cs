using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
[BsonIgnoreExtraElements]

public class CoinModel
{

    public string? Id { get; set; }
    [BsonElement("symbol")]
    public string? Symbol { get; set; }

    [BsonElement("name")]
    public string? Name { get; set; }

    [BsonElement("image")]
    public string? Image { get; set; }

    [BsonElement("currentPrice")]
    public float? CurrentPrice { get; set; }

    [BsonElement("marketCap")]
    public float? MarketCap { get; set; }

    [BsonElement("volume")]
    public float? Volume { get; set; }

    [BsonElement("high24h")]
    public float? High24h { get; set; }

    [BsonElement("low24h")]
    public float? Low24h { get; set; }

    [BsonElement("pricechange24h")]
    public float? PriceChange24h { get; set; }

    [BsonElement("percentchange24h")]
    public float? PercentChange24h { get; set; }

    [BsonElement("circulating_supply")]
    public float? CirculatingSupply { get; set; }

    [BsonElement("totalsupply")]
    public float? TotalSupply { get; set; }

    [BsonElement("maxsupply")]
    public float? MaxSupply { get; set; }

    [BsonElement("alltimehigh")]
    public float? AllTimeHigh { get; set; }

    [BsonElement("alltimelow")]
    public float? AllTimeLow { get; set; }

    [BsonElement("UpdateAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime? UpdateAt { get; set; }

}