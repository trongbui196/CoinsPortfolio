import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Star, TrendingUp } from "lucide-react";

export default function CoinDetailPage() {
  const { symbol } = useParams();
  const [coinInfo, setCoinInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5101/api/Coins/GetCoinByName/${symbol}` //btc
        );
        setCoinInfo(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (isLoading || !coinInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Coin Info Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Left Side */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <img
                  src={coinInfo.image}
                  alt={coinInfo.name}
                  style={{ width: 48, height: 48 }}
                />
                <Typography variant="h4">{coinInfo.name}</Typography>
                <Typography variant="h6" color="text.secondary">
                  {coinInfo.symbol.toUpperCase()}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Star />}
                  onClick={() => setIsWatchlisted(!isWatchlisted)}
                >
                  {isWatchlisted ? "Watchlisted" : "Add to Watchlist"}
                </Button>
              </Box>

              <Typography variant="h3" sx={{ mb: 2 }}>
                ${coinInfo.current_price.toLocaleString()}
              </Typography>

              <Typography
                variant="h6"
                color={
                  coinInfo.price_change_percentage_24h > 0 ? "green" : "red"
                }
              >
                {coinInfo.price_change_percentage_24h > 0 ? "+" : ""}
                {coinInfo.price_change_percentage_24h.toFixed(2)}%
              </Typography>
            </Grid>

            {/* Right Side */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Market Cap</Typography>
                  <Typography variant="h6">
                    ${coinInfo.market_cap.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">24h Volume</Typography>
                  <Typography variant="h6">
                    ${coinInfo.total_volume.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">24h High</Typography>
                  <Typography variant="h6">
                    ${coinInfo.high_24h.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">24h Low</Typography>
                  <Typography variant="h6">
                    ${coinInfo.low_24h.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">
                    Circulating Supply
                  </Typography>
                  <Typography variant="h6">
                    {coinInfo.circulating_supply.toLocaleString()}{" "}
                    {coinInfo.symbol.toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Max Supply</Typography>
                  <Typography variant="h6">
                    {coinInfo.max_supply
                      ? coinInfo.max_supply.toLocaleString()
                      : "N/A"}{" "}
                    {coinInfo.symbol.toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<TrendingUp />}
                    sx={{ mt: 2 }}
                  >
                    Trade {coinInfo.symbol.toUpperCase()}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Chart Card - Placeholder */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Price Chart
          </Typography>
          <Box
            sx={{
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Chart Coming Soon
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
