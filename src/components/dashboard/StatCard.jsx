import { cn } from "@/lib/utils";

export default function StatCard({ icon: Icon, label, value, suffix, trend, trendLabel, className }) {
  const isPositive = trend > 0;

  return (
    <div className={cn(
      "bg-card rounded-2xl border border-border p-5 transition-all hover:shadow-lg hover:shadow-primary/5",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend !== undefined && (
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {isPositive ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight">
          {value}
          {suffix && <span className="text-sm font-medium text-muted-foreground ml-1">{suffix}</span>}
        </p>
        <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
      </div>
      {trendLabel && (
        <p className="text-[11px] text-muted-foreground/70 mt-2">{trendLabel}</p>
      )}
    </div>
  );
}