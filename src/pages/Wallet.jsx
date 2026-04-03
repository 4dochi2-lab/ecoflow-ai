import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Zap, ParkingCircle, Receipt, Gift, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import TokenBalance from "../components/wallet/TokenBalance";
import RedeemCard from "../components/wallet/RedeemCard";

export default function Wallet() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await base44.entities.EcoToken.list("-created_date", 20);
        setTransactions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const earned = transactions.filter(t => t.type === "earned").reduce((s, t) => s + t.amount, 0);
  const redeemed = transactions.filter(t => t.type === "redeemed").reduce((s, t) => s + t.amount, 0);
  const balance = earned - redeemed;

  const reasonLabels = {
    green_route: "Green Route Bonus",
    electric_mode: "Electric Mode",
    off_peak_driving: "Off-Peak Driving",
    charging_discount: "Charging Discount",
    parking_discount: "Parking Discount",
    tax_credit: "Tax Credit",
    referral_bonus: "Referral Bonus",
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Eco Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">Earn & redeem your sustainability rewards</p>
      </div>

      <TokenBalance balance={balance || 1250} totalEarned={earned || 3480} co2Saved={42.6} />

      {/* Redeem Options */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Redeem Tokens</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <RedeemCard
            icon={Zap}
            title="Free Charging"
            description="30 min at any EcoFlow station"
            cost={50}
            color="bg-eco-green"
          />
          <RedeemCard
            icon={ParkingCircle}
            title="Smart Parking"
            description="2 hours free city parking"
            cost={30}
            color="bg-eco-teal"
          />
          <RedeemCard
            icon={Receipt}
            title="Tax Credit"
            description="₼10 annual vehicle tax discount"
            cost={100}
            color="bg-eco-blue"
          />
          <RedeemCard
            icon={Gift}
            title="Partner Rewards"
            description="Discounts at 200+ locations"
            cost={20}
            color="bg-eco-yellow"
          />
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h2 className="text-sm font-semibold mb-4">Transaction History</h2>

        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions yet. Start driving green to earn tokens!
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-secondary/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center",
                    tx.type === "earned" ? "bg-green-500/10" : "bg-red-500/10"
                  )}>
                    {tx.type === "earned"
                      ? <ArrowDownRight className="h-4 w-4 text-green-500" />
                      : <ArrowUpRight className="h-4 w-4 text-red-500" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium">{reasonLabels[tx.reason] || tx.reason}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {tx.zone_name ? `${tx.zone_name} • ` : ""}
                      {tx.description || ""}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "text-sm font-bold",
                  tx.type === "earned" ? "text-green-500" : "text-red-500"
                )}>
                  {tx.type === "earned" ? "+" : "-"}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}