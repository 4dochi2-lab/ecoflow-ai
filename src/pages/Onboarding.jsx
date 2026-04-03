import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Leaf, ArrowRight, ArrowLeft, CheckCircle, Car, Zap, Flame, User, MapPin, Hash } from "lucide-react";

const DISTRICTS = [
  "Sabail", "Yasamal", "Nasimi", "Khatai", "Binagadi",
  "Nizami", "Narimanov", "Surakhani", "Sabunchu", "Pirallahi",
  "Garadagh", "Khazar"
];

const VEHICLE_TYPES = [
  { value: "electric", label: "Electric", icon: Zap, desc: "Zero emissions · Max token rewards", color: "border-eco-green/40 bg-eco-green/8", activeColor: "border-eco-green bg-eco-green/15", iconColor: "text-eco-green" },
  { value: "hybrid", label: "Hybrid", icon: Car, desc: "Low emissions · High eco score", color: "border-eco-teal/40 bg-eco-teal/8", activeColor: "border-eco-teal bg-eco-teal/15", iconColor: "text-eco-teal" },
  { value: "gasoline", label: "ICE (Gasoline)", icon: Flame, desc: "Standard · Incentives to go green", color: "border-yellow-500/30 bg-yellow-500/5", activeColor: "border-yellow-400 bg-yellow-500/15", iconColor: "text-yellow-400" },
];

const STEPS = ["Profile", "Location", "Vehicle"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    district: "",
    plate: "",
    vehicle_type: "",
    vehicle_model: "",
  });

  useEffect(() => {
    async function init() {
      const me = await base44.auth.me();
      setUser(me);
      // Pre-fill name from auth
      setForm(f => ({ ...f, full_name: me.full_name || "" }));
      // Check if driver profile already exists
      const drivers = await base44.entities.Driver.filter({ created_by: me.email });
      if (drivers.length > 0) {
        navigate("/dashboard");
        return;
      }
      setLoading(false);
    }
    init();
  }, [navigate]);

  const canNext = () => {
    if (step === 0) return form.full_name.trim().length > 0;
    if (step === 1) return form.district !== "";
    if (step === 2) return form.vehicle_type !== "" && form.plate.trim().length > 0;
    return false;
  };

  const handleSubmit = async () => {
    setSaving(true);
    await base44.entities.Driver.create({
      full_name: form.full_name,
      vehicle_type: form.vehicle_type,
      vehicle_model: form.vehicle_model || form.plate,
      eco_score: 50,
      token_balance: 0,
      total_tokens_earned: 0,
      total_co2_saved_kg: 0,
      green_routes_taken: 0,
      electric_mode_switches: 0,
    });
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030d18] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-eco-green/30 border-t-eco-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030d18] text-white flex flex-col items-center justify-center px-4 py-12">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}</style>

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10 fade-up">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-eco-green to-eco-teal flex items-center justify-center">
          <Leaf className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold">EcoFlow AI</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#040f1e] border border-white/8 rounded-2xl overflow-hidden shadow-2xl fade-up">
        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-eco-green to-eco-teal transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-white/5">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex-1 py-3 text-center text-xs font-semibold transition-colors ${
                i === step ? "text-eco-green border-b-2 border-eco-green" :
                i < step ? "text-white/40" : "text-white/20"
              }`}
            >
              {i < step ? <CheckCircle className="h-3.5 w-3.5 mx-auto text-eco-green" /> : s}
            </div>
          ))}
        </div>

        <div className="p-7">
          {/* Step 0: Profile */}
          {step === 0 && (
            <div className="space-y-5 fade-up" key="step0">
              <div>
                <h2 className="text-xl font-black mb-1">Welcome to EcoFlow</h2>
                <p className="text-sm text-white/40">Let's set up your driver profile.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-9 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-eco-green/50 transition-colors"
                    placeholder="e.g. Anar Həsənov"
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-5 fade-up" key="step1">
              <div>
                <h2 className="text-xl font-black mb-1">Your District</h2>
                <p className="text-sm text-white/40">Where do you primarily drive in Baku?</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Residential District</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 z-10" />
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-9 text-sm text-white focus:outline-none focus:border-eco-green/50 transition-colors appearance-none"
                    value={form.district}
                    onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <option value="" disabled style={{ background: "#040f1e" }}>Select a district…</option>
                    {DISTRICTS.map(d => (
                      <option key={d} value={d} style={{ background: "#040f1e" }}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle */}
          {step === 2 && (
            <div className="space-y-5 fade-up" key="step2">
              <div>
                <h2 className="text-xl font-black mb-1">Your Vehicle</h2>
                <p className="text-sm text-white/40">This determines your token earning rate.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Plate Series</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-9 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-eco-green/50 transition-colors font-mono"
                    placeholder="e.g. 99-AB-001"
                    value={form.plate}
                    onChange={e => setForm(f => ({ ...f, plate: e.target.value.toUpperCase() }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Vehicle Category</label>
                <div className="space-y-2">
                  {VEHICLE_TYPES.map(vt => (
                    <button
                      key={vt.value}
                      onClick={() => setForm(f => ({ ...f, vehicle_type: vt.value }))}
                      className={`w-full flex items-center gap-4 p-3.5 rounded-xl border transition-all text-left ${
                        form.vehicle_type === vt.value ? vt.activeColor : vt.color
                      }`}
                    >
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${form.vehicle_type === vt.value ? "bg-white/10" : "bg-white/5"}`}>
                        <vt.icon className={`h-4 w-4 ${vt.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{vt.label}</p>
                        <p className="text-[11px] text-white/40">{vt.desc}</p>
                      </div>
                      <div className={`h-4 w-4 rounded-full border-2 transition-all ${form.vehicle_type === vt.value ? "border-eco-green bg-eco-green" : "border-white/20"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 disabled:opacity-0 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-eco-green text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-eco-green/90 transition-all"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canNext() || saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-eco-green text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-eco-green/90 transition-all"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Launch Dashboard <Zap className="h-4 w-4" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <p className="mt-5 text-xs text-white/20 fade-up">Step {step + 1} of {STEPS.length}</p>
    </div>
  );
}