export function OrderBook() {
  const asks = [
    { price: 43980.5, amount: 0.2899, total: 12750.15 },
    { price: 43975.7, amount: 0.15, total: 6596.36 },
    { price: 43970.2, amount: 0.325, total: 14290.32 },
  ];

  const bids = [
    { price: 43965.8, amount: 0.42, total: 18465.64 },
    { price: 43960.3, amount: 0.18, total: 7912.85 },
    { price: 43955.5, amount: 0.25, total: 10988.88 },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium text-red-500">Asks</div>
        <div className="space-y-1">
          {asks.map((ask, i) => (
            <div key={i} className="grid grid-cols-3 text-sm">
              <div className="text-red-500">{ask.price}</div>
              <div className="text-right">{ask.amount}</div>
              <div className="text-right">{ask.total}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-2xl font-bold text-center">43,975.72</div>
      <div className="space-y-2">
        <div className="text-sm font-medium text-green-500">Bids</div>
        <div className="space-y-1">
          {bids.map((bid, i) => (
            <div key={i} className="grid grid-cols-3 text-sm">
              <div className="text-green-500">{bid.price}</div>
              <div className="text-right">{bid.amount}</div>
              <div className="text-right">{bid.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function TradeHistory() {
  const trades = [
    {
      time: "15:30:45",
      type: "buy",
      price: 43975.72,
      amount: 0.1542,
      total: 6780.85,
    },
    {
      time: "15:30:42",
      type: "sell",
      price: 43970.5,
      amount: 0.0858,
      total: 3772.87,
    },
    {
      time: "15:30:39",
      type: "buy",
      price: 43968.3,
      amount: 0.2,
      total: 8793.66,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 font-medium">Time</th>
            <th className="text-right p-2 font-medium">Type</th>
            <th className="text-right p-2 font-medium">Price</th>
            <th className="text-right p-2 font-medium">Amount</th>
            <th className="text-right p-2 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="p-2 text-sm">{trade.time}</td>
              <td
                className={`p-2 text-sm text-right ${
                  trade.type === "buy" ? "text-green-500" : "text-red-500"
                }`}
              >
                {trade.type.toUpperCase()}
              </td>
              <td className="p-2 text-sm text-right">{trade.price}</td>
              <td className="p-2 text-sm text-right">{trade.amount}</td>
              <td className="p-2 text-sm text-right">{trade.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useState } from "react";
import {
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@mui/material";

export function TradingInterface({ symbol }: { symbol: string }) {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  return (
    <Tabs defaultValue="buy" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="buy">Buy</TabsTrigger>
        <TabsTrigger value="sell">Sell</TabsTrigger>
      </TabsList>
      <TabsContent value="buy">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <Input type="number" placeholder="0.00" value={price} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input type="number" placeholder="0.00" value={amount} />
          </div>
          <Button className="w-full">Buy {symbol}</Button>
        </div>
      </TabsContent>
      <TabsContent value="sell">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <Input type="number" placeholder="0.00" value={price} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input type="number" placeholder="0.00" value={amount} />
          </div>
          <Button className="w-full" variant="destructive">
            Sell {symbol}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
