import { motion } from "framer-motion";

interface AvatarItemCardProps {
  title: string;
  value: string;
  original: string;
  price: string;
  imageFallbackContent: React.ReactNode;
}

export default function AvatarItemCard({ title, value, original, price, imageFallbackContent }: AvatarItemCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="min-w-[240px] max-w-[280px] shrink-0 rounded-2xl bg-card border border-card-border overflow-hidden cursor-pointer"
    >
      <div className="aspect-square w-full bg-secondary flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-primary/20 mix-blend-overlay" />
        {imageFallbackContent}
      </div>
      
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-bold text-base line-clamp-1">{title}</h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground font-medium">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-blue-500 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            Roblox
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-[8px]">R</span>
              </div>
              <span className="font-bold text-lg">{value}</span>
            </div>
            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">{original}</span>
          </div>
          
          <button className="bg-secondary hover:bg-secondary/80 text-foreground px-4 py-1.5 rounded-full text-sm font-bold transition-all">
            {price}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
