import { useState, useRef, useEffect } from "react";
import { Menu, Search, Settings, Pencil, Check } from "lucide-react";
import { SiRoblox } from "react-icons/si";
import RobuxIcon from "@/components/RobuxIcon";
import RobloxAvatar from "@/components/RobloxAvatar";

interface HeaderProps {
  username: string;
  robuxBalance: number;
  onUsernameChange: (name: string) => void;
  onBalanceChange: (bal: number) => void;
  onSendClick: () => void;
}

export default function Header({ username, robuxBalance, onUsernameChange, onBalanceChange, onSendClick }: HeaderProps) {
  const [editingBalance, setEditingBalance] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [balanceInput, setBalanceInput] = useState(String(robuxBalance));
  const [usernameInput, setUsernameInput] = useState(username);
  const balanceRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingBalance) balanceRef.current?.focus();
  }, [editingBalance]);

  useEffect(() => {
    if (editingUsername) usernameRef.current?.focus();
  }, [editingUsername]);

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
    <header className="sticky top-0 z-40 w-full bg-[#13151a]/95 backdrop-blur-xl border-b border-white/8">
      {/* Main header row */}
      <div className="flex items-center justify-between px-4 h-[52px]">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button data-testid="button-hamburger" className="text-foreground/80 hover:text-foreground transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <div className="bg-white rounded-[6px] p-[3px] flex items-center justify-center">
            <SiRoblox className="text-black h-5 w-5" />
          </div>
        </div>

        {/* Right: icons row */}
        <div className="flex items-center gap-1.5">
          {/* Avatar — click to edit username */}
          <div className="relative">
            <button
              data-testid="button-avatar"
              onClick={() => { setEditingUsername(true); setUsernameInput(username); }}
              title={`@${username} — click to change`}
            >
              <RobloxAvatar username={username} size="w-[34px] h-[34px]" ringClass="ring-2 ring-white/25" />
            </button>

            {editingUsername && (
              <div className="absolute right-0 top-[42px] bg-[#1e2130] border border-white/10 rounded-2xl p-3 shadow-2xl flex items-center gap-2 z-50 min-w-[210px]">
                <input
                  ref={usernameRef}
                  data-testid="input-username"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") commitUsername(); if (e.key === "Escape") setEditingUsername(false); }}
                  placeholder="Roblox username"
                  className="flex-1 bg-white/8 text-white text-sm font-semibold rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary"
                />
                <button onClick={commitUsername} className="text-primary hover:text-primary/80">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <button data-testid="button-search" className="text-foreground/70 hover:text-foreground transition-colors p-1.5">
            <Search className="h-5 w-5" />
          </button>

          {/* Robux shield icon with notification dot */}
          <button data-testid="button-notifications" className="relative text-foreground/70 hover:text-foreground transition-colors p-1.5">
            <div className="w-8 h-8 rounded-full border-2 border-foreground/20 flex items-center justify-center">
              <RobuxIcon className="w-4 h-4 text-foreground/70" />
            </div>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-1 ring-[#13151a]" />
          </button>

          {/* Robux balance — click to edit */}
          <button
            data-testid="button-robux-balance"
            onClick={() => { setEditingBalance(true); setBalanceInput(String(robuxBalance)); }}
            className="flex items-center gap-1.5 bg-white/6 hover:bg-white/10 rounded-full px-3 py-1.5 transition-colors group"
          >
            <RobuxIcon className="w-4 h-4 text-amber-400" />
            {editingBalance ? (
              <input
                ref={balanceRef}
                data-testid="input-robux-balance"
                value={balanceInput}
                onChange={e => setBalanceInput(e.target.value)}
                onBlur={commitBalance}
                onKeyDown={e => { if (e.key === "Enter") commitBalance(); if (e.key === "Escape") setEditingBalance(false); }}
                className="w-20 bg-transparent text-white font-bold text-sm outline-none"
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="font-bold text-sm text-white">{robuxBalance.toLocaleString()}</span>
            )}
            <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button data-testid="button-settings" className="text-foreground/70 hover:text-foreground transition-colors p-1.5">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Sub-nav row */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
        <div className="flex items-center gap-5 text-sm font-semibold text-foreground/60">
          <button className="hover:text-foreground transition-colors">Charts</button>
          <button className="hover:text-foreground transition-colors">Marketplace</button>
          <button className="hover:text-foreground transition-colors">Create</button>
          <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <RobuxIcon className="w-4 h-4 text-foreground/60" />
            <span className="text-amber-400 font-bold">{robuxBalance.toLocaleString()}</span>
          </button>
        </div>
        <button
          data-testid="button-send"
          onClick={onSendClick}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-sm font-bold px-4 py-1.5 rounded-full transition-colors border border-white/15"
        >
          <span className="text-base leading-none">↑</span> Send
        </button>
      </div>
    </header>
  );
}
