import { cn } from "@/lib/utils";
import { MapPin, Wind, Car } from "lucide-react";

const statusConfig = {
  green: { bg: "bg-green-500/10", border: "border-green-500/30", dot: "bg-green-500", text: "text-green-500", label: "Clean" },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", dot: "bg-yellow-500", text: "text-yellow-500", label: "Moderate" },
  red: { bg: "bg-red-500/10", border: "border-red-500/30", dot: "bg-red-500", text: "text-red-500", label: "Critical" },
};

export default function ZoneStatusCard({ zone }) {
  const config = statusConfig[zone.status] || statusConfig.green;

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all hover:shadow-md",
      config.bg, config.border
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full animate-pulse-glow", config.dot)} />
          <span className="text-sm font-semibold">{zone.name}</span>
        </div>
        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", config.bg, config.text)}>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <Wind className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs font-bold">{zone.co2_level || 0}</p>
          <p className="text-[10px] text-muted-foreground">CO₂ ppm</p>
        </div>
        <div className="text-center">
          <MapPin className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs font-bold">{zone.pm25_level || 0}</p>
          <p className="text-[10px] text-muted-foreground">PM2.5</p>
        </div>
        <div className="text-center">
          <Car className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs font-bold">{zone.traffic_density || 0}%</p>
          <p className="text-[10px] text-muted-foreground">Density</p>
        </div>
      </div>
    </div>
  );
}