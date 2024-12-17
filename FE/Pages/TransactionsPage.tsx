import { useEffect, useState } from "react";
import baseurl from "../baseurl";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Transaction {
  transactionId: string;
  trxType: string;
  buySource: string;
  coinName: string;
  coinPrice: number;
  quantity: number;
  totalAmount: number;
  notes: string;
  timeExecute: string;
}

export default function TransactionsPage() {
  const userId = useSelector((state: RootState) => state.user.userid);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "coin">("date");
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await baseurl.get(`/api/Transactions/${userId}/Trxs`);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  // Extract unique coin names for the dropdown
  const uniqueCoins = Array.from(
    new Set(transactions.map((transaction) => transaction.coinName))
  );

  // Filter transactions based on selected coin
  const filteredTransactions = selectedCoin
    ? transactions.filter(
        (transaction) => transaction.coinName === selectedCoin
      )
    : transactions;

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.timeExecute).getTime() - new Date(a.timeExecute).getTime()
      );
    } else if (sortBy === "coin") {
      return a.coinName.localeCompare(b.coinName);
    }
    return 0;
  });

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">User Transactions</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mb-4">
            <button
              onClick={() => setSortBy("date")}
              className={`mr-2 ${sortBy === "date" ? "font-bold" : ""}`}
            >
              Sort by Date
            </button>
            <select
              value={selectedCoin}
              onChange={(e) => {
                setSelectedCoin(e.target.value);
                setSortBy("coin");
              }}
              className="ml-2 border p-2"
            >
              <option value="">All Coins</option>
              {uniqueCoins.map((coin) => (
                <option key={coin} value={coin}>
                  {coin}
                </option>
              ))}
            </select>
          </div>

          <table className="w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Coin</th>
                <th className="text-right p-4">Price</th>
                <th className="text-right p-4">Quantity</th>
                <th className="text-right p-4">Total Amount</th>
                <th className="text-left p-4">Notes</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr
                  key={transaction.transactionId}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="p-4">{transaction.trxType}</td>
                  <td className="p-4">{transaction.coinName}</td>
                  <td className="text-right p-4">
                    ${transaction.coinPrice.toFixed(2)}
                  </td>
                  <td className="text-right p-4">{transaction.quantity}</td>
                  <td className="text-right p-4">
                    ${transaction.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4">{transaction.notes}</td>
                  <td className="p-4">
                    {new Date(transaction.timeExecute).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
