import { useState, useRef, useEffect } from "react";
import { Menu, Search, Settings, Pencil, Check, Sun, Moon } from "lucide-react";
import RobuxIcon from "@/components/RobuxIcon";
import RobloxAvatar from "@/components/RobloxAvatar";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  username: string;
  robuxBalance: number;
  onUsernameChange: (name: string) => void;
  onBalanceChange: (bal: number) => void;
  onSendClick: () => void;
  onSettingsClick: () => void;
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

      {/* ── Row 1: Logo + right controls ── */}
      <div className="flex items-center justify-between px-4 h-[52px]">

        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button data-testid="button-hamburger" className="text-foreground/70 hover:text-foreground transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <img src="/roblox-icon.jpg" alt="Roblox" className="h-7 w-7 rounded-lg object-cover" />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">

          {/* Avatar (always visible) */}
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

          {/* Search — desktop only */}
          <button data-testid="button-search" className="hidden lg:flex text-foreground/70 hover:text-foreground transition-colors p-1.5">
            <Search className="h-5 w-5" />
          </button>

          {/* Robux balance (always visible) */}
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

          {/* Theme toggle */}
          <button
            data-testid="button-theme-toggle"
            onClick={toggle}
            className="text-foreground/70 hover:text-foreground transition-colors p-1.5"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Settings (always visible) */}
          <button data-testid="button-settings" onClick={onSettingsClick} className="text-foreground/70 hover:text-foreground transition-colors p-1.5">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── Row 2: Nav + Send (desktop only) ── */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3 border-t-2 border-border bg-secondary/20">
        <nav className="flex items-center gap-7 text-sm font-semibold text-foreground/60">
          <button className="hover:text-foreground transition-colors">Charts</button>
          <button className="hover:text-foreground transition-colors">Marketplace</button>
          <button className="hover:text-foreground transition-colors">Create</button>
          <span className="w-px h-4 bg-border" />
          <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <RobuxIcon className="w-4 h-4" />
            <span className="text-amber-500 font-bold">{robuxBalance.toLocaleString()}</span>
          </button>
        </nav>
        <button
          data-testid="button-send"
          onClick={onSendClick}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors"
        >
          <span className="text-base leading-none">↑</span> Send Robux
        </button>
      </div>

      {/* ── Row 2 mobile: slim Send bar ── */}
      <div className="flex lg:hidden items-center justify-between px-4 py-2 border-t border-border">
        <nav className="flex items-center gap-4 text-xs font-semibold text-foreground/50">
          <button className="hover:text-foreground transition-colors">Charts</button>
          <button className="hover:text-foreground transition-colors">Marketplace</button>
          <button className="hover:text-foreground transition-colors">Create</button>
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
