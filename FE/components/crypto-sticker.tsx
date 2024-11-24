import { LineChart } from "lucide-react";
import { Card, CardContent } from "@mui/material";
import React from "react";

const cryptoData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: "$35,447.34",
    change: "+2.5%",
    color: "orange",
  },
  {
    name: "Binance",
    symbol: "BNB",
    price: "$35,447.34",
    change: "-1.2%",
    color: "yellow",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$35,447.34",
    change: "+3.1%",
    color: "blue",
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: "$35,447.34",
    change: "+0.8%",
    color: "blue",
  },
];

export function CryptoTicker() {
  return (
    <section className="container py-12">
      <h2 className="text-2xl font-bold text-center mb-8">
        Get Various Crypto Coin
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cryptoData.map((crypto) => (
          <Card key={crypto.symbol} className="bg-card/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full bg-${crypto.color}-500/20`}
                    />
                    <div>
                      <div className="font-semibold">{crypto.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {crypto.symbol}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`text-sm ${
                    crypto.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {crypto.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{crypto.price}</div>
                <LineChart className="w-full h-12 text-blue-500 mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
