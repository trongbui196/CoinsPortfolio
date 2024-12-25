import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import baseurl from "../baseurl";
interface Transaction {
  id: string;
  userId: string;
  trxType: string;
  buySource: string;
  coinId: string;
  coinPrice: number;
  quantity: number;
  notes: string;
  createAt: string;
}

export default function Transaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUserId, setSearchUserId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 20;
  const userId = useSelector((state: RootState) => state.user.userid);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await baseurl.get<Transaction[]>(
          "api/Transactions/getAllTrx4Admin"
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.userId.toLowerCase().includes(searchUserId.toLowerCase())
  );

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {userId ? (
        <>
          <div className="p-5">
            <h2 className="text-2xl font-bold mb-5">
              Total Transactions: {filteredTransactions.length}
            </h2>
            <input
              type="text"
              placeholder="Search by User ID"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              className="border p-2 mb-4 w-fit"
            />
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 table-auto">
                <thead>
                  <tr>
                    <th className="border truncate">Transaction ID</th>
                    <th className="border truncate">User ID</th>
                    <th className="border truncate">Trx Type</th>
                    <th className="border truncate">Buy Source</th>
                    <th className="border truncate">Coin ID</th>
                    <th className="border truncate px-4 py-2">Coin Price</th>
                    <th className="border truncate px-4 py-2">Quantity</th>
                    <th className="border truncate px-4 py-2">Notes</th>
                    <th className="border truncate px-4 py-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="border truncate px-4 py-2">
                        {transaction.id}
                      </td>
                      <td className="border truncate px-4 py-2">
                        {transaction.userId}
                      </td>
                      <td className="border truncate px-4 py-2">
                        {transaction.trxType}
                      </td>
                      <td className="border truncate px-4 py-2">
                        {transaction.buySource}
                      </td>
                      <td className="border truncate px-4 py-2">
                        {transaction.coinId}
                      </td>
                      <td className="border truncate px-4 py-2">
                        ${transaction.coinPrice.toFixed(2)}
                      </td>
                      <td className="border truncate px-4 py-2">
                        {transaction.quantity}
                      </td>
                      <td className="border truncate px-4 py-2">
                        {transaction.notes}
                      </td>
                      <td className="border truncate px-4 py-2">
                        {new Date(transaction.createAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
          </div>
        </>
      ) : (
        <>Login required</>
      )}
    </>
  );
}
