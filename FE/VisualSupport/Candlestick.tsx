import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const data = [
  { time: "02-01", price: 43000 },
  { time: "02-02", price: 44500 },
  { time: "02-03", price: 43800 },
  { time: "02-04", price: 45000 },
  { time: "02-05", price: 44200 },
  { time: "02-06", price: 43975 },
];

export function CandlestickChart() {
  return (
    <div className="h-[400px] w-full relative">
      <h1>Candlestick Chart</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          className="text-red-500"
        >
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
