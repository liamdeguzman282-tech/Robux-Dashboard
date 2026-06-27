import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Check, Clock, RotateCcw, Shield, CalendarDays, Key, Infinity } from "lucide-react";
import RobuxIcon from "@/components/RobuxIcon";
import RobloxAvatar from "@/components/RobloxAvatar";
import { loadSession, isSessionValid, daysRemaining } from "@/lib/keys";

export interface Transaction {
  username: string;
  amount: number;
  timestamp: Date;
}

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  robuxBalance: number;
  onBalanceChange: (bal: number) => void;
  transactions: Transaction[];
  onReset: () => void;
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function fmt(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const TYPE_STYLE = {
  "7-Day":    { color: "text-blue-400",   bg: "bg-blue-500/15",   border: "border-blue-500/30",   label: "7-Day Access"    },
  "30-Day":   { color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/30", label: "30-Day Access"   },
  "Lifetime": { color: "text-amber-400",  bg: "bg-amber-500/15",  border: "border-amber-500/30",  label: "Lifetime Access" },
} as const;

function KeyStatus() {
  const session = loadSession();
  if (!session || !isSessionValid(session)) {
    return (
      <div className="bg-secondary/40 rounded-2xl border border-border p-4 flex items-center gap-3">
        <Shield className="w-5 h-5 text-muted-foreground/40" />
        <span className="text-muted-foreground text-sm">No active key</span>
      </div>
    );
  }

  const days = daysRemaining(session);
  const style = TYPE_STYLE[session.type] ?? TYPE_STYLE["Lifetime"];
  const maskedKey = session.key.slice(0, 5) + "••••-••••-" + session.key.slice(-4);

  let pct = 100;
  if (session.expiresAt !== null) {
    const total = session.expiresAt - session.activatedAt;
    const elapsed = Date.now() - session.activatedAt;
    pct = Math.max(0, Math.min(100, ((total - elapsed) / total) * 100));
  }

  return (
    <div className={`rounded-2xl border p-4 flex flex-col gap-3 ${style.bg} ${style.border}`}>
      {/* Type label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${style.color}`} />
          <span className={`font-bold text-sm ${style.color}`}>{style.label}</span>
        </div>
        {days === null
          ? <span className={`flex items-center gap-1 text-xs font-bold ${style.color}`}><Infinity className="w-3.5 h-3.5" /> Forever</span>
          : <span className={`text-xs font-black ${style.color}`}>{days}d left</span>
        }
      </div>

      {/* Key */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5"><Key className="w-3 h-3" /> Key</span>
        <span className={`font-mono font-bold ${style.color}`}>{maskedKey}</span>
      </div>

      {/* Activated */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5"><CalendarDays className="w-3 h-3" /> Activated</span>
        <span className="font-semibold text-foreground">{fmt(session.activatedAt)}</span>
      </div>

      {/* Expires */}
      {session.expiresAt !== null && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5"><CalendarDays className="w-3 h-3" /> Expires</span>
          <span className="font-semibold text-foreground">{fmt(session.expiresAt)}</span>
        </div>
      )}

      {/* Progress bar */}
      {session.expiresAt !== null && (
        <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full rounded-full ${style.color.replace("text-", "bg-")}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function SettingsDrawer({ isOpen, onClose, username, robuxBalance, onBalanceChange, transactions, onReset }: SettingsDrawerProps) {
  const [editingBalance, setEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState(String(robuxBalance));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingBalance) inputRef.current?.focus();
  }, [editingBalance]);

  useEffect(() => {
    if (!editingBalance) setBalanceInput(String(robuxBalance));
  }, [robuxBalance, editingBalance]);

  function commitBalance() {
    const num = parseInt(balanceInput.replace(/,/g, ""), 10);
    if (!isNaN(num) && num >= 0) onBalanceChange(num);
    else setBalanceInput(String(robuxBalance));
    setEditingBalance(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-card rounded-t-3xl shadow-2xl overflow-hidden"
            style={{ maxHeight: "88dvh", overflowY: "auto" }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="font-bold text-base text-foreground">Settings</span>
              <button onClick={onClose} className="text-foreground/60 hover:text-foreground transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-5 flex flex-col gap-6">

              {/* Profile */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-3 uppercase tracking-wide">Profile</p>
                <div className="bg-secondary/40 rounded-2xl border border-border p-4 flex items-center gap-4">
                  <RobloxAvatar username={username} size="w-14 h-14" ringClass="ring-2 ring-border" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-bold text-foreground text-base truncate">{username}</span>
                    <span className="text-muted-foreground text-sm">@{username.toLowerCase()}</span>
                  </div>
                </div>
              </div>

              {/* Access Key Status */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-3 uppercase tracking-wide">Access Key</p>
                <KeyStatus />
              </div>

              {/* Robux balance editor */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-3 uppercase tracking-wide">Robux Balance</p>
                <div className="bg-secondary/40 rounded-2xl border border-border p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <RobuxIcon className="w-5 h-5" />
                    {editingBalance ? (
                      <input
                        ref={inputRef}
                        data-testid="input-settings-balance"
                        value={balanceInput}
                        onChange={e => setBalanceInput(e.target.value)}
                        onBlur={commitBalance}
                        onKeyDown={e => { if (e.key === "Enter") commitBalance(); if (e.key === "Escape") setEditingBalance(false); }}
                        className="bg-secondary text-foreground font-bold text-lg rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-primary w-36 border border-border"
                      />
                    ) : (
                      <span className="font-bold text-foreground text-lg">{robuxBalance.toLocaleString()}</span>
                    )}
                  </div>
                  {editingBalance ? (
                    <button
                      onClick={commitBalance}
                      className="bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                  ) : (
                    <button
                      data-testid="button-edit-balance"
                      onClick={() => { setEditingBalance(true); setBalanceInput(String(robuxBalance)); }}
                      className="flex items-center gap-1.5 bg-secondary hover:bg-secondary/70 text-foreground text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-border"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Transaction log */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">Send History</p>
                  {transactions.length > 0 && (
                    <span className="text-muted-foreground text-xs">{transactions.length} transaction{transactions.length !== 1 ? "s" : ""}</span>
                  )}
                </div>

                {transactions.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <Clock className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-sm">No transactions yet</p>
                    <p className="text-muted-foreground/60 text-xs">Robux you send will appear here</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {transactions.map((tx, i) => (
                      <div
                        key={i}
                        data-testid={`tx-${i}`}
                        className="flex items-center gap-3 bg-secondary/40 rounded-2xl border border-border p-3"
                      >
                        <RobloxAvatar username={tx.username} size="w-10 h-10" ringClass="ring-1 ring-border" />
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <span className="font-semibold text-foreground text-sm truncate">{tx.username}</span>
                          <span className="text-muted-foreground text-xs">{timeAgo(tx.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <RobuxIcon className="w-3.5 h-3.5" />
                          <span className="font-bold text-foreground text-sm">−{tx.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-3 uppercase tracking-wide">Danger Zone</p>
                <button
                  onClick={() => { onReset(); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-3.5 rounded-xl transition-colors border border-red-500/30 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset everything to defaults
                </button>
                <p className="text-muted-foreground/60 text-xs text-center mt-2">Clears balance, username, and all transaction history</p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
