import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { time: "06:00", co2: 280, pm25: 12 },
  { time: "08:00", co2: 420, pm25: 35 },
  { time: "10:00", co2: 380, pm25: 28 },
  { time: "12:00", co2: 350, pm25: 22 },
  { time: "14:00", co2: 390, pm25: 30 },
  { time: "16:00", co2: 450, pm25: 42 },
  { time: "18:00", co2: 520, pm25: 55 },
  { time: "20:00", co2: 380, pm25: 25 },
  { time: "22:00", co2: 300, pm25: 15 },
];

export default function AirQualityChart() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Air Quality Index</h3>
          <p className="text-xs text-muted-foreground mt-0.5">CO₂ & PM2.5 levels across Baku today</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-eco-green" />
            <span className="text-[11px] text-muted-foreground">CO₂</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-eco-teal" />
            <span className="text-[11px] text-muted-foreground">PM2.5</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={mockData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(174, 72%, 40%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(174, 72%, 40%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
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
          <Area type="monotone" dataKey="co2" stroke="hsl(160, 84%, 39%)" fill="url(#co2Gradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="pm25" stroke="hsl(174, 72%, 40%)" fill="url(#pm25Gradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}