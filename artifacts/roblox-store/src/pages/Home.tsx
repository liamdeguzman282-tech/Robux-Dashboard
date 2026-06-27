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
    <defs>
      {/* Cast shadow */}
      <radialGradient id="fShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.35"/>
        <stop offset="100%" stopColor="#000" stopOpacity="0"/>
      </radialGradient>
      {/* Brim top face */}
      <radialGradient id="fBrimTop" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#3b6fd4"/>
        <stop offset="60%" stopColor="#1a3a8a"/>
        <stop offset="100%" stopColor="#0d1f4f"/>
      </radialGradient>
      {/* Brim underside */}
      <linearGradient id="fBrimUnder" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0a1533"/>
        <stop offset="100%" stopColor="#050c1f"/>
      </linearGradient>
      {/* Crown side */}
      <linearGradient id="fCrownSide" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb"/>
        <stop offset="40%" stopColor="#1d4ed8"/>
        <stop offset="100%" stopColor="#0f2070"/>
      </linearGradient>
      {/* Crown top */}
      <radialGradient id="fCrownTop" cx="38%" cy="38%" r="55%">
        <stop offset="0%" stopColor="#93c5fd"/>
        <stop offset="45%" stopColor="#3b82f6"/>
        <stop offset="100%" stopColor="#1e40af"/>
      </radialGradient>
      {/* Specular highlight */}
      <radialGradient id="fSpec" cx="35%" cy="30%" r="45%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.55"/>
        <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
      {/* Band gradient */}
      <linearGradient id="fBand" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0a0f2a"/>
        <stop offset="40%" stopColor="#1a237e"/>
        <stop offset="100%" stopColor="#0a0f2a"/>
      </linearGradient>
    </defs>

    {/* Cast shadow on ground */}
    <ellipse cx="40" cy="72" rx="26" ry="5" fill="url(#fShadow)"/>

    {/* Brim underside (visible rim at back) */}
    <ellipse cx="40" cy="52" rx="30" ry="7.5" fill="url(#fBrimUnder)"/>

    {/* Brim top face */}
    <ellipse cx="40" cy="50" rx="30" ry="7.5" fill="url(#fBrimTop)"/>

    {/* Brim front highlight edge */}
    <ellipse cx="40" cy="57.5" rx="30" ry="2" fill="#1a3a8a" opacity="0.6"/>
    <path d="M10 50 Q40 44 70 50" stroke="#4f8ef7" strokeWidth="0.8" fill="none" opacity="0.5"/>

    {/* Crown body (sides) — slightly curved trapezoid */}
    <path d="M24 50 Q22 35 28 22 Q34 16 40 15 Q46 16 52 22 Q58 35 56 50 Q48 46 40 46 Q32 46 24 50Z"
          fill="url(#fCrownSide)"/>

    {/* Crown dent/indent at top center */}
    <path d="M33 22 Q36 28 40 26 Q44 28 47 22 Q44 16 40 15 Q36 16 33 22Z"
          fill="#1e40af" opacity="0.7"/>

    {/* Hat band */}
    <path d="M25 46 Q26 42 28 40 Q34 38 40 38 Q46 38 52 40 Q54 42 55 46 Q48 43 40 43 Q32 43 25 46Z"
          fill="url(#fBand)"/>
    {/* Band highlight */}
    <path d="M29 41 Q34 39.5 40 39.5 Q46 39.5 51 41" stroke="#3b5bdb" strokeWidth="0.6" fill="none" opacity="0.6"/>

    {/* Crown top face */}
    <ellipse cx="40" cy="21" rx="12.5" ry="6" fill="url(#fCrownTop)"/>

    {/* Specular highlight on crown face */}
    <ellipse cx="34" cy="32" rx="10" ry="14" fill="url(#fSpec)"/>

    {/* Top edge highlight */}
    <path d="M30 18 Q40 14 50 18" stroke="#bfdbfe" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round"/>

    {/* Arcane sparkles */}
    <circle cx="29" cy="55" r="1.2" fill="#60a5fa" opacity="0.9"/>
    <circle cx="53" cy="54" r="1" fill="#93c5fd" opacity="0.7"/>
    <circle cx="40" cy="12" r="1.5" fill="#e0f2fe" opacity="0.85"/>
    <circle cx="35" cy="25" r="0.8" fill="#fff" opacity="0.6"/>
    <circle cx="47" cy="28" r="0.7" fill="#fff" opacity="0.5"/>
  </svg>
);

