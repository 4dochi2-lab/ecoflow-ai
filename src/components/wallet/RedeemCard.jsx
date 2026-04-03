import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

export default function RedeemCard({ icon: Icon, title, description, cost, color }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", color)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
        <Coins className="h-3 w-3" />
        {cost} Tokens
      </Button>
    </div>
  );
}