import { useState, useEffect } from "react";
import Header from "@/components/Header";
import AvatarItemCard from "@/components/AvatarItemCard";
import RobuxPackageRow from "@/components/RobuxPackageRow";
import FAQSection from "@/components/FAQSection";
import PageFooter from "@/components/PageFooter";
import SendModal from "@/components/SendModal";
import BuyModal, { type Package } from "@/components/BuyModal";
import SettingsDrawer, { type Transaction } from "@/components/SettingsDrawer";
import { useCountdown } from "@/hooks/useCountdown";

const FedoraIcon = () => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="58" rx="32" ry="7" fill="url(#brimG)" opacity="0.9"/>
    <path d="M18 52 Q20 36 40 34 Q60 36 62 52 Z" fill="url(#hatG)"/>
    <path d="M28 34 Q30 20 40 18 Q50 20 52 34 Z" fill="url(#crownG)"/>
    <path d="M22 50 Q30 42 38 40 Q46 42 58 50" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <ellipse cx="40" cy="34" rx="12" ry="3" fill="#1d4ed8" opacity="0.6"/>
    <circle cx="30" cy="44" r="2" fill="#bfdbfe" opacity="0.8"/>
    <circle cx="50" cy="42" r="1.5" fill="#bfdbfe" opacity="0.6"/>
    <circle cx="40" cy="30" r="1" fill="#e0f2fe" opacity="0.9"/>
    <defs>
      <linearGradient id="brimG" x1="8" y1="51" x2="72" y2="65" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e3a5f"/>
        <stop offset="100%" stopColor="#0f1f3d"/>
      </linearGradient>
      <linearGradient id="hatG" x1="18" y1="34" x2="62" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1d4ed8"/>
        <stop offset="100%" stopColor="#1e3a8a"/>
      </linearGradient>
      <linearGradient id="crownG" x1="28" y1="18" x2="52" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60a5fa"/>
        <stop offset="100%" stopColor="#2563eb"/>
      </linearGradient>
    </defs>
  </svg>
);

const SunMoonWingsIcon = () => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 55 C28 38 6 30 2 18 C14 23 28 34 40 55Z" fill="url(#wSilver)" opacity="0.95"/>
    <path d="M40 55 C36 35 12 20 6 10 C20 17 34 32 40 55Z" fill="url(#wSilver2)" opacity="0.7"/>
    <path d="M40 55 C52 38 74 30 78 18 C66 23 52 34 40 55Z" fill="url(#wGold)" opacity="0.95"/>
    <path d="M40 55 C44 35 68 20 74 10 C60 17 46 32 40 55Z" fill="url(#wGold2)" opacity="0.7"/>
    <circle cx="30" cy="28" r="3" fill="#e2e8f0" opacity="0.6"/>
    <circle cx="52" cy="26" r="2.5" fill="#fbbf24" opacity="0.7"/>
    <defs>
      <linearGradient id="wSilver" x1="2" y1="18" x2="40" y2="55" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e2e8f0"/>
        <stop offset="100%" stopColor="#94a3b8"/>
      </linearGradient>
      <linearGradient id="wSilver2" x1="6" y1="10" x2="40" y2="55" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#cbd5e1"/>
        <stop offset="100%" stopColor="#64748b"/>
      </linearGradient>
      <linearGradient id="wGold" x1="78" y1="18" x2="40" y2="55" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde68a"/>
        <stop offset="100%" stopColor="#d97706"/>
      </linearGradient>
      <linearGradient id="wGold2" x1="74" y1="10" x2="40" y2="55" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24"/>
        <stop offset="100%" stopColor="#b45309"/>
      </linearGradient>
    </defs>
  </svg>
);

const PACKAGES = [
  { amount: "5,250", original: "4,500", price: "₱3,400.00" },
  { amount: "3,625", original: "3,150", price: "₱1,990.00" },
  { amount: "2,000", original: "1,700", price: "₱1,360.00" },
  { amount: "1,500", original: "1,200", price: "₱799.00"   },
  { amount: "1,000", original: "800",   price: "₱680.00"   },
  { amount: "500",   original: "400",   price: "₱350.00"   },
];

const DEFAULTS = { username: "MyUser", robuxBalance: 14231, transactions: [] as Transaction[] };

