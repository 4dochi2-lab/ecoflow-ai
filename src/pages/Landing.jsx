import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowRight, Wind, Coins, Shield, Zap, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";

// --- Animated 3D Map Canvas ---
function BakuMapCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animFrame;
    let t = 0;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Grid of city blocks
    const blocks = [];
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 8; j++) {
        blocks.push({ x: i, y: j, h: Math.random() * 0.6 + 0.2 });
      }
    }

    // Flowing route paths
    const routes = [
      { points: [[0.05,0.5],[0.2,0.35],[0.4,0.4],[0.6,0.3],[0.8,0.45],[0.95,0.5]], color: "#10b981", speed: 0.004, type: "ev" },
      { points: [[0.1,0.7],[0.25,0.6],[0.5,0.55],[0.7,0.65],[0.9,0.6]], color: "#34d399", speed: 0.003, type: "ev" },
      { points: [[0.05,0.3],[0.3,0.25],[0.55,0.2],[0.75,0.3],[0.95,0.35]], color: "#2dd4bf", speed: 0.005, type: "hybrid" },
      { points: [[0.15,0.85],[0.35,0.75],[0.6,0.8],[0.85,0.7]], color: "#6ee7b7", speed: 0.0035, type: "ev" },
      { points: [[0.05,0.15],[0.2,0.2],[0.45,0.1],[0.7,0.18],[0.92,0.12]], color: "#10b981", speed: 0.006, type: "hybrid" },
    ];

    const particles = routes.map(r => ({ t: Math.random(), route: r }));

    function cubicInterp(points, t) {
      if (points.length < 2) return points[0];
      const seg = (points.length - 1) * t;
      const i = Math.min(Math.floor(seg), points.length - 2);
      const lt = seg - i;
      const p0 = points[Math.max(0, i - 1)] || points[0];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const t2 = lt * lt, t3 = t2 * lt;
      const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * lt + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * lt + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      return [x, y];
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.008;

      // Dark grid background
      ctx.fillStyle = "rgba(5, 15, 30, 0.0)";
      ctx.fillRect(0, 0, W, H);

      // Isometric grid
      const iso = { ox: W * 0.5, oy: H * 0.18, sx: W / 13, sy: H / 11 };
      const toScreen = (gx, gy, gz = 0) => ({
        x: iso.ox + (gx - gy) * iso.sx * 0.7,
        y: iso.oy + (gx + gy) * iso.sy * 0.4 - gz * iso.sy * 1.2,
      });

      // Draw city blocks (isometric)
      blocks.forEach(b => {
        const h = b.h * 0.8;
        const tl = toScreen(b.x, b.y, h);
        const tr = toScreen(b.x + 0.8, b.y, h);
        const br = toScreen(b.x + 0.8, b.y + 0.8, h);
        const bl = toScreen(b.x, b.y + 0.8, h);
        const fl = toScreen(b.x, b.y + 0.8, 0);
        const fr = toScreen(b.x + 0.8, b.y + 0.8, 0);
        const brb = toScreen(b.x + 0.8, b.y, 0);

        // Right face
        ctx.beginPath();
        ctx.moveTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(fr.x, fr.y);
        ctx.lineTo(brb.x, brb.y);
        ctx.closePath();
        ctx.fillStyle = `rgba(10, 30, 50, 0.85)`;
        ctx.fill();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Front face
        ctx.beginPath();
        ctx.moveTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.lineTo(fl.x, fl.y);
        ctx.lineTo(fr.x, fr.y);
        ctx.closePath();
        ctx.fillStyle = `rgba(8, 22, 40, 0.9)`;
        ctx.fill();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.06)";
        ctx.stroke();

        // Top face
        const alpha = 0.15 + b.h * 0.25 + Math.sin(t + b.x + b.y) * 0.04;
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.closePath();
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.fill();
        ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Draw route trails
      routes.forEach(route => {
        if (route.points.length < 2) return;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const pt = cubicInterp(route.points, i / 60);
          const sx = iso.ox + (pt[0] * 11 - pt[1] * 7) * iso.sx * 0.7;
          const sy = iso.oy + (pt[0] * 11 + pt[1] * 7) * iso.sy * 0.4;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = route.color + "33";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw animated particles
      particles.forEach(p => {
        p.t = (p.t + p.route.speed) % 1;
        const pt = cubicInterp(p.route.points, p.t);
        const sx = iso.ox + (pt[0] * 11 - pt[1] * 7) * iso.sx * 0.7;
        const sy = iso.oy + (pt[0] * 11 + pt[1] * 7) * iso.sy * 0.4;

        // Glow
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 18);
        grad.addColorStop(0, p.route.color + "cc");
        grad.addColorStop(0.4, p.route.color + "44");
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(sx, sy, 18, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.route.color;
        ctx.fill();

        // Trail
        for (let ti = 1; ti <= 8; ti++) {
          const trailT = ((p.t - ti * 0.015) + 1) % 1;
          const tp = cubicInterp(p.route.points, trailT);
          const tsx = iso.ox + (tp[0] * 11 - tp[1] * 7) * iso.sx * 0.7;
          const tsy = iso.oy + (tp[0] * 11 + tp[1] * 7) * iso.sy * 0.4;
          ctx.beginPath();
          ctx.arc(tsx, tsy, 2 - ti * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = p.route.color + Math.floor((1 - ti / 8) * 150).toString(16).padStart(2, "0");
          ctx.fill();
        }
      });

      // Scan line overlay
      const scanY = ((t * 30) % (H + 100)) - 50;
      const scanGrad = ctx.createLinearGradient(0, scanY, 0, scanY + 50);
      scanGrad.addColorStop(0, "rgba(16,185,129,0)");
      scanGrad.addColorStop(0.5, "rgba(16,185,129,0.04)");
      scanGrad.addColorStop(1, "rgba(16,185,129,0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY, W, 50);

      animFrame = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

// --- Floating stat badge ---
function StatBadge({ icon: Icon, value, label, delay = 0 }) {
  return (
    <div
      className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5"
      style={{ animation: `fadeUp 0.6s ease ${delay}s both` }}
    >
      <div className="h-7 w-7 rounded-lg bg-eco-green/20 flex items-center justify-center">
        <Icon className="h-3.5 w-3.5 text-eco-green" />
      </div>
      <div>
        <p className="text-sm font-bold text-white">{value}</p>
        <p className="text-[10px] text-white/50">{label}</p>
      </div>
    </div>
  );
}

export default function Landing() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(setAuthed);
  }, []);

  return (
    <div className="min-h-screen bg-[#030d18] text-white overflow-x-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px 4px rgba(16,185,129,0.35), 0 0 60px 12px rgba(16,185,129,0.1); }
          50% { box-shadow: 0 0 30px 8px rgba(16,185,129,0.55), 0 0 80px 20px rgba(16,185,129,0.15); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .glow-btn { animation: glow 2.5s ease-in-out infinite; }
        .float-anim { animation: float 4s ease-in-out infinite; }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 bg-gradient-to-b from-[#030d18] to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-eco-green to-eco-teal flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">EcoFlow AI</span>
        </div>
        <Link
          to={authed ? "/dashboard" : "/signin"}
          className="text-sm font-medium text-white/70 hover:text-white transition-colors"
        >
          {authed ? "Open Dashboard →" : "Sign In"}
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Canvas Background */}
        <div className="absolute inset-0 z-0">
          <BakuMapCanvas />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030d18] via-[#030d18]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#030d18] to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#030d18] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12 pt-24 pb-16">
          <div className="max-w-[600px]">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-eco-green/30 bg-eco-green/10 mb-6"
              style={{ animation: "fadeUp 0.5s ease 0.1s both" }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-eco-green animate-pulse" />
              <span className="text-[11px] font-semibold text-eco-green uppercase tracking-widest">
                Baku Smart Mobility Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl lg:text-7xl font-black leading-[1.04] tracking-tight mb-5"
              style={{ animation: "fadeUp 0.6s ease 0.2s both" }}
            >
              The Pulse of a
              <br />
              <span className="bg-gradient-to-r from-eco-green via-emerald-300 to-eco-teal bg-clip-text text-transparent">
                Greener City.
              </span>
            </h1>

            {/* Sub-headline */}
            <p
              className="text-lg lg:text-xl text-white/60 leading-relaxed mb-8 max-w-[480px]"
              style={{ animation: "fadeUp 0.6s ease 0.35s both" }}
            >
              AI-driven navigation that{" "}
              <span className="text-white/90 font-medium">rewards you for cleaning the air</span>.
              Join Baku's first Eco-Incentive Mobility network.
            </p>

            {/* CTA */}
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ animation: "fadeUp 0.6s ease 0.5s both" }}
            >
              <Link
                to={authed ? "/dashboard" : "/signin"}
                className="glow-btn inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-eco-green text-white text-base font-bold transition-all hover:bg-eco-green/90 hover:scale-105 active:scale-95"
              >
                <Zap className="h-4 w-4" />
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white/80 transition-colors"
              >
                Learn more
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>

            {/* Stat badges */}
            <div
              className="flex flex-wrap gap-3 mt-10"
              style={{ animation: "fadeUp 0.6s ease 0.65s both" }}
            >
              <StatBadge icon={Wind} value="4.2 tons" label="CO₂ saved today" delay={0.7} />
              <StatBadge icon={Coins} value="18.4K" label="Tokens distributed" delay={0.8} />
              <StatBadge icon={Shield} value="6 Zones" label="Live monitored" delay={0.9} />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 opacity-40">
          <ChevronDown className="h-5 w-5 text-white animate-bounce" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6 lg:px-12 max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold uppercase tracking-widest text-eco-green mb-3">How It Works</p>
          <h2 className="text-3xl lg:text-4xl font-black">
            Smart city technology,{" "}
            <span className="text-eco-green">in your hands.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              color: "from-red-500/20 to-red-900/10",
              border: "border-red-500/20",
              iconBg: "bg-red-500/15",
              iconColor: "text-red-400",
              title: "Dynamic Geofencing",
              desc: "Real-time Red Zones triggered by IoT air quality sensors. CO₂ and PM2.5 monitored 24/7 across Baku.",
            },
            {
              icon: Zap,
              color: "from-eco-green/15 to-emerald-900/10",
              border: "border-eco-green/20",
              iconBg: "bg-eco-green/15",
              iconColor: "text-eco-green",
              title: "AI Route Optimizer",
              desc: "XGBoost-powered navigation finds the greenest path. Hybrid drivers get two eco-options with instant token rewards.",
            },
            {
              icon: Coins,
              color: "from-yellow-500/15 to-yellow-900/10",
              border: "border-yellow-500/20",
              iconBg: "bg-yellow-500/15",
              iconColor: "text-yellow-400",
              title: "Tokenomics Engine",
              desc: "Earn Eco-Tokens for every green decision. Redeem for free charging, parking discounts, or tax credits.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className={`rounded-2xl border bg-gradient-to-br ${f.color} ${f.border} p-6 hover:scale-[1.02] transition-all duration-300`}
            >
              <div className={`h-11 w-11 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}>
                <f.icon className={`h-5 w-5 ${f.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 text-center">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-eco-green/10 blur-3xl rounded-full scale-150" />
          <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-eco-green to-eco-teal flex items-center justify-center mx-auto">
            <Leaf className="h-9 w-9 text-white float-anim" />
          </div>
        </div>
        <h2 className="text-3xl lg:text-5xl font-black mb-4">
          Drive green.<br />
          <span className="text-eco-green">Earn rewards.</span>
        </h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">Join thousands of Baku drivers already reducing emissions and earning Eco-Tokens.</p>
        <Link
          to={authed ? "/dashboard" : "/signin"}
          className="glow-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-eco-green text-white font-bold text-lg hover:bg-eco-green/90 transition-all hover:scale-105"
        >
          <Zap className="h-5 w-5" />
          Open the Dashboard
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-lg bg-eco-green/20 flex items-center justify-center">
            <Leaf className="h-3 w-3 text-eco-green" />
          </div>
          <span className="text-sm font-semibold">EcoFlow AI</span>
        </div>
        <p className="text-xs text-white/25">© 2026 EcoFlow AI — Smart City Mobility, Baku</p>
      </footer>
    </div>
  );
}