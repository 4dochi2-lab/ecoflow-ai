import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Leaf, Wind, Car, Coins, TrendingDown } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import ZoneStatusCard from "../components/dashboard/ZoneStatusCard";
import AirQualityChart from "../components/dashboard/AirQualityChart";
import TrafficChart from "../components/dashboard/TrafficChart";
import LiveFeed from "../components/dashboard/LiveFeed";

export default function Dashboard() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    base44.auth.me().then(u => setUserName(u?.full_name?.split(" ")[0] || ""));
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const data = await base44.entities.EcoZone.list();
        setZones(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const redZones = zones.filter(z => z.status === "red").length;
  const avgCo2 = zones.length > 0 ? Math.round(zones.reduce((s, z) => s + (z.co2_level || 0), 0) / zones.length) : 0;

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          {userName ? (
            <>Welcome back, <span className="text-primary">{userName}</span></>
          ) : (
            "Welcome back"
          )}
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={Wind}
          label="Avg. CO₂ Level"
          value={avgCo2 || 342}
          suffix="ppm"
          trend={-8.2}
          trendLabel="vs. yesterday"
        />
        <StatCard
          icon={Car}
          label="Active Vehicles"
          value="2,847"
          trend={12.5}
          trendLabel="on green routes"
        />
        <StatCard
          icon={Coins}
          label="Tokens Distributed"
          value="18.4K"
          trend={24.1}
          trendLabel="this week"
        />
        <StatCard
          icon={TrendingDown}
          label="CO₂ Saved Today"
          value="4.2"
          suffix="tons"
          trend={15.3}
          trendLabel="cumulative impact"
        />
      </div>

      {/* Zone Overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Active Zones</h2>
          <div className="flex items-center gap-2">
            {redZones > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                {redZones} Red Zone{redZones > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : zones.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <Leaf className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No zones configured yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Add zones from the Admin panel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {zones.map((zone) => (
              <ZoneStatusCard key={zone.id} zone={zone} />
            ))}
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AirQualityChart />
        <TrafficChart />
      </div>

      {/* Live Feed */}
      <LiveFeed />
    </div>
  );
}