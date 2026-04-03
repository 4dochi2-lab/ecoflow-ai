import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AdminAnalytics({ zones }) {
  const statusCounts = {
    green: zones.filter(z => z.status === "green").length,
    yellow: zones.filter(z => z.status === "yellow").length,
    red: zones.filter(z => z.status === "red").length,
  };

  const pieData = [
    { name: "Green", value: statusCounts.green || 1, color: "#10b981" },
    { name: "Yellow", value: statusCounts.yellow || 0, color: "#f59e0b" },
    { name: "Red", value: statusCounts.red || 0, color: "#ef4444" },
  ].filter(d => d.value > 0);

  const totalVehicles = zones.reduce((s, z) => s + (z.active_vehicles || 0), 0);
  const avgTraffic = zones.length > 0
    ? Math.round(zones.reduce((s, z) => s + (z.traffic_density || 0), 0) / zones.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Zone Distribution */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3">Zone Distribution</h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={22} outerRadius={36} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-xs">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3">Key Metrics</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Zones</span>
            <span className="text-sm font-bold">{zones.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Active Vehicles</span>
            <span className="text-sm font-bold">{totalVehicles}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Avg Traffic</span>
            <span className="text-sm font-bold">{avgTraffic}%</span>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3">Alert Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-500 font-medium">Critical Zones</span>
            <span className="text-sm font-bold text-red-500">{statusCounts.red}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-yellow-500 font-medium">Warning Zones</span>
            <span className="text-sm font-bold text-yellow-500">{statusCounts.yellow}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-500 font-medium">Healthy Zones</span>
            <span className="text-sm font-bold text-green-500">{statusCounts.green}</span>
          </div>
        </div>
      </div>
    </div>
  );
}