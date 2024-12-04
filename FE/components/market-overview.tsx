import { Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

interface Coin {
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  low_24h: number;
  high_24h: number;
}

export function MarketOverview() {
  const navigate = useNavigate();
  const [marketData, setMarketData] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Coin[]>(
          "http://localhost:5101/api/Coins/getTop5Gainers"
        );
        setMarketData(response.data);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCoinClick = (symbol: string) => {
    navigate(`/coin/${symbol.toLowerCase()}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-white w-full container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold px-4 py-2 bg-gray-200 text-black rounded-lg">
          Top Gainer Last 24hrs
        </h1>
        <div className="flex gap-2"></div>
      </div>
      <div
        className="grid w-full"
        style={{ gridTemplateColumns: "repeat(5, 1fr)", gridGap: "1rem" }}
      >
        {marketData.map((coin: Coin) => (
          <Card key={coin.symbol} className="w-full bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                  <div>
                    <div
                      onClick={() => handleCoinClick(coin.symbol)}
                      className="hover:text-blue-500 font-semibold cursor-pointer text-black"
                    >
                      {coin.name}
                    </div>
                    <div className="text-sm  uppercase">{coin.symbol}</div>
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
                <div className="flex justify-between gap-4">
                  <div className="text-2xl font-bold text-black">
                    ${coin.current_price.toFixed(2)}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">
                      24h High: ${coin.high_24h.toFixed(2)}
                    </span>
                    <br></br>
                    <span className="font-medium">
                      24h Low: ${coin.low_24h.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
