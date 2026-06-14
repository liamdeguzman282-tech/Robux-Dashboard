import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import AvatarItemCard from "@/components/AvatarItemCard";
import RobuxPackageRow from "@/components/RobuxPackageRow";
import RobuxIcon from "@/components/RobuxIcon";
import SendModal from "@/components/SendModal";
import BuyModal, { type Package } from "@/components/BuyModal";
import SettingsDrawer, { type Transaction } from "@/components/SettingsDrawer";

const CrownIcon = () => (
  <svg viewBox="0 0 80 80" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 55 L18 25 L35 42 L40 18 L45 42 L62 25 L70 55 Z" fill="url(#crownGrad)" stroke="#c0a020" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="10" y="55" width="60" height="8" rx="2" fill="url(#crownGrad2)" stroke="#c0a020" strokeWidth="1"/>
    <circle cx="40" cy="18" r="4" fill="#ffd700"/>
    <circle cx="18" cy="25" r="3.5" fill="#ffd700"/>
    <circle cx="62" cy="25" r="3.5" fill="#ffd700"/>
    <defs>
      <linearGradient id="crownGrad" x1="10" y1="18" x2="70" y2="63" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffe066"/>
        <stop offset="100%" stopColor="#c87820"/>
      </linearGradient>
      <linearGradient id="crownGrad2" x1="10" y1="55" x2="70" y2="63" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#d4a010"/>
        <stop offset="100%" stopColor="#a06010"/>
      </linearGradient>
    </defs>
  </svg>
);

const WingsIcon = () => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 50 C30 35 8 28 4 18 C14 22 26 30 40 50Z" fill="url(#wingL)" opacity="0.9"/>
    <path d="M40 50 C38 32 16 18 8 10 C20 16 32 28 40 50Z" fill="url(#wingL2)" opacity="0.7"/>
    <path d="M40 50 C50 35 72 28 76 18 C66 22 54 30 40 50Z" fill="url(#wingR)" opacity="0.9"/>
    <path d="M40 50 C42 32 64 18 72 10 C60 16 48 28 40 50Z" fill="url(#wingR2)" opacity="0.7"/>
    <defs>
      <linearGradient id="wingL" x1="4" y1="18" x2="40" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c084fc"/>
        <stop offset="100%" stopColor="#7c3aed"/>
      </linearGradient>
      <linearGradient id="wingL2" x1="8" y1="10" x2="40" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f9a8d4"/>
        <stop offset="100%" stopColor="#db2777"/>
      </linearGradient>
      <linearGradient id="wingR" x1="76" y1="18" x2="40" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24"/>
        <stop offset="100%" stopColor="#d97706"/>
      </linearGradient>
      <linearGradient id="wingR2" x1="72" y1="10" x2="40" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fb923c"/>
        <stop offset="100%" stopColor="#ea580c"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("MyUser");
  const [robuxBalance, setRobuxBalance] = useState(14231);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [buyPkg, setBuyPkg] = useState<Package | null>(null);

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

      <main className="px-4 pt-6 pb-28 w-full max-w-md mx-auto flex flex-col gap-6 lg:max-w-5xl lg:flex-row lg:items-start lg:gap-8">

        {/* Hero */}
        {/* Left column: hero + limited-time items */}
        <div className="flex flex-col gap-6 lg:flex-1">
          <div>
            <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
              Enjoy up to 25%<br />
              <span className="text-amber-400">more Robux</span>
            </h1>
            <p className="text-base font-medium text-muted-foreground mt-2">
              with Roblox Premium membership
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {[1000, 5000, 10000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setRobuxBalance(prev => prev + amt)}
                  className="flex items-center gap-1.5 bg-secondary hover:bg-secondary/70 border border-border text-foreground text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <RobuxIcon className="w-3.5 h-3.5" />
                  +{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Limited-time items */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-foreground">Limited-time avatar items</h2>
              <span className="bg-secondary text-foreground text-xs font-bold px-3 py-1.5 rounded-full border border-border">
                18 days left
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <AvatarItemCard
                title="Fractured Domino Crown"
                value="24,000"
                original="22,500"
                price="₱11.49k"
                imageUrl=""
                itemIcon={<CrownIcon />}
              />
              <AvatarItemCard
                title="Wings of the Pactbreaker"
                value="11,000"
                original="10,000"
                price="₱5,700.00"
                imageUrl=""
                itemIcon={<WingsIcon />}
              />
            </div>
          </section>

        </div>

        {/* Right column: Robux packages */}
        <div className="lg:w-80 lg:sticky lg:top-[90px]">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">Robux packages</h2>
            <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
              <RobuxPackageRow amount="22,500" original="18,000" price="₱11,490.00" onBuy={() => setBuyPkg({ amount: "22,500", original: "18,000", price: "₱11,490.00" })} />
              <RobuxPackageRow amount="12,500" original="10,000" price="₱6,490.00" onBuy={() => setBuyPkg({ amount: "12,500", original: "10,000", price: "₱6,490.00" })} />
              <RobuxPackageRow amount="6,500" original="5,200" price="₱3,290.00" onBuy={() => setBuyPkg({ amount: "6,500", original: "5,200", price: "₱3,290.00" })} />
              <RobuxPackageRow amount="5,250" original="4,500" price="₱2,890.00" onBuy={() => setBuyPkg({ amount: "5,250", original: "4,500", price: "₱2,890.00" })} />
              <RobuxPackageRow amount="3,625" original="3,150" price="₱1,990.00" onBuy={() => setBuyPkg({ amount: "3,625", original: "3,150", price: "₱1,990.00" })} />
              <RobuxPackageRow amount="2,000" original="1,700" price="₱1,150.00" onBuy={() => setBuyPkg({ amount: "2,000", original: "1,700", price: "₱1,150.00" })} />
              <RobuxPackageRow amount="1,500" original="1,200" price="₱799.00" onBuy={() => setBuyPkg({ amount: "1,500", original: "1,200", price: "₱799.00" })} />
              <RobuxPackageRow amount="1,000" original="800" price="₱569.00" onBuy={() => setBuyPkg({ amount: "1,000", original: "800", price: "₱569.00" })} />
              <RobuxPackageRow amount="500" original="400" price="₱269.00" isLast onBuy={() => setBuyPkg({ amount: "500", original: "400", price: "₱269.00" })} />
            </div>
          </section>
        </div>

      </main>

      <BuyModal
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
      />
    </div>
  );
}
