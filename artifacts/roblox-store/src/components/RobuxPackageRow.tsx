import RobuxIcon from "@/components/RobuxIcon";

interface RobuxPackageRowProps {
  amount: string;
  original: string;
  price: string;
  isLast?: boolean;
}

export default function RobuxPackageRow({ amount, original, price, isLast }: RobuxPackageRowProps) {
  return (
    <div
      data-testid={`row-package-${amount.replace(/,/g, '')}`}
      className={`flex items-center justify-between px-4 py-4 hover:bg-white/4 transition-colors cursor-pointer ${!isLast ? 'border-b border-white/6' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <RobuxIcon className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-lg text-white">{amount}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <RobuxIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="line-through">{original}</span>
        </div>
      </div>

      <button
        data-testid={`button-package-${amount.replace(/,/g, '')}`}
        className="bg-white/8 hover:bg-white/15 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-colors border border-white/8"
      >
        {price}
      </button>
    </div>
  );
}
