import RobuxIcon from "@/components/RobuxIcon";

interface RobuxPackageRowProps {
  amount: string;
  original: string;
  price: string;
  isLast?: boolean;
  onBuy: () => void;
}

export default function RobuxPackageRow({ amount, original, price, isLast, onBuy }: RobuxPackageRowProps) {
  return (
    <div
      data-testid={`row-package-${amount.replace(/,/g, '')}`}
      onClick={onBuy}
      className={`flex items-center justify-between px-4 py-4 hover:bg-secondary/50 transition-colors cursor-pointer ${!isLast ? 'border-b border-border' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <RobuxIcon className="w-5 h-5" />
          <span className="font-bold text-lg text-foreground">{amount}</span>
        </div>
        {amount !== original && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <RobuxIcon className="w-3.5 h-3.5" />
            <span className="line-through">{original}</span>
          </div>
        )}
      </div>

      <button
        data-testid={`button-package-${amount.replace(/,/g, '')}`}
        onClick={e => { e.stopPropagation(); onBuy(); }}
        className="bg-secondary hover:bg-secondary/70 text-foreground font-semibold text-sm px-5 py-2 rounded-xl transition-colors border border-border"
      >
        {price}
      </button>
    </div>
  );
}