function loadState() {
  try {
    const raw = localStorage.getItem("roblox-store-state");
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return {
      username: parsed.username ?? DEFAULTS.username,
      robuxBalance: parsed.robuxBalance ?? DEFAULTS.robuxBalance,
      transactions: (parsed.transactions ?? []).map((t: { username: string; amount: number; timestamp: string }) => ({
        ...t,
        timestamp: new Date(t.timestamp),
      })),
    };
  } catch {
    return DEFAULTS;
  }
}

export default function Home() {
  const saved = loadState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState(saved.username);
  const [robuxBalance, setRobuxBalance] = useState(saved.robuxBalance);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(saved.transactions);
  const [buyPkg, setBuyPkg] = useState<Package | null>(null);
  const { label: countdownLabel } = useCountdown();

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("roblox-store-state", JSON.stringify({ username, robuxBalance, transactions }));
  }, [username, robuxBalance, transactions]);

  function handleReset() {
    setUsername(DEFAULTS.username);
    setRobuxBalance(DEFAULTS.robuxBalance);
    setTransactions(DEFAULTS.transactions);
    localStorage.removeItem("roblox-store-state");
  }

  const sentHistory = [...new Map(transactions.map(t => [t.username.toLowerCase(), t.username])).values()];

  function handleSent(toUsername: string, amount: number) {
    setTransactions(prev => [{ username: toUsername, amount, timestamp: new Date() }, ...prev]);
    setRobuxBalance(prev => Math.max(0, prev - amount));
  }

  return (
    <div className="min-h-[100dvh] w-full bg-background relative wavy-bg">
      <Header
        username={username}
        robuxBalance={robuxBalance}
        onUsernameChange={setUsername}
        onBalanceChange={setRobuxBalance}
        onSendClick={() => setIsModalOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <main className="px-4 pt-6 pb-10 w-full max-w-md mx-auto flex flex-col gap-7">

        {/* Hero */}
        <div>
          <h1 className="text-4xl font-black text-foreground leading-tight tracking-tight">
            Enjoy up to 25%<br />more Robux
          </h1>
        </div>

        {/* Limited-time avatar items */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Limited-time avatar items</h2>
            <span className="bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-full">
              {countdownLabel}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <AvatarItemCard
              title="Arcane Fedora"
              value="24,000"
              original="22,500"
              price="₱13.6k"
              imageUrl=""
              itemIcon={<FedoraIcon />}
              onBuy={() => setBuyPkg({ amount: "24,000", original: "22,500", price: "₱13.6k" })}
              animateIcon
            />
            <AvatarItemCard
              title="Wings of the Sun and Moon"
              value="11,000"
              original="10,000"
              price="₱6,800.00"
              imageUrl=""
              itemIcon={<SunMoonWingsIcon />}
              onBuy={() => setBuyPkg({ amount: "11,000", original: "10,000", price: "₱6,800.00" })}
              animateIcon
            />
          </div>
        </section>

        {/* Robux packages */}
        <section>
          <h2 className="text-xl font-black text-foreground mb-1">Robux packages</h2>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            By purchasing Robux, you agree to our{" "}
            <span className="font-semibold text-foreground">Terms of Use</span>
            , including the arbitration clause and revocation policy.
          </p>
          <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
            {PACKAGES.map((pkg, i) => (
              <RobuxPackageRow
                key={pkg.amount}
                amount={pkg.amount}
                original={pkg.original}
                price={pkg.price}
                isLast={i === PACKAGES.length - 1}
                onBuy={() => setBuyPkg(pkg)}
              />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />

        {/* Footer */}
        <PageFooter />

      </main>

      <BuyModal
        key={buyPkg ? buyPkg.amount + buyPkg.price : "closed"}
        pkg={buyPkg}
        onClose={() => setBuyPkg(null)}
        onConfirm={(robux) => setRobuxBalance(prev => prev + robux)}
      />

      <SendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        robuxBalance={robuxBalance}
        sentHistory={sentHistory}
        onSent={handleSent}
      />

      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        username={username}
        robuxBalance={robuxBalance}
        onBalanceChange={setRobuxBalance}
        transactions={transactions}
        onReset={handleReset}
      />
    </div>
  );
}
