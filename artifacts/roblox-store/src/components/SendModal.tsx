import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2, Check } from "lucide-react";
import RobuxIcon from "@/components/RobuxIcon";
import RobloxAvatar from "@/components/RobloxAvatar";

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  robuxBalance: number;
  sentHistory: string[];
  onSent: (username: string, amount: number) => void;
}

const SUGGESTED_USERS = ["Roblox", "builderman", "alexnewtron", "Stickmasterluke", "Merely"];

export default function SendModal({ isOpen, onClose, robuxBalance, sentHistory, onSent }: SendModalProps) {

  const [stage, setStage] = useState<"search" | "amount" | "confirm" | "success">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUsername, setFoundUsername] = useState<string | null>(null);
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
        setFoundUsername(null);
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
      const data = await res.json() as { id: number; name: string; imageUrl: string | null };
      if (data?.name) {
        setFoundUsername(data.name);
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
      if (foundUsername) onSent(foundUsername, amount);
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
            className="relative w-full max-w-md bg-[#16181f] rounded-t-3xl shadow-2xl overflow-hidden"
            style={{ maxHeight: "90dvh", overflowY: "auto" }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <RobuxIcon className="w-5 h-5 text-white" />
                <span className="font-bold text-base text-white">Send Robux</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white/8 rounded-full px-3 py-1">
                  <RobuxIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-sm font-bold text-white">{robuxBalance.toLocaleString()}</span>
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
                    data-testid="input-search-username"
                    type="text"
                    placeholder="Search by Roblox username..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setNotFound(false); }}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    className="w-full bg-white/8 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary text-sm border border-white/8 focus:border-primary/50 transition-all"
                  />
                </div>

                {notFound && (
                  <p className="text-red-400 text-sm text-center">User not found on Roblox.</p>
                )}

                {/* Recently sent history */}
                {sentHistory.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold mb-3 uppercase tracking-wide">Recently Sent</p>
                    <div className="flex flex-col gap-1">
                      {sentHistory.map(u => (
                        <button
                          key={u}
                          data-testid={`button-history-${u.toLowerCase()}`}
                          onClick={() => { setSearchQuery(u); handleSearch(u); }}
                          className="flex items-center gap-3 w-full bg-white/6 hover:bg-white/12 text-white text-sm font-medium px-3 py-2.5 rounded-xl transition-colors border border-white/8 text-left"
                        >
                          <RobloxAvatar username={u} size="w-9 h-9" ringClass="ring-1 ring-white/20" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-white text-sm">{u}</span>
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
                      <button
                        key={u}
                        data-testid={`button-suggest-${u.toLowerCase()}`}
                        onClick={() => { setSearchQuery(u); handleSearch(u); }}
                        className="flex items-center gap-2 bg-white/8 hover:bg-white/14 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors border border-white/8"
                      >
                        <RobloxAvatar username={u} size="w-6 h-6" ringClass="ring-1 ring-white/20" />
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  data-testid="button-search-submit"
                  onClick={() => handleSearch()}
                  disabled={isVerifying || !searchQuery.trim()}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
                >
                  {isVerifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Looking up...</> : "Search"}
                </button>
              </div>
            )}

            {/* Stage: amount */}
            {stage === "amount" && foundUsername && (
              <div className="px-5 py-6 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 pt-2">
                  <RobloxAvatar username={foundUsername} size="w-20 h-20" ringClass="ring-3 ring-white/20" />
                  <div className="text-center">
                    <p className="font-bold text-white text-lg">{foundUsername}</p>
                    <p className="text-muted-foreground text-sm">@{foundUsername.toLowerCase()}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-3">
                    <RobuxIcon className="w-9 h-9 text-white" />
                    <input
                      data-testid="input-robux-amount"
                      type="number"
                      min="0"
                      value={customInput}
                      onChange={e => handleCustomInput(e.target.value)}
                      placeholder="0"
                      className="bg-transparent text-white font-bold text-5xl outline-none w-36 text-left [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  {amount > robuxBalance && (
                    <p className="text-red-400 text-xs">Exceeds your balance of {robuxBalance.toLocaleString()}</p>
                  )}
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                  {[25, 50, 100, 200].map(val => (
                    <button
                      key={val}
                      data-testid={`button-quick-add-${val}`}
                      onClick={() => addAmount(val)}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/18 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors border border-white/10"
                    >
                      <RobuxIcon className="w-3.5 h-3.5 text-amber-400" />
                      {val}
                    </button>
                  ))}
                </div>

                <button
                  data-testid="button-next"
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
            {stage === "confirm" && foundUsername && (
              <div className="px-5 py-6 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3 bg-white/5 rounded-2xl p-5 border border-white/8">
                  <RobloxAvatar username={foundUsername} size="w-16 h-16" ringClass="ring-2 ring-white/20" />
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Sending to</p>
                    <p className="font-bold text-white text-lg">{foundUsername}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <RobuxIcon className="w-7 h-7 text-amber-400" />
                    <span className="font-black text-white text-4xl">{amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStage("amount")}
                    className="flex-1 bg-white/8 hover:bg-white/14 text-white font-bold py-4 rounded-xl transition-colors border border-white/10"
                  >
                    Back
                  </button>
                  <button
                    data-testid="button-confirm-send"
                    onClick={handleSend}
                    disabled={isLoading}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send"}
                  </button>
                </div>
                <p className="text-center text-muted-foreground text-xs">Robux are sent instantly with no fees</p>
              </div>
            )}

            {/* Stage: success */}
            {stage === "success" && foundUsername && (
              <div className="px-5 py-10 flex flex-col items-center gap-5 text-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <button
                  data-testid="button-done"
                  onClick={onClose}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors mt-2"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
