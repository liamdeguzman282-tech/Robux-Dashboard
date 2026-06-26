import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2, Check, Users, UserPlus, Calendar } from "lucide-react";
import RobuxIcon from "@/components/RobuxIcon";
import RobloxAvatar from "@/components/RobloxAvatar";

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  robuxBalance: number;
  sentHistory: string[];
  onSent: (username: string, amount: number) => void;
}

interface RobloxProfile {
  name: string;
  displayName: string;
  created: string;
  friendsCount: number;
  followersCount: number;
}

const SUGGESTED_USERS = ["Roblox", "builderman", "alexnewtron", "Stickmasterluke", "Merely"];

function formatJoined(created: string): string {
  if (!created) return "Unknown";
  try {
    const d = new Date(created);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "Unknown";
  }
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

export default function SendModal({ isOpen, onClose, robuxBalance, sentHistory, onSent }: SendModalProps) {
  const [stage, setStage] = useState<"search" | "amount" | "confirm" | "success">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [profile, setProfile] = useState<RobloxProfile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [amount, setAmount] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStage("search");
        setSearchQuery("");
        setProfile(null);
        setNotFound(false);
        setAmount(0);
        setCustomInput("");
        setIsLoading(false);
      }, 350);
    }
  }, [isOpen]);

  async function handleSearch(query = searchQuery) {
    const q = query.trim();
    if (!q) return;
    setIsVerifying(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/roblox/avatar?username=${encodeURIComponent(q)}`);
      if (!res.ok) { setNotFound(true); return; }
      const data = await res.json() as {
        id: number; name: string; displayName: string;
        imageUrl: string | null; created: string;
        friendsCount: number; followersCount: number;
      };
      if (data?.name) {
        setProfile({
          name: data.name,
          displayName: data.displayName ?? data.name,
          created: data.created ?? "",
          friendsCount: data.friendsCount ?? 0,
          followersCount: data.followersCount ?? 0,
        });
        setStage("amount");
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setIsVerifying(false);
    }
  }

  function addAmount(val: number) {
    const next = amount + val;
    setAmount(next);
    setCustomInput(String(next));
  }

  function handleCustomInput(val: string) {
    setCustomInput(val);
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 0) setAmount(n);
    else if (val === "") setAmount(0);
  }

  function handleSend() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStage("success");
      if (profile) onSent(profile.name, amount);
    }, 1500);
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
            style={{ maxHeight: "90dvh", overflowY: "auto" }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <RobuxIcon className="w-5 h-5" />
                <span className="font-bold text-base text-foreground">Send Robux</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1">
                  <RobuxIcon className="w-3.5 h-3.5" />
                  <span className="text-sm font-bold text-foreground">{robuxBalance.toLocaleString()}</span>
                </div>
                <button onClick={onClose} className="text-foreground/60 hover:text-foreground transition-colors p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stage: search */}
            {stage === "search" && (
              <div className="px-5 py-6 flex flex-col gap-5">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by Roblox username..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setNotFound(false); }}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    className="w-full bg-secondary text-foreground rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary text-sm border border-border focus:border-primary/50 transition-all"
                  />
                </div>

                {notFound && <p className="text-red-400 text-sm text-center">User not found on Roblox.</p>}

                {sentHistory.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold mb-3 uppercase tracking-wide">Recently Sent</p>
                    <div className="flex flex-col gap-1">
                      {sentHistory.map(u => (
                        <button key={u}
                          onClick={() => { setSearchQuery(u); handleSearch(u); }}
                          className="flex items-center gap-3 w-full bg-secondary/50 hover:bg-secondary text-foreground text-sm font-medium px-3 py-2.5 rounded-xl transition-colors border border-border text-left"
                        >
                          <RobloxAvatar username={u} size="w-9 h-9" ringClass="ring-1 ring-border" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground text-sm">{u}</span>
                            <span className="text-muted-foreground text-xs">@{u.toLowerCase()}</span>
                          </div>
                          <span className="ml-auto text-muted-foreground text-xs">Tap to send</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-muted-foreground text-xs font-semibold mb-3 uppercase tracking-wide">Quick select</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_USERS.map(u => (
                      <button key={u}
                        onClick={() => { setSearchQuery(u); handleSearch(u); }}
                        className="flex items-center gap-2 bg-secondary hover:bg-secondary/70 text-foreground text-sm font-medium px-3 py-2 rounded-xl transition-colors border border-border"
                      >
                        <RobloxAvatar username={u} size="w-6 h-6" ringClass="ring-1 ring-border" />
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSearch()}
                  disabled={isVerifying || !searchQuery.trim()}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
                >
                  {isVerifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Looking up...</> : "Search"}
                </button>
              </div>
            )}

            {/* Stage: amount */}
            {stage === "amount" && profile && (
              <div className="px-5 py-6 flex flex-col gap-5">
                {/* Profile card */}
                <div className="bg-secondary/40 rounded-2xl border border-border p-4 flex flex-col items-center gap-3">
                  <RobloxAvatar username={profile.name} size="w-20 h-20" ringClass="ring-2 ring-border" />
                  <div className="text-center">
                    <p className="font-black text-foreground text-lg leading-tight">{profile.displayName}</p>
                    <p className="text-muted-foreground text-sm">@{profile.name}</p>
                  </div>
                  <div className="w-full grid grid-cols-3 gap-2 mt-1">
                    <div className="flex flex-col items-center gap-1 bg-card rounded-xl p-2 border border-border">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">Joined</span>
                      <span className="text-[10px] font-bold text-foreground text-center leading-tight">{formatJoined(profile.created)}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 bg-card rounded-xl p-2 border border-border">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Friends</span>
                      <span className="text-sm font-black text-foreground">{formatCount(profile.friendsCount)}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 bg-card rounded-xl p-2 border border-border">
                      <UserPlus className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Followers</span>
                      <span className="text-sm font-black text-foreground">{formatCount(profile.followersCount)}</span>
                    </div>
                  </div>
                </div>

                {/* Amount input */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-3">
                    <RobuxIcon className="w-9 h-9" />
                    <input
                      type="number" min="0"
                      value={customInput}
                      onChange={e => handleCustomInput(e.target.value)}
                      placeholder="0"
                      className="bg-transparent text-foreground font-bold text-5xl outline-none w-36 text-left [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  {amount > robuxBalance && (
                    <p className="text-red-400 text-xs">Exceeds your balance of {robuxBalance.toLocaleString()}</p>
                  )}
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                  {[25, 50, 100, 200].map(val => (
                    <button key={val} onClick={() => addAmount(val)}
                      className="flex items-center gap-1.5 bg-secondary hover:bg-secondary/70 text-foreground text-sm font-bold px-4 py-2.5 rounded-xl transition-colors border border-border"
                    >
                      <RobuxIcon className="w-3.5 h-3.5" />{val}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => amount > 0 && amount <= robuxBalance && setStage("confirm")}
                  disabled={amount <= 0 || amount > robuxBalance}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-base"
                >
                  Next
                </button>
                <p className="text-center text-muted-foreground text-xs">Robux are sent instantly with no fees</p>
              </div>
            )}

            {/* Stage: confirm */}
            {stage === "confirm" && profile && (
              <div className="px-5 py-6 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3 bg-secondary/40 rounded-2xl p-5 border border-border">
                  <RobloxAvatar username={profile.name} size="w-16 h-16" ringClass="ring-2 ring-border" />
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Sending to</p>
                    <p className="font-bold text-foreground text-lg">{profile.displayName}</p>
                    <p className="text-muted-foreground text-xs">@{profile.name}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <RobuxIcon className="w-7 h-7" />
                    <span className="font-black text-foreground text-4xl">{amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStage("amount")}
                    className="flex-1 bg-secondary hover:bg-secondary/70 text-foreground font-bold py-4 rounded-xl transition-colors border border-border"
                  >Back</button>
                  <button onClick={handleSend} disabled={isLoading}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send"}
                  </button>
                </div>
                <p className="text-center text-muted-foreground text-xs">Robux are sent instantly with no fees</p>
              </div>
            )}

            {/* Stage: success */}
            {stage === "success" && profile && (
              <div className="px-5 py-10 flex flex-col items-center gap-5 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <p className="text-foreground font-bold text-lg">
                    Sent {amount.toLocaleString()} Robux to {profile.displayName}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">@{profile.name}</p>
                </motion.div>
                <button onClick={onClose}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors mt-2"
                >Done</button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
