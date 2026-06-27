import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Loader2, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { createSession, saveSession, type KeySession, type KeyType } from "@/lib/keys";

interface KeyGateProps {
  onUnlock: (session: KeySession) => void;
}

const TYPE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  "7-Day":    { label: "7-Day Access",    color: "text-blue-400",   bg: "bg-blue-500/15 border-blue-500/40"   },
  "30-Day":   { label: "30-Day Access",   color: "text-violet-400", bg: "bg-violet-500/15 border-violet-500/40" },
  "Lifetime": { label: "Lifetime Access", color: "text-amber-400",  bg: "bg-amber-500/15 border-amber-500/40"  },
};

export default function KeyGate({ onUnlock }: KeyGateProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ label: string; color: string; bg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed) { setError("Please enter an access key."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/keys/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: trimmed }),
      });

      const data = await res.json() as { type?: string; days?: number | null; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const type = data.type as KeyType;
      const days = data.days ?? null;
      const style = TYPE_STYLE[type];
      setSuccess(style);
      setLoading(false);

      setTimeout(() => {
        const session = createSession({ key: trimmed.toUpperCase(), type, days });
        saveSession(session);
        onUnlock(session);
      }, 1400);
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  function handleInput(val: string) {
    setInput(val.toUpperCase());
    setError("");
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 220 }}
        className="relative w-full max-w-sm mx-4 bg-card border border-card-border rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="h-1 w-full bg-gradient-to-r from-primary via-violet-500 to-amber-400" />

        <div className="px-7 py-8 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>

          <div className="text-center">
            <h1 className="text-xl font-black text-foreground tracking-tight">Premium Access Required</h1>
            <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
              Enter your access key to continue.<br />
              Keys are available for 7-day, 30-day, and lifetime plans.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={input}
                onChange={e => handleInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !loading && !success && handleSubmit()}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                spellCheck={false}
                autoComplete="off"
                className="w-full bg-secondary border border-border rounded-xl py-3 pl-10 pr-4 font-mono text-sm font-bold tracking-widest text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground/50"
              />
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-3 border ${success.bg}`}
                >
                  <CheckCircle className={`w-4 h-4 shrink-0 ${success.color}`} />
                  <span className={`font-bold text-sm ${success.color}`}>{success.label} — Unlocking…</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleSubmit}
              disabled={loading || !!success}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying…</>
                : success
                  ? <><CheckCircle className="w-5 h-5" /> Unlocked!</>
                  : "Unlock Access"
              }
            </button>
          </div>

          <p className="text-muted-foreground/50 text-xs text-center">
            Contact your seller to obtain a valid access key.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
