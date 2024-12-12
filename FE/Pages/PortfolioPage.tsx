import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import Modal from "../components/Modal";

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
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [selectedCoinId, setSelectedCoinId] = useState("");
  const [selectedCoinHoldings, setSelectedCoinHoldings] = useState(0);
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.userid);

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
        console.log(portfolio?.assetMoney);
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [userId]);

  const handleDeposit = async () => {
    try {
      await axios.post(
        `http://localhost:5101/api/Transactions/${userId}/Deposit?amount=${amount}
`
      );
      setIsDepositModalOpen(false);
    } catch (error) {
      console.error("Error during deposit:", error);
    }
  };
  const handleWithdrawClick = async () => {
    setIsWithdrawModalOpen(true);
    setAmount(0);
  };
  const handleWithdraw = async (coinId: string) => {
    try {
      await axios.post(
        `http://localhost:5101/api/Transactions/${userId}/Withdraw?amount=${amount}&coinid=${coinId}`
      );
      setIsWithdrawModalOpen(false);
    } catch (error) {
      console.error("Error during withdrawal:", error);
    }
  };

  const handleBuy = async () => {
    const data = {
      UserId: userId,
      trxType: 0,
      buySource: "USD",
      coinId: selectedCoinId,
      quantity: amount,
      notes: "Buy",
      CreateAt: new Date().toISOString(),
    };
    try {
      await axios.post(`http://localhost:5101/api/Transactions/addTrx`, data);
      setIsBuyModalOpen(false);
    } catch (error) {
      console.error("Error during buy:", error);
    }
  };

  const handleSell = async () => {
    if (amount > selectedCoinHoldings) {
      alert("Sell amount cannot exceed holdings.");
      return;
    }
    const data = {
      UserId: userId,
      trxType: 1,
      buySource: "USD",
      coinId: selectedCoinId,
      quantity: amount,
      notes: "Sell",
      CreateAt: new Date().toISOString(),
    };
    console.log("selectedCoinId: ", selectedCoinId);
    try {
      await axios.post(`http://localhost:5101/api/Transactions/addTrx`, data);
      setIsSellModalOpen(false);
    } catch (error) {
      console.error("Error during sell:", error);
    }
  };

  if (isLoading || !portfolio) {
    return <div>Loading...</div>;
  }

  const handleCoinClick = (coinName: string) => {
    navigate(`/coin/${coinName.toLowerCase()}`);
  };

  const changeinpercent = (
    (1 + portfolio.changeTotal / portfolio.assetMoney) *
    100
  ).toFixed(2);
  //current value = sum of quanity *current value of each asset
  const currentvalue = portfolio.assets.reduce(
    (sum, asset) => sum + asset.totalQuantity * asset.currentValue,
    0
  );
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
        <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-4 border">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Total Investment</div>
              <div className="text-xl font-bold">
                $
                {portfolio.assetMoney.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Current Value</div>
              <div className="text-xl font-bold">
                $
                {currentvalue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Change in USD</div>
              <div
                className={`text-xl font-bold ${
                  portfolio.changeTotal >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {portfolio.changeTotal >= 0 ? "+" : ""}
                {portfolio.changeTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Change in percent</div>
              <div
                className={`text-xl font-bold ${
                  parseFloat(changeinpercent) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {parseFloat(changeinpercent) >= 0 ? "+" : ""}
                {changeinpercent}%
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Coins Held</div>
              <div className="text-xl font-bold">
                {portfolio.numberofTokenHold}
              </div>
            </div>
            <div className="p-4 border flex space-x-4 rounded-lg">
              <div>
                <button
                  onClick={() => setIsDepositModalOpen(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Deposit
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleWithdrawClick()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg border ">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                >
                  {pieChartData.map((_, index) => (
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
                <Legend
                  iconType="circle"
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <span
                      style={{
                        color:
                          COLORS[
                            pieChartData.findIndex(
                              (item) => item.name === value
                            ) % COLORS.length
                          ],
                      }}
                    >
                      {value}
                    </span>
                  )}
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
              <th className="text-right p-4 font-medium">Change (USD)</th>
              <th className="text-right p-4 font-medium">Change (%)</th>
              <th className="text-right p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.assets.map((asset) => {
              const changeInUSD =
                (asset.currentValue - asset.averagePrice) * asset.totalQuantity;
              const changeInPercent =
                ((asset.currentValue - asset.averagePrice) /
                  asset.averagePrice) *
                100;

              return (
                <tr
                  key={asset.coinName}
                  className="border-b last:border-0 hover:bg-gray-50 "
                >
                  <td className="p-4">
                    <div
                      onClick={() => handleCoinClick(asset.coinName)}
                      className="font-medium"
                    >
                      {asset.coinName}
                    </div>
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
                      changeInUSD >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {changeInUSD >= 0 ? "+" : ""}$
                    {changeInUSD.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className={`text-right p-4 ${
                      changeInPercent >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {changeInPercent >= 0 ? "+" : ""}
                    {changeInPercent.toFixed(2)}%
                  </td>
                  <td className="text-right p-4">
                    <button
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        setSelectedCoinHoldings(asset.totalQuantity);
                        setAmount(0);
                        setIsSellModalOpen(true);
                        setSelectedCoinId(asset.coinName);
                      }}
                    >
                      Sell
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCoinId(asset.coinName);
                        setAmount(0);
                        setIsBuyModalOpen(true);
                      }}
                      className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Deposit Modal */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title="Deposit"
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount in USD"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleDeposit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Confirm Deposit
        </button>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdraw"
      >
        <select
          onChange={(e) => setSelectedCoinId(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">Select Coin</option>
          {portfolio.assets.map((asset) => (
            <option key={asset.coinName} value={asset.coinName}>
              {asset.coinName}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
          className="border p-2 rounded w-full"
        />
        <button
          disabled={
            amount <= 0 ||
            (portfolio.assets.find((asset) => asset.coinName === selectedCoinId)
              ?.totalQuantity || 0) < amount
          } // Disable if invalid
          onClick={() => handleWithdraw(selectedCoinId)}
          className={`mt-4 text-white px-4 py-2 rounded ${
            amount <= 0 ||
            (portfolio.assets.find((asset) => asset.coinName === selectedCoinId)
              ?.totalQuantity || 0) < amount
              ? "bg-gray-500" // Gray background when disabled
              : "bg-orange-500" // Original color when enabled
          }`}
        >
          Confirm Withdraw
        </button>
      </Modal>

      {/* Buy Modal */}
      <Modal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        title="Buy"
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
          className="border p-2 rounded w-full"
        />
        <button
          disabled={amount <= 0}
          onClick={handleBuy}
          className={`mt-4 text-white px-4 py-2 rounded ${
            amount <= 0
              ? "bg-gray-500" // Gray background when disabled
              : "bg-green-500" // Original color when enabled
          }`}
        >
          Confirm Buy
        </button>
      </Modal>

      {/* Sell Modal */}
      <Modal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        title="Sell"
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
          className="border p-2 rounded w-full"
        />
        <button
          disabled={amount <= 0 || amount > selectedCoinHoldings}
          onClick={handleSell}
          className={`mt-4 text-white px-4 py-2 rounded ${
            amount <= 0 || selectedCoinHoldings < amount
              ? "bg-gray-500" // Gray background when disabled
              : "bg-orange-500" // Original color when enabled
          }`}
        >
          Confirm Sell
        </button>
      </Modal>
    </div>
  );
}
