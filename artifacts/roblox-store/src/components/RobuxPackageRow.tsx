import { motion } from "framer-motion";

interface RobuxPackageRowProps {
  amount: string;
  original: string;
  price: string;
}

export default function RobuxPackageRow({ amount, original, price }: RobuxPackageRowProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, backgroundColor: "hsl(var(--secondary) / 0.5)" }}
      className="flex items-center justify-between p-4 border-b border-border last:border-0 cursor-pointer transition-colors"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            <span className="text-accent-foreground font-bold text-[10px]">R</span>
          </div>
          <span className="font-bold text-xl">{amount}</span>
        </div>
        <span className="text-xs text-muted-foreground line-through ml-7">{original}</span>
      </div>
      
      <button className="bg-secondary hover:bg-secondary/80 text-foreground px-5 py-2 rounded-full text-sm font-bold transition-all">
        {price}
      </button>
    </motion.div>
  );
}
