import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Leaf, Coins, Route, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ vehicle_type: "electric", vehicle_model: "" });

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me();
      setUser(me);
      const drivers = await base44.entities.Driver.filter({ created_by: me.email });
      if (drivers.length > 0) {
        setDriver(drivers[0]);
        setForm({ vehicle_type: drivers[0].vehicle_type, vehicle_model: drivers[0].vehicle_model || "" });
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    if (driver) {
      await base44.entities.Driver.update(driver.id, form);
      setDriver({ ...driver, ...form });
    } else {
      const newDriver = await base44.entities.Driver.create({
        full_name: user.full_name || user.email,
        ...form,
      });
      setDriver(newDriver);
    }
    toast.success("Profile updated");
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { icon: Coins, label: "Token Balance", value: driver?.token_balance || 0, color: "bg-eco-yellow/10 text-eco-yellow" },
    { icon: Leaf, label: "CO₂ Saved", value: `${driver?.total_co2_saved_kg || 0} kg`, color: "bg-green-500/10 text-green-500" },
    { icon: Route, label: "Green Routes", value: driver?.green_routes_taken || 0, color: "bg-eco-teal/10 text-eco-teal" },
    { icon: Zap, label: "EV Switches", value: driver?.electric_mode_switches || 0, color: "bg-eco-blue/10 text-eco-blue" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-[800px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Driver Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Your eco-driving stats & settings</p>
      </div>

      {/* Profile Header */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-eco-teal flex items-center justify-center text-white text-xl font-bold">
            {(user?.full_name || user?.email || "U")[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user?.full_name || "Driver"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Eco Score: {driver?.eco_score || 50}/100</span>
            </div>
          </div>
        </div>

        {/* Eco Score Bar */}
        <div className="mt-5">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-eco-green to-eco-teal transition-all duration-500"
              style={{ width: `${driver?.eco_score || 50}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4 text-center">
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center mx-auto mb-2", stat.color)}>
              <stat.icon className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Vehicle Settings */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Car className="h-4 w-4" /> Vehicle Settings
        </h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block">Vehicle Type</label>
            <Select value={form.vehicle_type} onValueChange={v => setForm(p => ({ ...p, vehicle_type: v }))}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="electric">Electric Vehicle (EV)</SelectItem>
                <SelectItem value="hybrid">Hybrid Vehicle</SelectItem>
                <SelectItem value="gasoline">Gasoline Vehicle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Vehicle Model</label>
            <Input
              placeholder="e.g. Tesla Model 3, Toyota Prius"
              value={form.vehicle_model}
              onChange={e => setForm(p => ({ ...p, vehicle_model: e.target.value }))}
              className="rounded-xl"
            />
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl">
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}