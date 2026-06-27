import { useState, useRef, useEffect } from "react";
import { Menu, Search, Settings, Pencil, Check, Sun, Moon, Clock, Infinity, Shield, CalendarDays, Key } from "lucide-react";
import RobuxIcon from "@/components/RobuxIcon";
import RobloxAvatar from "@/components/RobloxAvatar";
import { useTheme } from "@/contexts/ThemeContext";
import { loadSession, isSessionValid, daysRemaining } from "@/lib/keys";

interface HeaderProps {
  username: string;
  robuxBalance: number;
  onUsernameChange: (name: string) => void;
  onBalanceChange: (bal: number) => void;
  onSendClick: () => void;
  onSettingsClick: () => void;
}

const TYPE_STYLE = {
  "7-Day":    { color: "text-blue-400",   bg: "bg-blue-500/15",   border: "border-blue-500/30",   label: "7-Day Access"    },
  "30-Day":   { color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/30", label: "30-Day Access"   },
  "Lifetime": { color: "text-amber-400",  bg: "bg-amber-500/15",  border: "border-amber-500/30",  label: "Lifetime Access" },
} as const;

function fmt(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function AccessBadge() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const session = loadSession();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!session || !isSessionValid(session)) return null;

  const days = daysRemaining(session);
  const style = TYPE_STYLE[session.type] ?? TYPE_STYLE["Lifetime"];
  const maskedKey = session.key.slice(0, 5) + "****-****-" + session.key.slice(-4);

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1 border rounded-full px-2.5 py-1 text-xs font-bold transition-opacity hover:opacity-80 ${style.bg} ${style.border} ${style.color}`}
      >
        {days === null
          ? <><Infinity className="w-3 h-3" /> Lifetime</>
          : <><Clock className="w-3 h-3" /> {days}d left</>
        }
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header stripe */}
          <div className={`h-1 w-full ${style.bg.replace("/15", "/60")}`} />

          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${style.color}`} />
              <span className={`font-bold text-sm ${style.color}`}>{style.label}</span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Key className="w-3 h-3" /> Key
                </span>
                <span className="font-mono font-bold text-foreground">{maskedKey}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="w-3 h-3" /> Activated
                </span>
                <span className="font-semibold text-foreground">{fmt(session.activatedAt)}</span>
              </div>

              {session.expiresAt !== null ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3" /> Expires
                    </span>
                    <span className="font-semibold text-foreground">{fmt(session.expiresAt)}</span>
                  </div>

                  <div className={`flex items-center justify-between rounded-xl px-3 py-2 border mt-1 ${style.bg} ${style.border}`}>
                    <span className={`font-semibold ${style.color}`}>Days remaining</span>
                    <span className={`font-black text-base ${style.color}`}>{days}</span>
                  </div>

                  {/* Progress bar */}
                  {(() => {
                    const total = session.expiresAt - session.activatedAt;
                    const elapsed = Date.now() - session.activatedAt;
                    const pct = Math.max(0, Math.min(100, ((total - elapsed) / total) * 100));
                    return (
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${style.color.replace("text-", "bg-")}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div className={`flex items-center justify-between rounded-xl px-3 py-2 border mt-1 ${style.bg} ${style.border}`}>
                  <span className={`font-semibold ${style.color}`}>Access</span>
                  <span className={`font-black ${style.color} flex items-center gap-1`}>
                    <Infinity className="w-4 h-4" /> Never expires
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header({ username, robuxBalance, onUsernameChange, onBalanceChange, onSendClick, onSettingsClick }: HeaderProps) {
  const { theme, toggle } = useTheme();
  const [editingBalance, setEditingBalance] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [balanceInput, setBalanceInput] = useState(String(robuxBalance));
  const [usernameInput, setUsernameInput] = useState(username);
  const balanceRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editingBalance) balanceRef.current?.focus(); }, [editingBalance]);
  useEffect(() => { if (editingUsername) usernameRef.current?.focus(); }, [editingUsername]);

  function commitBalance() {
    const num = parseInt(balanceInput.replace(/,/g, ""), 10);
    if (!isNaN(num) && num >= 0) onBalanceChange(num);
    else setBalanceInput(robuxBalance.toLocaleString());
    setEditingBalance(false);
  }

  function commitUsername() {
    const val = usernameInput.trim();
    if (val.length > 0) onUsernameChange(val);
    else setUsernameInput(username);
    setEditingUsername(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl border-b-2 border-border">

      <div className="flex items-center justify-between px-4 h-[52px]">
        <div className="flex items-center gap-3">
          <button data-testid="button-hamburger" className="text-foreground/70 hover:text-foreground transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <img
            src={theme === "dark" ? "/roblox-icon.jpg" : "/roblox-logo-light.jpg"}
            alt="Roblox"
            className="h-7 w-7 rounded-lg object-cover"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <AccessBadge />

          <div className="relative">
            <button
              data-testid="button-avatar"
              onClick={() => { setEditingUsername(true); setUsernameInput(username); }}
              title={`@${username} — click to change`}
            >
              <RobloxAvatar username={username} size="w-[32px] h-[32px]" ringClass="ring-2 ring-border" />
            </button>
            {editingUsername && (
              <div className="absolute right-0 top-[42px] bg-card border border-border rounded-2xl p-3 shadow-2xl flex items-center gap-2 z-50 min-w-[210px]">
                <input
                  ref={usernameRef}
                  data-testid="input-username"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") commitUsername(); if (e.key === "Escape") setEditingUsername(false); }}
                  placeholder="Roblox username"
                  className="flex-1 bg-secondary text-foreground text-sm font-semibold rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary"
                />
                <button onClick={commitUsername} className="text-primary hover:text-primary/80">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <button data-testid="button-search" className="hidden lg:flex text-foreground/70 hover:text-foreground transition-colors p-1.5">
            <Search className="h-5 w-5" />
          </button>

          <button
            data-testid="button-robux-balance"
            onClick={() => { setEditingBalance(true); setBalanceInput(String(robuxBalance)); }}
            className="flex items-center gap-1.5 bg-secondary/60 hover:bg-secondary rounded-full px-3 py-1.5 transition-colors group"
          >
            <RobuxIcon className="w-4 h-4" />
            {editingBalance ? (
              <input
                ref={balanceRef}
                data-testid="input-robux-balance"
                value={balanceInput}
                onChange={e => setBalanceInput(e.target.value)}
                onBlur={commitBalance}
                onKeyDown={e => { if (e.key === "Enter") commitBalance(); if (e.key === "Escape") setEditingBalance(false); }}
                className="w-16 bg-transparent text-foreground font-bold text-sm outline-none"
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="font-bold text-sm text-foreground">{robuxBalance.toLocaleString()}</span>
            )}
            <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            data-testid="button-theme-toggle"
            onClick={toggle}
            className="text-foreground/70 hover:text-foreground transition-colors p-1.5"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button data-testid="button-settings" onClick={onSettingsClick} className="text-foreground/70 hover:text-foreground transition-colors p-1.5">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-between px-6 py-3 border-t-2 border-border bg-secondary/20">
        <nav className="flex items-center gap-7 text-sm font-semibold text-foreground/60">
          <button className="hover:text-foreground transition-colors">Charts</button>
          <button className="hover:text-foreground transition-colors">Marketplace</button>
          <button className="hover:text-foreground transition-colors">Create</button>
          <button className="hover:text-foreground transition-colors">Robux</button>
        </nav>
        <button
          data-testid="button-send"
          onClick={onSendClick}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors"
        >
          <span className="text-base leading-none">↑</span> Send Robux
        </button>
      </div>

      <div className="flex lg:hidden items-center justify-between px-4 py-2 border-t border-border">
        <nav className="flex items-center gap-4 text-xs font-semibold text-foreground/50">
          <button className="hover:text-foreground transition-colors">Charts</button>
          <button className="hover:text-foreground transition-colors">Marketplace</button>
          <button className="hover:text-foreground transition-colors">Create</button>
          <button className="hover:text-foreground transition-colors">Robux</button>
        </nav>
        <button
          data-testid="button-send"
          onClick={onSendClick}
          className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
        >
          ↑ Send
        </button>
      </div>
    </header>
  );
}
