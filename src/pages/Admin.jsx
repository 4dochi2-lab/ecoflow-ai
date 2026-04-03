import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AdminAnalytics from "../components/admin/AdminAnalytics";

const defaultZone = {
  name: "", status: "green", lat: 40.4093, lng: 49.8671,
  radius_m: 500, co2_level: 0, pm25_level: 0, traffic_density: 0, avg_speed_kmh: 0, active_vehicles: 0, description: "",
};

export default function Admin() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [form, setForm] = useState(defaultZone);

  useEffect(() => {
    loadZones();
  }, []);

  async function loadZones() {
    setLoading(true);
    const data = await base44.entities.EcoZone.list();
    setZones(data);
    setLoading(false);
  }

  function openCreate() {
    setEditingZone(null);
    setForm(defaultZone);
    setDialogOpen(true);
  }

  function openEdit(zone) {
    setEditingZone(zone);
    setForm({
      name: zone.name, status: zone.status, lat: zone.lat, lng: zone.lng,
      radius_m: zone.radius_m || 500, co2_level: zone.co2_level || 0,
      pm25_level: zone.pm25_level || 0, traffic_density: zone.traffic_density || 0,
      avg_speed_kmh: zone.avg_speed_kmh || 0, active_vehicles: zone.active_vehicles || 0,
      description: zone.description || "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name) { toast.error("Zone name is required"); return; }
    const payload = { ...form, lat: Number(form.lat), lng: Number(form.lng), radius_m: Number(form.radius_m), co2_level: Number(form.co2_level), pm25_level: Number(form.pm25_level), traffic_density: Number(form.traffic_density), avg_speed_kmh: Number(form.avg_speed_kmh), active_vehicles: Number(form.active_vehicles) };
    if (editingZone) {
      await base44.entities.EcoZone.update(editingZone.id, payload);
      toast.success("Zone updated");
    } else {
      await base44.entities.EcoZone.create(payload);
      toast.success("Zone created");
    }
    setDialogOpen(false);
    loadZones();
  }

  async function handleDelete(id) {
    await base44.entities.EcoZone.delete(id);
    toast.success("Zone deleted");
    loadZones();
  }

  const updateField = (field, value) => setForm(p => ({ ...p, [field]: value }));

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage zones and monitor city health</p>
        </div>
        <Button onClick={openCreate} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> Add Zone
        </Button>
      </div>

      <AdminAnalytics zones={zones} />

      {/* Zone Management Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold">Zone Management</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MapPin className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No zones yet</p>
            <Button onClick={openCreate} variant="outline" className="mt-3 text-xs">Create First Zone</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Zone</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">CO₂</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">PM2.5</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Traffic</th>
                  <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="px-5 py-3 font-medium">{zone.name}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                        zone.status === "green" && "bg-green-500/10 text-green-500",
                        zone.status === "yellow" && "bg-yellow-500/10 text-yellow-500",
                        zone.status === "red" && "bg-red-500/10 text-red-500",
                      )}>{zone.status}</span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">{zone.co2_level || "—"} ppm</td>
                    <td className="px-5 py-3 hidden md:table-cell">{zone.pm25_level || "—"} µg/m³</td>
                    <td className="px-5 py-3 hidden lg:table-cell">{zone.traffic_density || 0}%</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(zone)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(zone.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Zone Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingZone ? "Edit Zone" : "Add Zone"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-medium mb-1 block">Zone Name</label>
              <Input value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="e.g. Yasamal District" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Status</label>
              <Select value={form.status} onValueChange={v => updateField("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Latitude</label>
                <Input type="number" step="0.0001" value={form.lat} onChange={e => updateField("lat", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Longitude</label>
                <Input type="number" step="0.0001" value={form.lng} onChange={e => updateField("lng", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Radius (m)</label>
                <Input type="number" value={form.radius_m} onChange={e => updateField("radius_m", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">CO₂ (ppm)</label>
                <Input type="number" value={form.co2_level} onChange={e => updateField("co2_level", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">PM2.5 (µg/m³)</label>
                <Input type="number" value={form.pm25_level} onChange={e => updateField("pm25_level", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Traffic Density (%)</label>
                <Input type="number" value={form.traffic_density} onChange={e => updateField("traffic_density", e.target.value)} />
              </div>
            </div>
            <Button className="w-full" onClick={handleSave}>
              {editingZone ? "Update Zone" : "Create Zone"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}