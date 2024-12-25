import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import baseurl from "../baseurl";
import { RootState } from "../store/store";
interface Coin {
  id: string;
  coinId: string;
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
export default function Coins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.user.userid);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await baseurl.get<Coin[]>("/api/Coins/getCoins");
        setCoins(response.data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);
  const handleUpdate = async () => {
    setUpdateMessage("Updating...");
    try {
      await baseurl.put("api/Coins/updateCoins");
      const response = await baseurl.get<Coin[]>("api/Coins/getCoins");
      setCoins(response.data);
      const currentTime = new Date().toLocaleTimeString();
      setUpdateMessage(`Updated at ${currentTime}`);
    } catch (error) {
      console.error("Error updating coins:", error);
      setUpdateMessage("Error updating coins.");
    }
  };
  const handleSort = () => {
    const sortedCoins = [...coins].sort((a, b) => {
      const dateA = new Date(a.updateAt);
      const dateB = new Date(b.updateAt);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
    setCoins(sortedCoins);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {userId ? (
        <>
          <div className="p-5">
            <h2 className="text-2xl font-bold mb-5">
              {userId ? `${userId}` : "Coins"}
            </h2>
            <button
              onClick={handleSort}
              className="mb-4 p-2 bg-blue-500 text-white rounded"
            >
              Sort by Update Time (
              {sortOrder === "asc" ? "Ascending" : "Descending"})
            </button>
            <button
              onClick={handleUpdate}
              className="m-4 p-2 bg-blue-500 text-white rounded"
            >
              Update Coin
            </button>
            {updateMessage && (
              <div className="mt-4 text-green-600">{updateMessage}</div>
            )}
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Coin</th>
                  <th className="border px-4 py-2">Symbol</th>
                  <th className="border px-4 py-2">Current Price</th>
                  <th className="border px-4 py-2">Market Cap</th>
                  <th className="border px-4 py-2">24h High</th>
                  <th className="border px-4 py-2">24h Low</th>
                  <th className="border px-4 py-2">Update At</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin) => (
                  <tr key={coin.id}>
                    <td className="border px-4 py-2">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="inline-block w-6 h-6 mr-2"
                      />
                      {coin.name}
                    </td>
                    <td className="border px-4 py-2">{coin.symbol}</td>
                    <td className="border px-4 py-2">
                      ${coin.current_price.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      ${coin.market_cap.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">
                      ${coin.high_24h.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      ${coin.low_24h.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(coin.updateAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <h1> Login required</h1>
        </>
      )}
    </>
  );
}
