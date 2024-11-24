import {
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  Typography,
  Container,
  Grid,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Star } from "lucide-react";
import { useState } from "react";
import { CandlestickChart } from "../VisualSupport/Candlestick";
// Temporary placeholder components (you'll need to create these)

const OrderBook = () => <div>Order Book</div>;
const TradeHistory = () => <div>Trade History</div>;

export default function CoinPage() {
  const [currentTab, setCurrentTab] = useState("price");
  const [timeframe, setTimeframe] = useState("24h");

  // Placeholder for your store functionality
  const isFavorited = false;
  const toggleFavorite = () => console.log("Toggle favorite");

  const marketStats = {
    price: "$43,975.72",
    change24h: "+1.24%",
    marketCap: "$826,445,951,378",
    volume24h: "$22,822,762,169",
    circulatingSupply: "19,958,437.00 BTC",
  };

  return (
    <Container sx={{ py: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    🌐
                  </Box>
                  <Box>
                    <Typography variant="h5">Bitcoin</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      BTC
                    </Typography>
                  </Box>
                  <IconButton onClick={toggleFavorite}>
                    <Star color={isFavorited ? "#ffd700" : undefined} />
                  </IconButton>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="h4">{marketStats.price}</Typography>
                  <Typography
                    variant="body2"
                    color={
                      marketStats.change24h.startsWith("+")
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {marketStats.change24h}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Market Cap
                  </Typography>
                  <Typography variant="body1">
                    {marketStats.marketCap}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Volume (24h)
                  </Typography>
                  <Typography variant="body1">
                    {marketStats.volume24h}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Circulating Supply
                  </Typography>
                  <Typography variant="body1">
                    {marketStats.circulatingSupply}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Tabs
                    value={currentTab}
                    onChange={(_, newValue) => setCurrentTab(newValue)}
                  >
                    <Tab label="Price" value="price" />
                    <Tab label="Market Depth" value="depth" />
                    <Tab label="Trades" value="trades" />
                  </Tabs>
                  <Select
                    size="small"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <MenuItem value="24h">24h</MenuItem>
                    <MenuItem value="7d">7d</MenuItem>
                    <MenuItem value="30d">30d</MenuItem>
                  </Select>
                </Box>
              </Box>

              {currentTab === "price" && <CandlestickChart />}
              {currentTab === "depth" && <div>Market depth chart</div>}
              {currentTab === "trades" && <div>Trade view</div>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Book
              </Typography>
              <OrderBook />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trade History
              </Typography>
              <TradeHistory />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
