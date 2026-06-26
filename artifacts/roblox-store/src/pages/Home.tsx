import { useState } from "react";
import { Info } from "lucide-react";
import Header from "@/components/Header";
import AvatarItemCard from "@/components/AvatarItemCard";
import RobuxPackageRow from "@/components/RobuxPackageRow";
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

const PACKAGES = [
  { price: "₱11.49K",   mobile: "25,000", premium: "26,400", bonus: "1,400" },
  { price: "₱5,700.00", mobile: "11,000", premium: "12,100", bonus: "1,100" },
  { price: "₱2,890.00", mobile: "4,950",  premium: "5,800",  bonus: "850"   },
  { price: "₱1,150.00", mobile: "1,870",  premium: "2,200",  bonus: "330"   },
  { price: "₱569.00",   mobile: "880",    premium: "1,100",  bonus: "220"   },
  { price: "₱269.00",   mobile: "440",    premium: "550",    bonus: "110"   },
];

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

      <main className="px-4 pt-8 pb-28 w-full max-w-3xl mx-auto flex flex-col gap-10">

        {/* Hero — centered, large */}
        <div className="text-center flex flex-col items-center gap-3">
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
            Enjoy up to 25%<br />more Robux
          </h1>
          <p className="text-base text-muted-foreground max-w-md">
            Premium members, get more Robux on computer, web, and with gift cards
          </p>
        </div>

        {/* Packages table */}
        <section>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-3 px-5 py-3 border-b border-border">
              <span className="text-muted-foreground text-sm font-medium">Price</span>
              <div className="flex items-center gap-1 justify-center">
                <span className="text-muted-foreground text-sm font-medium">Mobile &amp; console</span>
                <Info className="w-3.5 h-3.5 text-muted-foreground/60" />
              </div>
              <div className="flex items-center gap-1 justify-end">
                <span className="text-muted-foreground text-sm font-medium">Computer, web &amp; gift cards</span>
                <Info className="w-3.5 h-3.5 text-muted-foreground/60" />
              </div>
            </div>

            {/* Rows */}
            {PACKAGES.map((pkg, i) => (
              <RobuxPackageRow
                key={pkg.price}
                price={pkg.price}
                mobile={pkg.mobile}
                premium={pkg.premium}
                bonus={pkg.bonus}
                isLast={i === PACKAGES.length - 1}
                onBuy={() => setBuyPkg({ amount: pkg.premium, original: pkg.mobile, price: pkg.price })}
              />
            ))}
          </div>
        </section>

        {/* Limited-time avatar items */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Limited-time avatar items</h2>
            <span className="bg-secondary text-foreground text-xs font-bold px-3 py-1.5 rounded-full border border-border">
              18 days left
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
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
