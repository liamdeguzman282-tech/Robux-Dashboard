import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Check, Clock } from "lucide-react";
import RobuxIcon from "@/components/RobuxIcon";
import RobloxAvatar from "@/components/RobloxAvatar";

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

export default function SettingsDrawer({ isOpen, onClose, username, robuxBalance, onBalanceChange, transactions }: SettingsDrawerProps) {
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
            className="relative w-full max-w-md bg-[#16181f] rounded-t-3xl shadow-2xl overflow-hidden"
            style={{ maxHeight: "88dvh", overflowY: "auto" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <span className="font-bold text-base text-white">Settings</span>
              <button onClick={onClose} className="text-foreground/60 hover:text-foreground transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-5 flex flex-col gap-6">

              {/* Profile section */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-3 uppercase tracking-wide">Profile</p>
                <div className="bg-white/5 rounded-2xl border border-white/8 p-4 flex items-center gap-4">
                  <RobloxAvatar username={username} size="w-14 h-14" ringClass="ring-2 ring-white/20" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-bold text-white text-base truncate">{username}</span>
                    <span className="text-muted-foreground text-sm">@{username.toLowerCase()}</span>
                  </div>
                </div>
              </div>

              {/* Robux balance editor */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-3 uppercase tracking-wide">Robux Balance</p>
                <div className="bg-white/5 rounded-2xl border border-white/8 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <RobuxIcon className="w-5 h-5 text-amber-400" />
                    {editingBalance ? (
                      <input
                        ref={inputRef}
                        data-testid="input-settings-balance"
                        value={balanceInput}
                        onChange={e => setBalanceInput(e.target.value)}
                        onBlur={commitBalance}
                        onKeyDown={e => { if (e.key === "Enter") commitBalance(); if (e.key === "Escape") setEditingBalance(false); }}
                        className="bg-white/10 text-white font-bold text-lg rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-primary w-36"
                      />
                    ) : (
                      <span className="font-bold text-white text-lg">{robuxBalance.toLocaleString()}</span>
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
                      className="flex items-center gap-1.5 bg-white/8 hover:bg-white/14 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-white/8"
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
                        className="flex items-center gap-3 bg-white/5 rounded-2xl border border-white/8 p-3"
                      >
                        <RobloxAvatar username={tx.username} size="w-10 h-10" ringClass="ring-1 ring-white/15" />
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <span className="font-semibold text-white text-sm truncate">{tx.username}</span>
                          <span className="text-muted-foreground text-xs">{timeAgo(tx.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <RobuxIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-white text-sm">−{tx.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
