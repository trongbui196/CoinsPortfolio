import {
  Card,
  CardContent,
  Typography, // for CardTitle replacement
  Button,
  TextField, // for Input replacement
} from "@mui/material";
import React from "react";

import { Grid, List } from "lucide-react";

export default function WatchlistPage() {
  const watchlistData = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$43,975.72",
      change: "+0.60%",
      high24h: "$44,727.80",
      low24h: "$43,318.64",
      chart: "📈",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "$2,857.21",
      change: "+0.60%",
      high24h: "$2,900.80",
      low24h: "$2,800.64",
      chart: "📈",
    },
  ];

  return (
    <div className="container py-6">
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Watchlist
          </Typography>
          <p className="text-sm text-muted-foreground">
            Updated: {new Date().toLocaleString()}
          </p>
          <div className="flex justify-between items-center mb-6">
            <Button>Watchlist</Button>
            <div className="flex gap-2">
              <TextField placeholder="Search & Trade" className="w-[300px]" />
              <Button>
                <Grid className="h-4 w-4" />
              </Button>
              <Button>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Coin Name</th>
                  <th className="text-right p-4 font-medium">Price</th>
                  <th className="text-right p-4 font-medium">24h</th>
                  <th className="text-right p-4 font-medium">24h High</th>
                  <th className="text-right p-4 font-medium">24h Low</th>
                  <th className="text-right p-4 font-medium">Chart</th>
                </tr>
              </thead>
              <tbody>
                {watchlistData.map((coin) => (
                  <tr key={coin.symbol} className="border-b last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          🌐
                        </div>
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {coin.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right p-4 font-medium">{coin.price}</td>
                    <td
                      className={`text-right p-4 ${
                        coin.change.startsWith("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.change}
                    </td>
                    <td className="text-right p-4">{coin.high24h}</td>
                    <td className="text-right p-4">{coin.low24h}</td>
                    <td className="text-right p-4">{coin.chart}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
