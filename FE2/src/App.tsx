import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Coins from "../Pages/Coins";
import Dashboard from "../Pages/Dashboard";
import Login from "../Pages/Login";
import User from "../Pages/User";
import Transaction from "../Pages/Transaction";
import Navbar from "../Components/Navbar";
export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-200 ">
        <>
          <Navbar />
          <div className="flex-1 p-5 w-4/5 py-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<User />} />
              <Route path="/coins" element={<Coins />} />
              <Route path="/login" element={<Login />} />
              <Route path="/transactions" element={<Transaction />} />
            </Routes>
          </div>
        </>
      </div>
    </Router>
  );
}
