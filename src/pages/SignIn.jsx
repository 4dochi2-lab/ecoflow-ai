import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Leaf, Zap, ArrowRight, Shield, Coins, Wind } from "lucide-react";
import { base44 } from "@/api/base44Client";

function MiniMapCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animFrame;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      color: ["#10b981", "#34d399", "#2dd4bf", "#6ee7b7"][i % 4],
      r: Math.random() * 2.5 + 1.5,
    }));

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
      });

      particles.forEach((a, i) => {
        particles.forEach((b, j) => {
          if (j <= i) return;
          const dx = (a.x - b.x) * W, dy = (a.y - b.y) * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x * W, a.y * H);
            ctx.lineTo(b.x * W, b.y * H);
            ctx.strokeStyle = `rgba(16,185,129,${(1 - dist / 130) * 0.12})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      particles.forEach(p => {
        const grad = ctx.createRadialGradient(p.x * W, p.y * H, 0, p.x * W, p.y * H, p.r * 5);
        grad.addColorStop(0, p.color + "88");
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animFrame = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export default function SignIn() {
  const handleLogin = () => {
    base44.auth.redirectToLogin("/onboarding");
  };

  return (
    <div className="min-h-screen bg-[#030d18] text-white flex overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px 4px rgba(16,185,129,0.35), 0 0 60px 12px rgba(16,185,129,0.1); }
          50% { box-shadow: 0 0 30px 8px rgba(16,185,129,0.55), 0 0 80px 20px rgba(16,185,129,0.15); }
        }
        .glow-btn { animation: glow 2.5s ease-in-out infinite; }
      `}</style>

      {/* Left panel — branding + animated bg */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <MiniMapCanvas />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#030d18]/20 to-[#030d18]/80" />
          <div className="absolute inset-0 bg-[#030d18]/40" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-eco-green to-eco-teal flex items-center justify-center">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold">EcoFlow AI</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-eco-green/30 bg-eco-green/10 mb-6 w-fit"
              style={{ animation: "fadeUp 0.5s ease 0.1s both" }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-eco-green animate-pulse" />
              <span className="text-[11px] font-semibold text-eco-green uppercase tracking-widest">Smart City Platform</span>
            </div>
            <h2 className="text-4xl font-black leading-tight mb-4" style={{ animation: "fadeUp 0.6s ease 0.2s both" }}>
              Drive smarter.<br />
              <span className="bg-gradient-to-r from-eco-green to-eco-teal bg-clip-text text-transparent">
                Breathe cleaner.
              </span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed" style={{ animation: "fadeUp 0.6s ease 0.3s both" }}>
              Join Baku's first AI-powered mobility network. Every green route earns Eco-Tokens and cleans the air for everyone.
            </p>

            <div className="mt-8 space-y-3" style={{ animation: "fadeUp 0.6s ease 0.4s both" }}>
              {[
                { icon: Shield, label: "Real-time Red Zone alerts" },
                { icon: Zap, label: "AI route optimization" },
                { icon: Coins, label: "Earn & redeem Eco-Tokens" },
                { icon: Wind, label: "Track your CO₂ impact" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-eco-green/15 flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5 text-eco-green" />
                  </div>
                  <span className="text-sm text-white/70">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-white/20">© 2026 EcoFlow AI — Baku</p>
        </div>
      </div>

      {/* Right panel — sign in */}
      <div className="flex flex-col justify-center w-full lg:w-[460px] shrink-0 px-8 lg:px-14 py-12 bg-[#040f1e] border-l border-white/5">
        <Link to="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-eco-green to-eco-teal flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold">EcoFlow AI</span>
        </Link>

        <div style={{ animation: "fadeUp 0.5s ease 0.15s both" }}>
          <h1 className="text-3xl font-black mb-1.5">Welcome back</h1>
          <p className="text-white/40 text-sm mb-8">Sign in to your EcoFlow account</p>
        </div>

        <div
          className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6 space-y-4"
          style={{ animation: "fadeUp 0.6s ease 0.25s both" }}
        >
          <div className="text-center pb-2">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-eco-green/20 to-eco-teal/20 border border-eco-green/20 flex items-center justify-center mx-auto mb-3">
              <Leaf className="h-6 w-6 text-eco-green" />
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Secure authentication is handled by the EcoFlow platform. Click below to sign in or create your account.
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="glow-btn w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-eco-green text-white font-bold text-base transition-all hover:bg-eco-green/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="h-4 w-4" />
            Sign In / Create Account
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div
          className="mt-8 grid grid-cols-3 gap-3"
          style={{ animation: "fadeUp 0.6s ease 0.4s both" }}
        >
          {[
            { value: "2,800+", label: "Active drivers" },
            { value: "18.4K", label: "Tokens issued" },
            { value: "4.2t", label: "CO₂ saved" },
          ].map(s => (
            <div key={s.label} className="text-center rounded-xl bg-white/3 border border-white/5 py-3 px-2">
              <p className="text-base font-bold text-eco-green">{s.value}</p>
              <p className="text-[10px] text-white/35 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          By signing in you agree to EcoFlow's Terms of Service
        </p>
      </div>
    </div>
  );
}