import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { zone: "Fountain Sq", density: 85, speed: 12 },
  { zone: "Nizami St", density: 72, speed: 18 },
  { zone: "White City", density: 35, speed: 45 },
  { zone: "Bayil", density: 60, speed: 25 },
  { zone: "Yasamal", density: 90, speed: 8 },
  { zone: "Narimanov", density: 55, speed: 30 },
];

export default function TrafficChart() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Traffic Density by Zone</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Current congestion levels</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={mockData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" vertical={false} />
          <XAxis dataKey="zone" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "hsl(220, 25%, 10%)",
              border: "none",
              borderRadius: "12px",
              fontSize: "12px",
              color: "white",
              padding: "10px 14px",
            }}
          />
          <Bar dataKey="density" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} opacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}