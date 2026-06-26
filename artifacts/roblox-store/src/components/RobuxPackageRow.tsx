import RobuxIcon from "@/components/RobuxIcon";

interface RobuxPackageRowProps {
  price: string;
  mobile: string;
  premium: string;
  bonus: string;
  isLast?: boolean;
  onBuy: () => void;
}

export default function RobuxPackageRow({ price, mobile, premium, bonus, isLast, onBuy }: RobuxPackageRowProps) {
  return (
    <div
      data-testid={`row-package-${premium.replace(/,/g, '')}`}
      className={`grid grid-cols-3 items-center px-5 py-5 hover:bg-white/5 transition-colors cursor-pointer ${!isLast ? 'border-b border-border' : ''}`}
      onClick={onBuy}
    >
      {/* Price */}
      <span className="font-semibold text-foreground text-base">{price}</span>

      {/* Mobile & console — strikethrough grey */}
      <div className="flex items-center gap-1.5 justify-center">
        <RobuxIcon className="w-4 h-4 opacity-40" />
        <span className="text-muted-foreground line-through text-base font-medium">{mobile}</span>
      </div>

      {/* Computer / Premium — blue pill + bonus badge */}
      <div className="flex items-center gap-2 justify-end">
        <button
          data-testid={`button-package-${premium.replace(/,/g, '')}`}
          className="flex items-center gap-2 bg-[#0066ff] hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-base"
          onClick={e => { e.stopPropagation(); onBuy(); }}
        >
          <RobuxIcon className="w-4 h-4 brightness-[10]" />
          {premium}
        </button>
        <span className="bg-amber-400 text-black text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
          + {bonus} more
        </span>
      </div>
    </div>
  );
}
