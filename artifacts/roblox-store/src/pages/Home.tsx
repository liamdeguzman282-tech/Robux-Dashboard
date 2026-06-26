import { useState } from "react";
import { Info } from "lucide-react";
import Header from "@/components/Header";
import RobuxPackageRow from "@/components/RobuxPackageRow";
import SendModal from "@/components/SendModal";
import BuyModal, { type Package } from "@/components/BuyModal";
import SettingsDrawer, { type Transaction } from "@/components/SettingsDrawer";

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
