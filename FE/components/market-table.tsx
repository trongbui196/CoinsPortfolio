import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios";

interface Coin {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  low_24h: number;
  high_24h: number;
}

export function MarketTable() {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(20);
  const [marketData, setMarketData] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMarketData = async (count: number) => {
    setIsLoading(true);
    try {
      const endpoint =
        count === 20
          ? "http://localhost:5101/api/Coins/get20Coin"
          : "http://localhost:5101/api/Coins/getCoins";

      const response = await axios.get<Coin[]>(endpoint);
      setMarketData(response.data);
    } catch (error) {
      console.error("Failed to fetch market data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(displayCount);
  }, [displayCount]);

  const handleDisplayCountChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCount = parseInt(event.target.value.replace("Show ", ""));
    setDisplayCount(newCount);
    fetchMarketData(newCount);
  };

  const handleCoinClick = (coinId: string) => {
    navigate(`/coin/${coinId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden px-8">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Coin Name"
              className="pl-10 pr-4 py-2 border border-gray-800 rounded-md bg-white text-black"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="bg-white text-black border border-gray-800 rounded-md px-2 py-1 text-sm"
              value={`Show ${displayCount}`}
              onChange={handleDisplayCountChange}
            >
              <option className="bg-white text-black">Show 20</option>
              <option className="text-black">Show 100</option>
            </select>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="p-4 text-center text-black">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full rounded-md">
            <thead>
              <tr className="bg-orange-400 rounded-md">
                <th className="text-left px-12 py-4 font-medium text-black">
                  Name
                </th>
                <th className="text-right p-4 font-medium text-black">Price</th>
                <th className="text-right p-4 font-medium text-black">
                  24h Low
                </th>
                <th className="text-right p-4 font-medium text-black">
                  24h High
                </th>
                <th className="text-right p-4 font-medium text-black">
                  24h Change
                </th>
                <th className="text-center p-4 font-medium text-black">
                  Chart
                </th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((coin) => (
                <tr
                  key={coin.id}
                  className="border-b border-gray-300 hover:bg-orange-200"
                >
                  <td className="p-4">
                    <button
                      className="flex items-center gap-3 hover:text-blue-500"
                      onClick={() => handleCoinClick(coin.coinId)}
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-12 h-12"
                      />
                      <div>
                        <div className="text-lg text-black text-left">
                          {coin.name}
                        </div>
                        <div className="text-sm text-gray-500 text-left uppercase">
                          {coin.coinId}
                        </div>
                      </div>
                    </button>
                  </td>
                  <td className="text-right text-black p-4 font-medium">
                    ${coin.current_price.toFixed(2)}
                  </td>
                  <td className="text-right text-black p-4">
                    ${coin.low_24h.toFixed(2)}
                  </td>
                  <td className="text-right text-black p-4">
                    ${coin.high_24h.toFixed(2)}
                  </td>
                  <td
                    className={`text-right p-4 font-medium ${
                      coin.price_change_percentage_24h > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="text-center p-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      onClick={() => handleCoinClick(coin.coinId)}
                    >
                      Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            1-{displayCount} of {marketData.length} assets
          </div>
          <div className="flex gap-2"></div>
        </div>
      </div>
    </div>
  );
}
