import RobuxIcon from "@/components/RobuxIcon";

interface AvatarItemCardProps {
  title: string;
  value: string;
  original: string;
  price: string;
  imageUrl: string;
  itemIcon: React.ReactNode;
  onBuy?: () => void;
  animateIcon?: boolean;
}

export default function AvatarItemCard({ title, value, original, price, imageUrl, itemIcon, onBuy, animateIcon }: AvatarItemCardProps) {
  return (
    <div
      data-testid={`card-avatar-item-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className="w-full rounded-2xl bg-card border border-card-border overflow-hidden"
    >
      <div className="flex items-center gap-4 p-4">
        <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden border border-border">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          ) : null}
          <div className={`flex items-center justify-center w-full h-full${animateIcon ? " spin-slow" : ""}`}>
            {itemIcon}
          </div>
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-base text-foreground leading-tight">{title}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Roblox</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <RobuxIcon className="w-4 h-4" />
            <span className="font-bold text-base text-foreground">{value}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <RobuxIcon className="w-3.5 h-3.5" />
            <span className="line-through">{original}</span>
          </div>
        </div>
        <button
          data-testid={`button-buy-${title.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={onBuy}
          className="bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm px-5 py-2 rounded-xl transition-colors border border-border"
        >
          {price}
        </button>
      </div>
    </div>
  );
}
