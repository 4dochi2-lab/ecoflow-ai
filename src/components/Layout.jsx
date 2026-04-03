import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Map, Wallet, Route, Shield, User, Leaf, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/map", icon: Map, label: "Live Map" },
  { path: "/routes", icon: Route, label: "Routes" },
  { path: "/wallet", icon: Wallet, label: "Eco Wallet" },
  { path: "/admin", icon: Shield, label: "Admin" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-eco-green to-eco-teal flex items-center justify-center">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 tracking-tight">EcoFlow AI</h1>
            <p className="text-[11px] text-sidebar-foreground/60 font-medium">Smart City Mobility</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
                {active && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 mx-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-600">Eco Score</p>
          <div className="mt-2 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
          </div>
          <p className="mt-1.5 text-[11px] text-emerald-400">75/100 — Great Progress</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-sidebar flex flex-col">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-eco-green to-eco-teal flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-base font-bold text-white">EcoFlow AI</h1>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-sidebar-foreground/60">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-2 space-y-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      active
                        ? "bg-sidebar-primary/15 text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-eco-green to-eco-teal flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">EcoFlow AI</span>
          </div>
          <div className="w-9" />
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}