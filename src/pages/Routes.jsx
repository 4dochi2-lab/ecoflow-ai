import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Navigation, ArrowRight } from "lucide-react";
import RouteOptionCard from "../components/routes/RouteOptionCard";
import { toast } from "sonner";

const mockRouteOptions = [
  {
    type: "green_path",
    title: "Green Path via Outer Ring Road",
    description: "Via Lökbatan / Dairəvi yol — avoids 20 January congestion entirely. AI-optimized eco route.",
    distance: "19.2",
    duration: "26",
    co2_saved: "1.8",
    tokens: 25,
    zones_avoided: ["20 January", "Tbilisi Ave"],
  },
  {
    type: "electric_mode",
    title: "Stay on Route — Electric Mode",
    description: "Keep current route but switch to 100% Electric Mode through Red Zones.",
    distance: "15.4",
    duration: "22",
    co2_saved: "0.9",
    tokens: 10,
    zones_avoided: [],
  },
  {
    type: "standard",
    title: "Standard Route via Tbilisi Ave",
    description: "Fastest direct route through city center via 20 January. High congestion expected.",
    distance: "15.1",
    duration: "35",
    co2_saved: "0",
    tokens: 0,
    zones_avoided: [],
  },
];

export default function Routes() {
  const [origin, setOrigin] = useState("Bayil, Baku");
  const [destination, setDestination] = useState("Khirdalan");
  const [showResults, setShowResults] = useState(true);


  const handleSearch = () => {
    if (!origin || !destination) {
      toast.error("Please enter origin and destination");
      return;
    }
    setShowResults(true);
  };

  const navigate = useNavigate();

  const handleSelect = (option) => {
    toast.success(`Route selected: ${option.title}`, {
      description: `+${option.tokens} Eco-Tokens • ${option.co2_saved} kg CO₂ saved`,
    });
    const type = option.type === "green_path" ? "eco" : option.type === "standard" ? "traditional" : "eco";
    navigate(`/map?route=${type}&co2=${option.co2_saved}&tokens=${option.tokens}&title=${encodeURIComponent(option.title)}`);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Route Optimizer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find the greenest path and earn Eco-Tokens
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Origin
            </label>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Bayil, Baku"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>
          <ArrowRight className="hidden sm:block h-4 w-4 text-muted-foreground mt-5" />
          <div className="flex-1 w-full">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Destination
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Fountain Square"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>
          <Button
            onClick={handleSearch}
            className="w-full sm:w-auto mt-5 h-11 px-6 bg-primary hover:bg-primary/90 rounded-xl"
          >
            Find Routes
          </Button>
        </div>
      </div>

      {/* Route Options */}
      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Available Routes</h2>
            <p className="text-xs text-muted-foreground">
              {origin} → {destination}
            </p>
          </div>

          <div className="bg-gradient-to-r from-eco-green/10 via-eco-teal/10 to-transparent rounded-xl border border-eco-green/20 px-4 py-3 mb-2">
            <p className="text-xs font-medium text-eco-green">
              💡 Hybrid Vehicle Detected — You have 2 eco-options to earn tokens!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockRouteOptions.map((opt, i) => (
              <RouteOptionCard key={i} option={opt} onSelect={handleSelect} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Routes */}
      {!showResults && (
        <div className="bg-card rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold mb-4">Quick Suggestions</h2>
          <div className="space-y-2">
            {[
              { from: "Bayil", to: "Khirdalan", tokens: "15-25" },
              { from: "White City", to: "28 May Metro", tokens: "10-20" },
              { from: "Narimanov", to: "Heydar Aliyev Center", tokens: "20-30" },
            ].map((s, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-all group"
                onClick={() => {
                  setOrigin(s.from);
                  setDestination(s.to);
                  setShowResults(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Navigation className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{s.from} → {s.to}</p>
                    <p className="text-[11px] text-muted-foreground">Earn {s.tokens} tokens</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}