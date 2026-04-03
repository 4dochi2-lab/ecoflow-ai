import { Coins, TrendingUp, Leaf } from "lucide-react";

export default function TokenBalance({ balance, totalEarned, co2Saved }) {
  return (
    <div className="bg-gradient-to-br from-primary/90 via-eco-teal/80 to-eco-blue/70 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Coins className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-white/80">Eco-Token Balance</span>
        </div>

        <p className="text-4xl font-bold tracking-tight">{balance.toLocaleString()}</p>
        <p className="text-sm text-white/60 mt-1">tokens available</p>

        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-white/60" />
            <div>
              <p className="text-sm font-semibold">{totalEarned.toLocaleString()}</p>
              <p className="text-[10px] text-white/50">Total Earned</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="h-3.5 w-3.5 text-white/60" />
            <div>
              <p className="text-sm font-semibold">{co2Saved} kg</p>
              <p className="text-[10px] text-white/50">CO₂ Saved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}