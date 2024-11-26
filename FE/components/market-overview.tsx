import { Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const marketData = await axios.get(
  "http://localhost:5101/api/Coins/getTop5Gainers"
);

export function MarketOverview() {
  const navigate = useNavigate();
  const handleCoinClick = (symbol: string) => {
    navigate(`/coin/${symbol.toLowerCase()}`);
  };
  return (
    <section className="w-full container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Top Gainer Last 24hrs</h1>
        <div className="flex gap-2"></div>
      </div>
      <div
        className="grid w-full"
        style={{ gridTemplateColumns: "repeat(5, 1fr)", gridGap: "1rem" }}
      >
        {marketData.data.map((coin) => (
          <Card key={coin.symbol} className="w-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                  <div>
                    <div
                      onClick={() => handleCoinClick(coin.symbol)}
                      className="hover:text-blue-500 font-semibold cursor-pointer"
                    >
                      {coin.name}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase">
                      {coin.symbol}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-sm ${
                    coin.price_change_percentage_24h > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">
                  ${coin.current_price.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  24h Low: ${coin.low_24h.toFixed(2)}
                  <br />
                  24h High: ${coin.high_24h.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
