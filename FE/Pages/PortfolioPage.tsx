import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Grid as GridIcon, EyeOff } from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

export default function PortfolioPage() {
  const portfolioData = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      holdings: "0.10565",
      price: "$43,318.64",
      avgBuy: "$38,235.25",
      assetsValue: "$10,12.64",
      profitLoss: "+$43,318.64",
      profitLossPercent: "+1.24%",
    },
    {
      name: "XRP",
      symbol: "XRP",
      holdings: "150",
      price: "$0.00917",
      avgBuy: "$0.00773",
      assetsValue: "$10,12.64",
      profitLoss: "+$120.00",
      profitLossPercent: "+2.66%",
    },
  ];

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">Portfolio</h1>
              <p className="text-sm text-muted-foreground">
                Updated: {new Date().toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <IconButton size="small">
                <EditIcon style={{ width: 16, height: 16 }} />
              </IconButton>
              <Button variant="contained" startIcon={<AddIcon />}>
                Create New Portfolio
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-muted-foreground">
                    Available Balance
                  </div>
                  <IconButton size="small">
                    <EyeOff style={{ width: 16, height: 16 }} />
                  </IconButton>
                </div>
                <div className="text-2xl font-bold mt-2">$32,455.12</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  Total Investment
                </div>
                <div className="text-2xl font-bold mt-2">$30,455.12</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  Total Return
                </div>
                <div className="text-2xl font-bold mt-2">$32,455.12</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  All Time Profit/Loss
                </div>
                <div className="text-2xl font-bold text-green-500 mt-2">
                  +$2,000.12 (2%)
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Coin Allocation
          </Typography>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <IconButton size="small">
                <GridIcon style={{ width: 16, height: 16 }} />
              </IconButton>
              <select className="bg-background border rounded-md px-2 py-1 text-sm">
                <option>Month</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Pair / Holdings</th>
                  <th className="text-right p-4 font-medium">
                    Price / Avg Buy
                  </th>
                  <th className="text-right p-4 font-medium">
                    Holdings Assets
                  </th>
                  <th className="text-right p-4 font-medium">
                    Total Asset Value
                  </th>
                  <th className="text-right p-4 font-medium">Profit / Loss</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.map((coin) => (
                  <tr key={coin.symbol} className="border-b last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          🌐
                        </div>
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {coin.holdings} {coin.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right p-4">
                      <div className="font-medium">{coin.price}</div>
                      <div className="text-sm text-muted-foreground">
                        {coin.avgBuy}
                      </div>
                    </td>
                    <td className="text-right p-4">{coin.assetsValue}</td>
                    <td className="text-right p-4">{coin.assetsValue}</td>
                    <td className="text-right p-4">
                      <div className="text-green-500">{coin.profitLoss}</div>
                      <div className="text-sm text-green-500">
                        {coin.profitLossPercent}
                      </div>
                    </td>
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
