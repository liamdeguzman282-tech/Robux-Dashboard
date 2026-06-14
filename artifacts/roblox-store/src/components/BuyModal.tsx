import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import RobuxIcon from "@/components/RobuxIcon";

export interface Package {
  amount: string;
  original: string;
  price: string;
}

interface BuyModalProps {
  pkg: Package | null;
  onClose: () => void;
  onConfirm: (robux: number) => void;
}

export default function BuyModal({ pkg, onClose, onConfirm }: BuyModalProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handleClose() {
    setLoading(false);
    setDone(false);
    onClose();
  }

  function handleBuy() {
    if (!pkg) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      const n = parseInt(pkg.amount.replace(/,/g, ""), 10);
      onConfirm(n);
      setTimeout(() => {
        handleClose();
      }, 1400);
    }, 1200);
  }

  return (
    <AnimatePresence onExitComplete={() => { setDone(false); setLoading(false); }}>
      {pkg && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-card rounded-t-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="font-bold text-base text-foreground">Confirm Purchase</span>
              <button onClick={handleClose} className="text-foreground/60 hover:text-foreground transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="px-5 py-10 flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <p className="font-bold text-foreground text-lg">Purchase successful!</p>
                <div className="flex items-center gap-2 text-amber-400">
                  <RobuxIcon className="w-5 h-5" />
                  <span className="font-black text-2xl">+{pkg.amount}</span>
                  <span className="text-muted-foreground text-sm font-normal">added to your balance</span>
                </div>
              </div>
            ) : (
              <div className="px-5 py-6 flex flex-col gap-5">
                <div className="bg-secondary/40 rounded-2xl border border-border p-5 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3">
                    <RobuxIcon className="w-10 h-10" />
                    <span className="font-black text-foreground text-5xl">{pkg.amount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RobuxIcon className="w-3.5 h-3.5" />
                    <span className="line-through">{pkg.original}</span>
                    <span className="text-emerald-400 font-semibold">without Premium</span>
                  </div>
                  <div className="w-full h-px bg-border" />
                  <p className="text-foreground font-bold text-2xl">{pkg.price}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 bg-secondary hover:bg-secondary/70 text-foreground font-bold py-4 rounded-xl transition-colors border border-border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBuy}
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : "Buy Now"}
                  </button>
                </div>
                <p className="text-center text-muted-foreground text-xs">Robux are added instantly to your balance</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
