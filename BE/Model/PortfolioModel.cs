using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class PortfolioModel
{
    [BsonId]
    [BsonElement("portId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? portId { get; set; }
    public string? userId { get; set; }
    public List<string>? Assets { get; set; } //contain objectid
}
public class PortfolioCoinModel
{
    public string? portId { get; set; }
    public string? coinId { get; set; }
    public double? totalQuantity { get; set; }
    public double? totalMoney { get; set; }
    public double? totalChange { get; set; }

}