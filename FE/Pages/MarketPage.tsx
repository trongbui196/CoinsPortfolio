import { MarketOverview } from "../components/market-overview";
import { MarketTable } from "../components/market-table";
export default function MarketPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-6">
        <div className="space-y-8">
          <MarketOverview />
          <MarketTable />
        </div>
      </main>
    </div>
  );
}
