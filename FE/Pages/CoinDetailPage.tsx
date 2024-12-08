import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  atl: number;
  updateAt: string;
}

interface ChartData {
  date: string;
  price: number;
}

type ChartPeriod = 30 | 90 | 180 | 365;

export default function CoinDetailPage() {
  const { coinId } = useParams();
  const [coinInfo, setCoinInfo] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoadingCoin, setIsLoadingCoin] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(365);
  const userId = useSelector((state: RootState) => state.user.userid);
  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoadingChart(true);
      try {
        const response = await axios.get(
          `http://localhost:5101/api/Coins/getChartData/${coinId}?period=${selectedPeriod}`
        );
        const formattedData = response.data.prices.map(
          (item: [number, number]) => ({
            date: new Date(item[0]),
            price: item[1],
          })
        );
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoadingChart(false);
      }
    };

    const fetchData = async () => {
      setIsLoadingCoin(true);
      try {
        const response = await axios.get(
          `http://localhost:5101/api/Coins/GetCoinByName/${coinId}`
        );
        setCoinInfo(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingCoin(false);
      }
    };

    fetchData();
    fetchChartData();
  }, [coinId, selectedPeriod]);

  useEffect(() => {
    const checkWatchlistStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5101/api/FavList/${userId}`
        );
        const favoriteList = response.data;
        const isInList = favoriteList.some(
          (coin: { coinId: string }) => coin.coinId === coinId
        );
        if (isInList) {
          console.log(" co trong list");
        } else console.log("k co trong list");
        setIsInWatchlist(isInList);
      } catch (error) {
        console.error("Error checking watchlist status:", error);
      }
    };

    checkWatchlistStatus();
  }, [coinId, userId]);

  const handleWatchlistToggle = async () => {
    if (isInWatchlist) return;

    try {
      const response = await axios.post(
        `http://localhost:5101/api/FavList/${userId}/Add/${coinId}`
      );

      if (response.status === 200) {
        setIsInWatchlist(true);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        // If coin is already in watchlist
        setIsInWatchlist(true);
      } else {
        console.error("Error updating watchlist:", error);
      }
    }
  };

  if (isLoadingCoin || !coinInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto py-4 px-4">
        <div className="bg-white rounded-lg shadow-lg mb-4">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {/* Left Side */}
              <div className="py-4">
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={coinInfo.image}
                    alt={coinInfo.name}
                    className="w-10 h-10"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-black">
                      {coinInfo.name}
                    </h1>
                    <span className="text-lg text-gray-500">
                      {coinInfo.symbol.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-black mb-2">
                  ${coinInfo.current_price.toLocaleString()}
                </div>

                <div
                  className={`text-lg font-semibold mb-3 ${
                    coinInfo.price_change_percentage_24h > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coinInfo.price_change_percentage_24h > 0 ? "+" : ""}
                  {coinInfo.price_change_percentage_24h.toFixed(2)}% (
                  {coinInfo.price_change_24h})
                </div>

                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center gap-1 px-4 py-1.5 border-2 rounded-md mb-2 transition-colors w-1/2 ${
                    isInWatchlist
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  disabled={isInWatchlist}
                >
                  <Star className="w-4 h-4" />
                  {isInWatchlist ? "Watchlisted" : "Add to Watchlist"}
                </button>

                <button className="flex items-center gap-1 px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-1/2">
                  <TrendingUp className="w-4 h-4" />
                  Trade {coinInfo.symbol.toUpperCase()}
                </button>
              </div>

              {/* Right Side */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-gray-500 text-sm">Market Cap</div>
                  <div className="text-lg font-semibold text-black">
                    ${coinInfo.market_cap.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">24h Volume</div>
                  <div className="text-lg font-semibold text-black">
                    ${coinInfo.total_volume.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">24h High</div>
                  <div className="text-lg font-semibold text-black">
                    ${coinInfo.high_24h.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">24h Low</div>
                  <div className="text-lg font-semibold text-black">
                    ${coinInfo.low_24h.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Price Change 24h</div>
                  <div
                    className={`text-lg font-semibold ${
                      coinInfo.price_change_24h > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    ${coinInfo.price_change_24h.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">
                    Circulating Supply
                  </div>
                  <div className="text-lg font-semibold text-black">
                    {coinInfo.circulating_supply.toLocaleString()}{" "}
                    {coinInfo.symbol.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Total Supply</div>
                  <div className="text-lg font-semibold text-black">
                    {coinInfo.total_supply.toLocaleString()}{" "}
                    {coinInfo.symbol.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Max Supply</div>
                  <div className="text-lg font-semibold text-black">
                    {coinInfo.max_supply.toLocaleString()}{" "}
                    {coinInfo.symbol.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">All Time High</div>
                  <div className="text-lg font-semibold text-black">
                    ${coinInfo.ath.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">All Time Low</div>
                  <div className="text-lg font-semibold text-black">
                    ${coinInfo.atl.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Last Updated</div>
                  <div className="text-sm text-black">
                    {new Date(coinInfo.updateAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-bold text-black mb-3">Price Chart</h2>
            <div className="flex justify-end gap-2 mb-4">
              {[30, 90, 180, 365].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as ChartPeriod)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedPeriod === period
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {period === 30
                    ? "1M"
                    : period === 90
                    ? "3M"
                    : period === 180
                    ? "6M"
                    : "1Y"}
                </button>
              ))}
            </div>
            {isLoadingChart ? (
              <div className="h-[400px] w-[90%] mx-auto flex items-center justify-center">
                <div>Loading chart data...</div>
              </div>
            ) : (
              <div className="h-[400px] w-[90%] mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 30,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return `${(d.getMonth() + 1)
                          .toString()
                          .padStart(2, "0")}/${d
                          .getFullYear()
                          .toString()
                          .slice(-2)}`;
                      }}
                      tick={{ fill: "black" }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tick={{ fill: "black" }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "#ddd",
                      }}
                      formatter={(value: number) => [
                        `$${value.toLocaleString()}`,
                        "Price",
                      ]}
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
