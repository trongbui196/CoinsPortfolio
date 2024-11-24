import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Star, Search, Grid, List } from "lucide-react";

const marketData = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: "$44,975.72",
    change: "+0.80%",
    high24h: "$44,727.80",
    low24h: "$43,318.84",
    icon: "🌐",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: "$3,187.62",
    change: "-2.79%",
    high24h: "$3,263.16",
    low24h: "$3,077.03",
    icon: "🌐",
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    price: "$392.32",
    change: "+0.60%",
    high24h: "$395.27",
    low24h: "$389.64",
    icon: "🌐",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: "$1.18",
    change: "-0.33%",
    high24h: "$1.21",
    low24h: "$1.17",
    icon: "🌐",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: "$112.13",
    change: "+1.06%",
    high24h: "$116.83",
    low24h: "$110.66",
    icon: "🌐",
  },
];

export function MarketTable() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("top-gainers");

  const handleCoinClick = (symbol: string) => {
    navigate(`/coin/${symbol.toLowerCase()}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "Top Gainers",
            "Top Loser",
            "New in market",
            "Top in trading",
            "Top in Volume",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(/ /g, "-"))}
              className={`px-3 py-1 text-sm rounded-full ${
                activeTab === tab.toLowerCase().replace(/ /g, "-")
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Coin Name"
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm">
              <option>Show 20</option>
            </select>
            <button className="p-1 bg-gray-200 dark:bg-gray-700 rounded-md">
              <Grid className="text-gray-600 dark:text-gray-400" size={18} />
            </button>
            <button className="p-1 bg-gray-200 dark:bg-gray-700 rounded-md">
              <List className="text-gray-600 dark:text-gray-400" size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="text-left p-4 font-medium"></th>
              <th className="text-left p-4 font-medium">Coin Name</th>
              <th className="text-right p-4 font-medium">Price</th>
              <th className="text-right p-4 font-medium">24h Change</th>
              <th className="text-right p-4 font-medium">24h High</th>
              <th className="text-right p-4 font-medium">24h Low</th>
              <th className="text-right p-4 font-medium">Chart</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((coin) => (
              <tr
                key={coin.id}
                className="border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <td className="p-4">
                  <button
                    onClick={() => {}}
                    className="text-gray-400 hover:text-yellow-400"
                  >
                    <Star className={`h-5 w-5 `} />
                  </button>
                </td>
                <td className="p-4">
                  <button
                    className="flex items-center gap-2 hover:text-blue-500"
                    onClick={() => handleCoinClick(coin.symbol)}
                  >
                    <span className="text-2xl">{coin.icon}</span>
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {coin.symbol}
                      </div>
                    </div>
                  </button>
                </td>
                <td className="text-right p-4 font-medium">{coin.price}</td>
                <td
                  className={`text-right p-4 ${
                    coin.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.change}
                </td>
                <td className="text-right p-4">{coin.high24h}</td>
                <td className="text-right p-4">{coin.low24h}</td>
                <td className="text-right p-4">
                  <LineChart className="w-24 h-8 ml-auto text-blue-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            1-20 of 5,383 assets
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
