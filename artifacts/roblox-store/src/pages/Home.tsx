import { useState } from "react";
import Header from "@/components/Header";
import RobuxPackageRow from "@/components/RobuxPackageRow";
import SendModal from "@/components/SendModal";
import BuyModal, { type Package } from "@/components/BuyModal";
import SettingsDrawer, { type Transaction } from "@/components/SettingsDrawer";

const PACKAGES = [
  { amount: "22,500", original: "18,000", price: "₱11,490.00" },
  { amount: "12,500", original: "10,000", price: "₱6,490.00"  },
  { amount: "6,500",  original: "5,200",  price: "₱3,290.00"  },
  { amount: "5,250",  original: "4,500",  price: "₱2,890.00"  },
  { amount: "3,625",  original: "3,150",  price: "₱1,990.00"  },
  { amount: "2,000",  original: "1,700",  price: "₱1,150.00"  },
  { amount: "1,500",  original: "1,200",  price: "₱799.00"    },
  { amount: "1,000",  original: "800",    price: "₱569.00"    },
  { amount: "500",    original: "400",    price: "₱269.00"    },
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

      <main className="px-4 pt-6 pb-28 w-full max-w-md mx-auto">
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
