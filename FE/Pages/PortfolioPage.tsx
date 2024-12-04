import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Asset {
  coinName: string;
  totalQuantity: number;
  averagePrice: number;
  currentValue: number;
  change: number;
}

interface Portfolio {
  userId: string;
  numberofTokenHold: number;
  assets: Asset[];
  assetMoney: number;
  changeTotal: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userId = "6742b8321475d1cb45a231ec";

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5101/api/Porfolio/getPortfolio?userid=${userId}`
        );
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (isLoading || !portfolio) {
    return <div>Loading...</div>;
  }

  const handleCoinClick = (coinName: string) => {
    navigate(`/coin/${coinName.toLowerCase()}`);
  };

  // Calculate total investment (quantity * average price for each asset)
  const totalInvestment = portfolio.assets.reduce(
    (sum, asset) => sum + asset.totalQuantity * asset.averagePrice,
    0
  );

  // Calculate change in dollars
  const changeInDollars = portfolio.assetMoney - totalInvestment;

  // Prepare data for pie chart
  const pieChartData = portfolio.assets.map((asset) => ({
    name: asset.coinName,
    value: asset.totalQuantity * asset.currentValue,
  }));

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Panel */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Total Investment</div>
              <div className="text-xl font-bold">
                $
                {totalInvestment.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Current Value</div>
              <div className="text-xl font-bold">
                $
                {portfolio.assetMoney.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Change ($)</div>
              <div
                className={`text-xl font-bold ${
                  changeInDollars >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {changeInDollars >= 0 ? "+" : ""}
                {changeInDollars.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Change (%)</div>
              <div
                className={`text-xl font-bold ${
                  portfolio.changeTotal >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {portfolio.changeTotal >= 0 ? "+" : ""}
                {portfolio.changeTotal}%
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Coins Held</div>
              <div className="text-xl font-bold">
                {portfolio.numberofTokenHold}
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `$${value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <h3 className="text-xl font-semibold mb-4">Coin Allocation</h3>
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Asset</th>
              <th className="text-right p-4 font-medium">Holdings</th>
              <th className="text-right p-4 font-medium">Avg Price</th>
              <th className="text-right p-4 font-medium">Current Price</th>
              <th className="text-right p-4 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.assets.map((asset) => (
              <tr
                key={asset.coinName}
                className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCoinClick(asset.coinName)}
              >
                <td className="p-4">
                  <div className="font-medium">{asset.coinName}</div>
                </td>
                <td className="text-right p-4">
                  {asset.totalQuantity.toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                  })}
                </td>
                <td className="text-right p-4">
                  $
                  {asset.averagePrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="text-right p-4">
                  $
                  {asset.currentValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td
                  className={`text-right p-4 ${
                    asset.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {asset.change >= 0 ? "+" : ""}
                  {asset.change}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
