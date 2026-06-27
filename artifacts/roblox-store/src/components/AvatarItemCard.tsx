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
  glowColor?: string;
}

export default function AvatarItemCard({ title, value, original, price, imageUrl, itemIcon, onBuy, animateIcon, glowColor = "#3b82f6" }: AvatarItemCardProps) {
  return (
    <div
      data-testid={`card-avatar-item-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className="w-full rounded-2xl bg-card border border-card-border overflow-hidden"
    >
      <div className="flex items-center gap-4 p-4">

        {/* Icon box */}
        <div
          className="relative w-20 h-20 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border overflow-visible"
          style={animateIcon ? { perspective: "200px" } : undefined}
        >
          {animateIcon && (
            <>
              {/* Radial glow behind icon */}
              <div
                className="item-glow absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${glowColor}55 0%, ${glowColor}22 50%, transparent 75%)`,
                  zIndex: 0,
                }}
              />

              {/* Shimmer particles */}
              <span
                className="shimmer-p1 absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{ top: "10%", left: "12%", background: glowColor, boxShadow: `0 0 4px 2px ${glowColor}99`, zIndex: 2 }}
              />
              <span
                className="shimmer-p2 absolute w-1 h-1 rounded-full pointer-events-none"
                style={{ top: "18%", right: "10%", background: "#fff", boxShadow: `0 0 4px 2px ${glowColor}88`, zIndex: 2 }}
              />
              <span
                className="shimmer-p3 absolute w-1 h-1 rounded-full pointer-events-none"
                style={{ bottom: "14%", left: "18%", background: glowColor, boxShadow: `0 0 5px 2px ${glowColor}77`, zIndex: 2 }}
              />
              <span
                className="shimmer-p4 absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{ bottom: "12%", right: "14%", background: "#fff", boxShadow: `0 0 4px 2px ${glowColor}66`, zIndex: 2 }}
              />
            </>
          )}

          {imageUrl ? (
            <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover rounded-xl" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          ) : null}

          <div
            className={`relative flex items-center justify-center w-full h-full${animateIcon ? " spin-slow" : ""}`}
            style={{ zIndex: 1 }}
          >
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
