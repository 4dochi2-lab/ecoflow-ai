import { cn } from "@/lib/utils";
import { Coins, Clock, MapPin, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RouteOptionCard({ option, onSelect }) {
  const isGreen = option.type === "green_path";
  const isElectric = option.type === "electric_mode";

  return (
    <div className={cn(
      "rounded-2xl border-2 p-5 transition-all hover:shadow-lg cursor-pointer",
      isGreen
        ? "border-eco-green/30 bg-green-500/5 hover:border-eco-green/50"
        : isElectric
        ? "border-eco-teal/30 bg-teal-500/5 hover:border-eco-teal/50"
        : "border-border bg-card hover:border-border/80"
    )}
      onClick={() => onSelect?.(option)}
    >
      {/* Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold",
          isGreen ? "bg-green-500/15 text-green-500" : isElectric ? "bg-teal-500/15 text-teal-500" : "bg-secondary text-muted-foreground"
        )}>
          {isGreen ? <MapPin className="h-3 w-3" /> : isElectric ? <Zap className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
          {isGreen ? "Green Path" : isElectric ? "Electric Mode" : "Standard Route"}
        </div>
        <div className="flex items-center gap-1">
          <Coins className="h-3.5 w-3.5 text-eco-yellow" />
          <span className="text-sm font-bold text-eco-yellow">+{option.tokens}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold mb-1">{option.title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{option.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center bg-background/50 rounded-lg py-2">
          <p className="text-xs font-bold">{option.distance}</p>
          <p className="text-[10px] text-muted-foreground">km</p>
        </div>
        <div className="text-center bg-background/50 rounded-lg py-2">
          <p className="text-xs font-bold">{option.duration}</p>
          <p className="text-[10px] text-muted-foreground">min</p>
        </div>
        <div className="text-center bg-background/50 rounded-lg py-2">
          <p className="text-xs font-bold">{option.co2_saved}</p>
          <p className="text-[10px] text-muted-foreground">kg CO₂</p>
        </div>
      </div>

      <Button
        className={cn(
          "w-full",
          isGreen
            ? "bg-eco-green hover:bg-eco-green/90 text-white"
            : isElectric
            ? "bg-eco-teal hover:bg-eco-teal/90 text-white"
            : ""
        )}
        variant={!isGreen && !isElectric ? "secondary" : "default"}
      >
        Select This Route
      </Button>
    </div>
  );
}