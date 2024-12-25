// src/pages/Dashboard.js
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
const Dashboard = () => {
  const watchlistActivityData = [
    { index: 0, name: "Bitcoin", value: 400 },
    { index: 1, name: "Ethereum", value: 300 },
    { index: 2, name: "Dogecoin", value: 200 },
  ];

  const transactionsData = [
    { name: "Sep", value: 900 },
    { name: "Oct", value: 1400 },
    { name: "Nov", value: 1200 },
    { name: "Dec", value: 1000 },
  ];

  const topCoinsTradedData = [
    { name: "BTC", value: 5000 },
    { name: "ETH", value: 3000 },
    { name: "USDT", value: 4000 },
    { name: "Doge", value: 3500 },
  ];

  const topPerformingCoinsData = [
    { name: "Bitcoin", value: 80 },
    { name: "Ethereum", value: 60 },
  ];

  const newUserList = [
    { id: 1, name: "User A", date: "2023-09-01" },
    { id: 2, name: "User B", date: "2023-09-02" },
    { id: 3, name: "User C", date: "2023-09-03" },
    { id: 4, name: "User D", date: "2023-09-03" },
    { id: 5, name: "User E", date: "2023-09-03" },
    { id: 7, name: "User F", date: "2023-09-03" },
    { id: 6, name: "User G", date: "2023-09-03" },
    { id: 8, name: "User G", date: "2023-09-03" },
    { id: 9, name: "User G", date: "2023-09-03" },
  ];

  // Mock data for user activity over the last 30 days
  const userActivityData = [
    { date: "2023-09-01", users: 50 },
    { date: "2023-09-02", users: 60 },
    { date: "2023-09-03", users: 70 },
    { date: "2023-09-04", users: 80 },
    { date: "2023-09-05", users: 75 },
    { date: "2023-09-06", users: 85 },
    { date: "2023-09-07", users: 100 },
    { date: "2023-09-08", users: 90 },
    { date: "2023-09-09", users: 110 },
    { date: "2023-09-10", users: 105 },
    { date: "2023-09-11", users: 130 },
    { date: "2023-09-12", users: 125 },
    { date: "2023-09-13", users: 150 },
    { date: "2023-09-14", users: 145 },
    { date: "2023-09-15", users: 170 },
    { date: "2023-09-16", users: 160 },
    { date: "2023-09-17", users: 180 },
    { date: "2023-09-18", users: 200 },
    { date: "2023-09-19", users: 195 },
    { date: "2023-09-20", users: 220 },
    { date: "2023-09-21", users: 210 },
    { date: "2023-09-22", users: 230 },
    { date: "2023-09-23", users: 240 },
    { date: "2023-09-24", users: 235 },
    { date: "2023-09-25", users: 250 },
    { date: "2023-09-26", users: 160 },
    { date: "2023-09-27", users: 200 },
    { date: "2023-09-28", users: 280 },
    { date: "2023-09-29", users: 180 },
    { date: "2023-09-30", users: 250 },
  ];

  // State to manage the filter
  const [filter, setFilter] = useState("7days");

  // Filter data based on the selected filter
  const filteredData = () => {
    const pastDays = filter === "7days" ? 7 : 30;
    return userActivityData.slice(-pastDays);
  };
  const userId = useSelector((state: RootState) => state.user.userid);
  return (
    <>
      {userId ? (
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-5">
            {userId ? `Hello ${userId}` : "Dashboard"}
          </h2>
          {/* Card Divs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">
                {newUserList.length + 1000}
              </p>{" "}
              {/* Mock total users */}
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Average User Profit</h3>
              <p className="text-2xl font-bold">$1500</p>{" "}
              {/* Mock average profit */}
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Number of Coins</h3>
              <p className="text-2xl font-bold">50</p>{" "}
              {/* Mock number of coins */}
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Last Coin Update Time</h3>
              <p className="text-2xl font-bold">2023-09-30 19:30:21</p>{" "}
              {/* Mock last update time */}
            </div>
          </div>

          {/* User Activity Chart */}
          <div className="bg-white p-5 rounded-lg shadow mb-5">
            <h3 className="text-xl font-semibold">User Activity</h3>
            <button
              className="border p-2 rounded-md m-2"
              onClick={() => setFilter("30days")}
            >
              30 days
            </button>
            <button
              className="border p-2 rounded-md m-2"
              onClick={() => setFilter("7days")}
            >
              7 days
            </button>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData()}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Row 2: User Activity and New User List */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className=" col-span-2 gap-4 ">
              <div className="bg-white p-5 rounded-lg shadow">
                <h3 className="text-xl font-semibold">Watchlist Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={watchlistActivityData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {watchlistActivityData.map((index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index.index === 0
                              ? "#A888B5"
                              : index.index === 1
                              ? "#EFB6C8"
                              : "#8174A0"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-semibold">New User List</h3>
              <table className="text-center mx-auto  w-4/5 mt-4">
                <tr className="border-b-2 ">
                  <th className="border-r-2">Name</th>
                  <th>Create Date</th>
                </tr>

                {newUserList.map((user) => (
                  <tr>
                    <td className="border-r-2" key={user.id}>
                      {user.name}
                    </td>
                    <td>{user.date}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>

          {/* Row 3: Remaining Charts */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Number of Transactions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="value" fill="#34d399" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Top Coins Traded</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCoinsTradedData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="value" fill="#fbbf24" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Top Performing Coins</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPerformingCoinsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="value" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        "required Login"
      )}
    </>
  );
};

export default Dashboard;
