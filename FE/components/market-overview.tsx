import { Card, CardContent } from "@mui/material";
import { LineChart } from "lucide-react";

const marketData = [
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$38,40.54",
    change: "+0.12%",
    icon: "🌐",
  },
  {
    name: "Binance",
    symbol: "BNB",
    price: "$38,40.54",
    change: "+0.12%",
    icon: "🌐",
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    price: "$38,40.54",
    change: "+0.12%",
    icon: "🌐",
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    price: "$38,40.54",
    change: "+0.12%",
    icon: "🌐",
  },
];

export function MarketOverview() {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Cryptocurrency Prices by Market Cap
        </h1>
        <div className="flex gap-2">
          <select className="bg-background border rounded-md px-2 py-1 text-sm">
            <option>Filter</option>
          </select>
          <select className="bg-background border rounded-md px-2 py-1 text-sm">
            <option>Today</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketData.map((coin) => (
          <Card key={coin.symbol} className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{coin.icon}</span>
                  <div>
                    <div className="font-semibold">{coin.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {coin.symbol}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-green-500">{coin.change}</div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{coin.price}</div>
                <div className="h-[50px] mt-2">
                  <LineChart className="w-full h-full text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
