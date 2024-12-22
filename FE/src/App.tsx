import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SiteHeader } from "../components/site-header";
import CoinPage from "../Pages/CoinDetailPage";
import MarketPage from "../Pages/MarketPage";
import LandingPage from "../Pages/LandingPage";
import WListPage from "../Pages/WListPage";
import PortfolioPage from "../Pages/PortfolioPage";
import TransactionPage from "../Pages/TransactionsPage";
import Loginpage from "../Pages/LoginPage";
function App() {
  return (
    <Router>
      <SiteHeader />

      <div className="min-h-screen w-4/5 bg-background  mx-auto">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/coin/:coinId" element={<CoinPage />} />
          <Route path="/watchlist" element={<WListPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/transaction" element={<TransactionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
