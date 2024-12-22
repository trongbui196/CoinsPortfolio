import { useEffect, useState } from "react";
import baseurl from "../baseurl";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
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

export default function WListPage() {
  const navigate = useNavigate();
  const [watchlistData, setWatchlistData] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector((state: RootState) => state.user.userid);
  const accesstoken = useSelector((state: RootState) => state.user.accessToken);
  console.log(userId);
  const handleClick = (coinId: string) => {
    navigate(`/coin/${coinId}`);
  };
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await baseurl.get(`/api/FavList/${userId}`, {
          headers: {
            Authorization: `Bearer ${accesstoken}`, // Add the Authorization header
          },
        });
        setWatchlistData(response.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Watchlist</h1>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Coin Name</th>
              <th className="text-right p-4 font-medium">Price</th>
              <th className="text-right p-4 font-medium">24h</th>
              <th className="text-right p-4 font-medium">24h High</th>
              <th className="text-right p-4 font-medium">24h Low</th>
            </tr>
          </thead>
          <tbody>
            {watchlistData.map((coin) => (
              <tr key={coin.id} className="border-b last:border-0">
                <td className="p-4">
                  <div
                    onClick={() => handleClick(coin.coinId)}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {coin.symbol.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-right p-4 font-medium">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td
                  className={`text-right p-4 ${
                    coin.price_change_percentage_24h > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h > 0 ? "+" : ""}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="text-right p-4">
                  ${coin.high_24h.toLocaleString()}
                </td>
                <td className="text-right p-4">
                  ${coin.low_24h.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
