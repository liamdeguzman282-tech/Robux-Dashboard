import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Check, Clock, RotateCcw, Key, Copy, ChevronDown, ChevronUp } from "lucide-react";
import RobuxIcon from "@/components/RobuxIcon";
import RobloxAvatar from "@/components/RobloxAvatar";

export interface Transaction {
  username: string;
  amount: number;
  timestamp: Date;
}

interface StoredKey {
  type: "7-Day" | "30-Day" | "Lifetime";
  key: string;
  used: boolean;
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

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function seg() {
  return Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
}
function makeKey(prefix: string) {
  return `${prefix}-${seg()}-${seg()}-${seg()}`;
}

function loadOrGenerateKeys(): StoredKey[] {
  try {
    const raw = localStorage.getItem("roblox-store-keys");
    if (raw) return JSON.parse(raw) as StoredKey[];
  } catch { /* ignore */ }
  const keys: StoredKey[] = [
    ...Array.from({ length: 30 }, () => ({ type: "7-Day" as const,    key: makeKey("7D"),  used: false })),
    ...Array.from({ length: 30 }, () => ({ type: "30-Day" as const,   key: makeKey("30D"), used: false })),
    ...Array.from({ length: 30 }, () => ({ type: "Lifetime" as const, key: makeKey("LTM"), used: false })),
  ];
  localStorage.setItem("roblox-store-keys", JSON.stringify(keys));
  return keys;
}

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "7-Day":    { bg: "bg-blue-500/15",   text: "text-blue-400",   border: "border-blue-500/30"   },
  "30-Day":   { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-violet-500/30" },
  "Lifetime": { bg: "bg-amber-500/15",  text: "text-amber-400",  border: "border-amber-500/30"  },
};

export default function SettingsDrawer({ isOpen, onClose, username, robuxBalance, onBalanceChange, transactions, onReset }: SettingsDrawerProps) {
  const [editingBalance, setEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState(String(robuxBalance));
  const [keysOpen, setKeysOpen] = useState(false);
  const [keyTab, setKeyTab] = useState<"7-Day" | "30-Day" | "Lifetime">("7-Day");
  const [keys, setKeys] = useState<StoredKey[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setKeys(loadOrGenerateKeys());
  }, []);

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

  function copyKey(k: string) {
    navigator.clipboard.writeText(k).catch(() => {});
    setCopiedKey(k);
    setTimeout(() => setCopiedKey(null), 1800);
  }

  function markUsed(k: string) {
    const updated = keys.map(entry => entry.key === k ? { ...entry, used: !entry.used } : entry);
    setKeys(updated);
    localStorage.setItem("roblox-store-keys", JSON.stringify(updated));
  }

  const tabKeys = keys.filter(k => k.type === keyTab);
  const usedCount = tabKeys.filter(k => k.used).length;

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
            style={{ maxHeight: "92dvh", overflowY: "auto" }}
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
                    <button onClick={commitBalance} className="bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5">
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

              {/* Premium Keys */}
              <div>
                <button
                  onClick={() => setKeysOpen(v => !v)}
                  className="w-full flex items-center justify-between mb-3 group"
                >
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">Premium Keys</p>
                    <span className="text-xs bg-secondary text-muted-foreground rounded-full px-2 py-0.5 border border-border">90</span>
                  </div>
                  {keysOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                <AnimatePresence>
                  {keysOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {/* Tabs */}
                      <div className="flex gap-1.5 mb-3">
                        {(["7-Day", "30-Day", "Lifetime"] as const).map(t => {
                          const c = TYPE_COLORS[t];
                          const isActive = keyTab === t;
                          return (
                            <button
                              key={t}
                              onClick={() => setKeyTab(t)}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${isActive ? `${c.bg} ${c.text} ${c.border}` : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary"}`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>

                      <p className="text-muted-foreground/60 text-xs mb-2">{usedCount}/{tabKeys.length} used</p>

                      <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                        {tabKeys.map(({ key, used }) => {
                          const c = TYPE_COLORS[keyTab];
                          return (
                            <div
                              key={key}
                              className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition-opacity ${used ? "opacity-40" : ""} ${c.bg} ${c.border}`}
                            >
                              <span className={`font-mono text-xs font-bold tracking-widest ${c.text} ${used ? "line-through" : ""}`}>
                                {key}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => copyKey(key)}
                                  title="Copy"
                                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                >
                                  {copiedKey === key
                                    ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => markUsed(key)}
                                  title={used ? "Mark unused" : "Mark used"}
                                  className={`text-xs font-semibold px-2 py-0.5 rounded-lg border transition-colors ${used ? "bg-secondary text-muted-foreground border-border" : `${c.bg} ${c.text} ${c.border}`}`}
                                >
                                  {used ? "Unused" : "Used"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                      <div key={i} data-testid={`tx-${i}`} className="flex items-center gap-3 bg-secondary/40 rounded-2xl border border-border p-3">
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
