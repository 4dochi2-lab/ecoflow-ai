import { Zap, ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const feedItems = [
  { id: 1, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", text: "Red Zone activated: Yasamal district — PM2.5 exceeded 50 µg/m³", time: "2m ago" },
  { id: 2, icon: Zap, color: "text-eco-green", bg: "bg-green-500/10", text: "EV Driver earned 25 tokens for Green Path route", time: "5m ago" },
  { id: 3, icon: Shield, color: "text-eco-blue", bg: "bg-blue-500/10", text: "Hybrid driver switched to Electric Mode in Fountain Square", time: "8m ago" },
  { id: 4, icon: ArrowRight, color: "text-eco-teal", bg: "bg-teal-500/10", text: "Route optimization: 15 vehicles rerouted from Nizami St", time: "12m ago" },
  { id: 5, icon: Zap, color: "text-eco-green", bg: "bg-green-500/10", text: "50 tokens redeemed for free charging at White City station", time: "18m ago" },
];

export default function LiveFeed() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-eco-green animate-pulse" />
          <h3 className="text-sm font-semibold">Live Activity Feed</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">Real-time</span>
      </div>

      <div className="space-y-3">
        {feedItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", item.bg)}>
              <item.icon className={cn("h-3.5 w-3.5", item.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-relaxed">{item.text}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}