const SunMoonWingsIcon = () => (
  <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Drop shadow */}
      <radialGradient id="wShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#000" stopOpacity="0"/>
      </radialGradient>
      {/* Silver wing — main face */}
      <linearGradient id="wSilMain" x1="2" y1="10" x2="40" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f0f4ff"/>
        <stop offset="40%" stopColor="#94a3b8"/>
        <stop offset="100%" stopColor="#475569"/>
      </linearGradient>
      {/* Silver wing — inner feather shadow */}
      <linearGradient id="wSilInner" x1="14" y1="14" x2="40" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#cbd5e1"/>
        <stop offset="100%" stopColor="#1e293b"/>
      </linearGradient>
      {/* Silver edge glow */}
      <linearGradient id="wSilEdge" x1="2" y1="12" x2="20" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e2e8f0"/>
        <stop offset="100%" stopColor="#93c5fd"/>
      </linearGradient>
      {/* Gold wing — main face */}
      <linearGradient id="wGoldMain" x1="78" y1="10" x2="40" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef9c3"/>
        <stop offset="40%" stopColor="#f59e0b"/>
        <stop offset="100%" stopColor="#92400e"/>
      </linearGradient>
      {/* Gold wing — inner shadow */}
      <linearGradient id="wGoldInner" x1="66" y1="14" x2="40" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde68a"/>
        <stop offset="100%" stopColor="#451a03"/>
      </linearGradient>
      {/* Gold edge glow */}
      <linearGradient id="wGoldEdge" x1="78" y1="12" x2="60" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a"/>
        <stop offset="100%" stopColor="#f97316"/>
      </linearGradient>
      {/* Center orb */}
      <radialGradient id="wOrb" cx="38%" cy="35%" r="55%">
        <stop offset="0%" stopColor="#f8fafc"/>
        <stop offset="40%" stopColor="#a78bfa"/>
        <stop offset="100%" stopColor="#4c1d95"/>
      </radialGradient>
      <radialGradient id="wOrbGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
      </radialGradient>
    </defs>

    {/* Ground shadow */}
    <ellipse cx="40" cy="72" rx="22" ry="4" fill="url(#wShadow)"/>

    {/* === LEFT WING (silver / moon) === */}
    {/* Outer primary feathers — back layer */}
    <path d="M40 54 C34 44 18 34 4 16 C10 20 18 28 22 38 C28 46 36 52 40 54Z"
          fill="url(#wSilInner)" opacity="0.55"/>
    {/* Mid feathers */}
    <path d="M40 54 C32 42 14 30 6 12 C14 18 24 30 30 42 C34 48 38 52 40 54Z"
          fill="url(#wSilMain)" opacity="0.85"/>
    {/* Top primary — brightest face */}
    <path d="M40 54 C36 40 20 22 8 8 C18 16 28 28 34 42 C37 48 39 52 40 54Z"
          fill="url(#wSilEdge)" opacity="0.75"/>
    {/* Feather separators — depth lines */}
    <path d="M40 54 C36 44 26 32 14 20" stroke="#475569" strokeWidth="0.7" opacity="0.45" fill="none"/>
    <path d="M40 54 C34 46 20 36 8 24" stroke="#94a3b8" strokeWidth="0.5" opacity="0.35" fill="none"/>
    <path d="M40 54 C38 46 30 36 20 26" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.5" fill="none"/>
    {/* Specular tip highlights */}
    <circle cx="9" cy="10" r="2.5" fill="#f0f9ff" opacity="0.8"/>
    <circle cx="6" cy="14" r="1.5" fill="#e0f2fe" opacity="0.6"/>
    <circle cx="13" cy="8" r="1.2" fill="#bfdbfe" opacity="0.7"/>

    {/* === RIGHT WING (gold / sun) === */}
    {/* Outer primary feathers — back layer */}
    <path d="M40 54 C46 44 62 34 76 16 C70 20 62 28 58 38 C52 46 44 52 40 54Z"
          fill="url(#wGoldInner)" opacity="0.55"/>
    {/* Mid feathers */}
    <path d="M40 54 C48 42 66 30 74 12 C66 18 56 30 50 42 C46 48 42 52 40 54Z"
          fill="url(#wGoldMain)" opacity="0.85"/>
    {/* Top primary — brightest face */}
    <path d="M40 54 C44 40 60 22 72 8 C62 16 52 28 46 42 C43 48 41 52 40 54Z"
          fill="url(#wGoldEdge)" opacity="0.75"/>
    {/* Feather separators */}
    <path d="M40 54 C44 44 54 32 66 20" stroke="#92400e" strokeWidth="0.7" opacity="0.45" fill="none"/>
    <path d="M40 54 C46 46 60 36 72 24" stroke="#f59e0b" strokeWidth="0.5" opacity="0.35" fill="none"/>
    <path d="M40 54 C42 46 50 36 60 26" stroke="#fde68a" strokeWidth="0.5" opacity="0.5" fill="none"/>
    {/* Gold tip glows */}
    <circle cx="71" cy="10" r="2.5" fill="#fef9c3" opacity="0.85"/>
    <circle cx="74" cy="14" r="1.5" fill="#fde68a" opacity="0.7"/>
    <circle cx="67" cy="8" r="1.2" fill="#fbbf24" opacity="0.75"/>

    {/* === CENTER ORB === */}
    {/* Outer glow ring */}
    <circle cx="40" cy="52" r="8" fill="url(#wOrbGlow)"/>
    {/* Orb body */}
    <circle cx="40" cy="52" r="5.5" fill="url(#wOrb)"/>
    {/* Orb specular */}
    <circle cx="38" cy="50" r="2" fill="#fff" opacity="0.55"/>
    {/* Orb rim */}
    <circle cx="40" cy="52" r="5.5" stroke="#7c3aed" strokeWidth="0.8" opacity="0.6" fill="none"/>
  </svg>
);

const PACKAGES = [
  { amount: "24,000", original: "22,500", price: "$199.99" },
  { amount: "11,000", original: "10,000", price: "$99.99"  },
  { amount: "5,250",  original: "4,500",  price: "$49.99"  },
  { amount: "3,625",  original: "3,625",  price: "$34.99"  },
  { amount: "2,000",  original: "1,700",  price: "$19.99"  },
  { amount: "1,000",  original: "800",    price: "$9.99"   },
  { amount: "500",    original: "400",    price: "$4.99"   },
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
              glowColor="#3b82f6"
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
              glowColor="#f59e0b"
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
