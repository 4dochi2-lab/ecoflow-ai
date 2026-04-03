import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { MapContainer, TileLayer, Circle, Popup, Polyline, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { cn } from "@/lib/utils";
import { Leaf, Navigation, Coins, Wind, AlertTriangle, CheckCircle2, ArrowLeft, MapPin, Flag } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const statusColors = {
  green: { fill: "#10b981", stroke: "#059669" },
  yellow: { fill: "#f59e0b", stroke: "#d97706" },
  red: { fill: "#ef4444", stroke: "#dc2626" },
};

// Bayil → Khirdalan route coordinates
const START_COORD = [40.3444, 49.8311]; // Bayil
const END_COORD   = [40.4481, 49.7551]; // Khirdalan

// Standard: via Tbilisi Ave & 20 January (congested)
const RED_ROUTE = [
  [40.3444, 49.8311], // Bayil
  [40.3530, 49.8280], // Neftchilar
  [40.3700, 49.8350], // 20 January — Red Zone
  [40.3900, 49.8200], // Tbilisi Ave
  [40.4100, 49.8000],
  [40.4300, 49.7800],
  [40.4481, 49.7551], // Khirdalan
];

// Eco: via Outer Ring Road (Lökbatan / Dairəvi yol)
const GREEN_ROUTE = [
  [40.3444, 49.8311], // Bayil
  [40.3350, 49.8100],
  [40.3400, 49.7800], // Lökbatan bypass
  [40.3700, 49.7600],
  [40.4000, 49.7500],
  [40.4300, 49.7520],
  [40.4481, 49.7551], // Khirdalan
];

// 20 January Red Zone geofence center
const RED_ZONE_CENTER = [40.3700, 49.8350];

const makeIcon = (color, label) => L.divIcon({
  className: "",
  html: `<div style="
    background:${color};border:2px solid white;border-radius:50%;
    width:14px;height:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const startIcon = L.divIcon({
  className: "",
  html: `<div style="background:#10b981;border:3px solid white;border-radius:50%;width:18px;height:18px;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9],
});
const endIcon = L.divIcon({
  className: "",
  html: `<div style="background:#3b82f6;border:3px solid white;border-radius:50%;width:18px;height:18px;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9],
});

export default function LiveMap() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const routeParam = urlParams.get("route");
  const co2Param = urlParams.get("co2") || "0";
  const tokensParam = urlParams.get("tokens") || "0";
  const titleParam = urlParams.get("title") ? decodeURIComponent(urlParams.get("title")) : null;

  const [zones, setZones] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeRoute, setActiveRoute] = useState(routeParam || null);
  const [tokens, setTokens] = useState(routeParam ? parseInt(tokensParam) : 0);
  const [fromRoute, setFromRoute] = useState(!!routeParam);

  useEffect(() => {
    base44.entities.EcoZone.list().then(setZones);
  }, []);

  const filtered = selectedStatus === "all" ? zones : zones.filter(z => z.status === selectedStatus);

  const selectRoute = (type) => {
    setActiveRoute(type);
    setFromRoute(false);
    if (type === "eco") setTokens(t => t + 25);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Controls header */}
      <div className="px-4 lg:px-8 py-3 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">Live Route & Zone Map</h1>
            <p className="text-xs text-gray-500">Baku Metropolitan Area — OpenStreetMap</p>
          </div>

          {/* Zone filters */}
          <div className="flex items-center gap-2">
            {["all", "green", "yellow", "red"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all border",
                  selectedStatus === s
                    ? s === "all" ? "bg-gray-800 text-white border-gray-800"
                      : s === "green" ? "bg-emerald-500 text-white border-emerald-500"
                      : s === "yellow" ? "bg-amber-400 text-white border-amber-400"
                      : "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                )}
              >
                {s === "all" ? "All Zones" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar panel */}
        <div className="w-[220px] shrink-0 bg-white border-r border-gray-200 flex flex-col p-4 gap-4 overflow-y-auto hidden lg:flex">
          {/* Token counter */}
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">Eco Tokens</span>
            </div>
            <p className="text-2xl font-black text-emerald-600">{tokens}</p>
            <p className="text-[10px] text-emerald-500 mt-0.5">earned this session</p>
          </div>

          {/* Route selector */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Select Route</p>
            <div className="space-y-2">
              <button
                onClick={() => selectRoute("eco")}
                className={cn(
                  "w-full flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all",
                  activeRoute === "eco"
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-emerald-300"
                )}
              >
                <div className="h-3 w-3 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-700">🌿 Eco Route</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">+25 tokens · Low emission</p>
                </div>
              </button>
              <button
                onClick={() => selectRoute("traditional")}
                className={cn(
                  "w-full flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all",
                  activeRoute === "traditional"
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-white hover:border-red-200"
                )}
              >
                <div className="h-3 w-3 rounded-full bg-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-700">🚗 Traditional</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">High traffic · No reward</p>
                </div>
              </button>
            </div>
            {activeRoute && (
              <button
                onClick={() => setActiveRoute(null)}
                className="mt-2 w-full text-[10px] text-gray-400 hover:text-gray-600 underline text-center"
              >
                Clear route
              </button>
            )}
          </div>

          {/* Impact stats */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Impact Stats</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-[11px] text-gray-500">CO₂ saved</span>
                <span className="text-xs font-bold text-emerald-600">{(tokens * 0.08).toFixed(1)} kg</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-[11px] text-gray-500">Green trips</span>
                <span className="text-xs font-bold text-emerald-600">{Math.floor(tokens / 25)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-[11px] text-gray-500">Total zones</span>
                <span className="text-xs font-bold text-gray-700">{zones.length}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Zone Legend</p>
            <div className="space-y-1.5">
              {[
                { color: "bg-emerald-500", label: "Green — Clean" },
                { color: "bg-amber-400", label: "Yellow — Moderate" },
                { color: "bg-red-500", label: "Red — Critical" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
                  <span className="text-[11px] text-gray-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[40.3963, 49.7931]}
            zoom={12}
            className="h-full w-full z-0"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Eco zones */}
            {filtered.map((zone) => {
              const colors = statusColors[zone.status] || statusColors.green;
              return (
                <Circle
                  key={zone.id}
                  center={[zone.lat, zone.lng]}
                  radius={zone.radius_m || 500}
                  pathOptions={{ color: colors.stroke, fillColor: colors.fill, fillOpacity: 0.18, weight: 2 }}
                >
                  <Popup>
                    <div className="min-w-[160px]">
                      <p className="font-bold text-sm text-gray-800">{zone.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 capitalize">{zone.status} zone</p>
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <p>CO₂: <strong>{zone.co2_level || "—"} ppm</strong></p>
                        <p>PM2.5: <strong>{zone.pm25_level || "—"} µg/m³</strong></p>
                        <p>Traffic: <strong>{zone.traffic_density || 0}%</strong></p>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              );
            })}

            {/* Standard route (red) — show when traditional selected */}
            {activeRoute === "traditional" && (
              <>
                <Polyline
                  positions={RED_ROUTE}
                  pathOptions={{ color: "#ef4444", weight: 6, opacity: 0.85, dashArray: "8 5" }}
                />
                {/* 20 January Red Zone geofence */}
                <Circle
                  center={RED_ZONE_CENTER}
                  radius={600}
                  pathOptions={{ color: "#dc2626", fillColor: "#ef4444", fillOpacity: 0.2, weight: 2 }}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#dc2626" }}>⚠ 20 January — High Congestion</span>
                  </Tooltip>
                </Circle>
                <Marker position={RED_ZONE_CENTER} icon={makeIcon("#ef4444")}>
                  <Popup>
                    <div>
                      <p className="font-bold text-red-600 text-sm flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> 20 January Red Zone
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Via Tbilisi Ave — 90%+ traffic density</p>
                      <p className="text-xs text-orange-500 mt-1 font-medium">⚡ Hybrid: Switch to EV Mode to maintain Eco-Score</p>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}

            {/* Eco route (green) — Outer Ring Road */}
            {activeRoute === "eco" && (
              <>
                <Polyline
                  positions={GREEN_ROUTE}
                  pathOptions={{ color: "#10b981", weight: 6, opacity: 0.95 }}
                />
                {/* Eco waypoint marker */}
                <Marker position={[40.3700, 49.7600]} icon={makeIcon("#10b981")}>
                  <Popup>
                    <div>
                      <p className="font-bold text-emerald-600 text-sm flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Outer Ring Road
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Lökbatan bypass — clean air corridor</p>
                    </div>
                  </Popup>
                  <Tooltip permanent direction="top" offset={[0, -10]}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>🌿 Clean Zone</span>
                  </Tooltip>
                </Marker>
              </>
            )}

            {/* Always show start/end markers */}
            <Marker position={START_COORD} icon={startIcon}>
              <Popup><p className="text-sm font-bold text-gray-800">🚗 Origin — Bayil, Baku</p></Popup>
            </Marker>
            <Marker position={END_COORD} icon={endIcon}>
              <Popup><p className="text-sm font-bold text-gray-800">🏁 Destination — Khirdalan</p></Popup>
            </Marker>
          </MapContainer>

          {/* Mobile token badge */}
          {tokens > 0 && (
            <div className="absolute top-4 right-4 z-[400] lg:hidden bg-white border border-emerald-200 rounded-xl px-3 py-2 shadow flex items-center gap-2">
              <Coins className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-600">{tokens} tokens</span>
            </div>
          )}

          {/* Floating route overlay */}
          {activeRoute && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white border shadow-xl rounded-2xl px-5 py-3 flex items-center gap-4 whitespace-nowrap"
              style={{ borderColor: activeRoute === "eco" ? "#10b981" : "#ef4444" }}>
              <div className={`h-2.5 w-2.5 rounded-full ${activeRoute === "eco" ? "bg-emerald-500" : "bg-red-500"}`} />
              <div>
                <p className="text-xs font-bold text-gray-800">
                  {activeRoute === "eco" ? "🌿 Green Path Active" : "🚗 Traditional Route"}
                </p>
                {activeRoute === "eco" && (
                  <p className="text-[11px] text-emerald-600 font-medium">
                    CO₂ saved: {fromRoute ? co2Param : "1.8"} kg &nbsp;·&nbsp; Tokens pending: +{fromRoute ? tokensParam : "25"}
                  </p>
                )}
                {activeRoute === "traditional" && (
                  <p className="text-[11px] text-red-500 font-medium">
                    ⚡ Hybrid detected — Switch to EV Mode to maintain Eco-Score
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate("/routes")}
                className="ml-2 flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Routes
              </button>
            </div>
          )}

          {/* No route prompt */}
          {!activeRoute && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-white border border-gray-200 shadow-lg rounded-2xl px-5 py-3 flex items-center gap-3 lg:hidden">
              <Navigation className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-medium text-gray-700">Select a route in the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}