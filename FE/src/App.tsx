import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SiteHeader } from "../components/site-header";
import CoinPage from "../Pages/CoinDetailPage";
import MarketPage from "../Pages/MarketPage";
import PortfolioPage from "../Pages/PortfolioPage";
//import WatchlistPage from "../Pages/Watchlistpage";
function App() {
  return (
    <Router>
      <SiteHeader />

      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<MarketPage />} />
          <Route path="/coin/:symbol" element={<CoinPage />} />
          {/* <Route path="/watchlist" element={<WatchlistPage />} /> */}
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
