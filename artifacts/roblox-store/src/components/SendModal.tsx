import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SendModal({ isOpen, onClose }: SendModalProps) {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [userFound, setUserFound] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim().length > 2) {
      setUserFound(true);
    }
  };

  const handleNext = () => {
    if (amount && Number(amount) > 0) {
      setStage(2);
    }
  };

  const handleSend = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStage(3);
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStage(1);
      setSearchQuery("");
      setUserFound(false);
      setAmount("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={stage !== 3 ? handleClose : undefined}
          />
          
          <motion.div 
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-card border border-card-border rounded-3xl shadow-2xl overflow-hidden"
          >
            {stage === 1 && (
              <div className="p-6 flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center">Send Robux</h2>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Search by username..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full bg-input rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8"
                  >
                    Search
                  </Button>
                </div>

                {userFound && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-secondary">
                      <Avatar className="h-12 w-12 border-2 border-primary">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-bold">SP</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-lg">StarPlayer99</div>
                        <div className="text-sm text-muted-foreground">@starplayer99</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-accent flex items-center justify-center">
                          <span className="text-accent-foreground font-bold text-xs">R</span>
                        </div>
                        <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0"
                          className="w-full bg-input rounded-2xl py-4 pl-14 pr-4 text-3xl font-bold text-white outline-none focus:ring-2 focus:ring-primary transition-all text-center"
                        />
                      </div>
                      
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {[25, 50, 100, 200].map(val => (
                          <button 
                            key={val}
                            onClick={() => setAmount((Number(amount || 0) + val).toString())}
                            className="shrink-0 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 font-semibold text-sm transition-colors"
                          >
                            +{val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleNext} 
                      disabled={!amount || Number(amount) <= 0}
                      className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl"
                    >
                      Next <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {stage === 2 && (
              <div className="p-6 flex flex-col gap-8 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Confirm Transfer</h2>
                  <p className="text-muted-foreground">Review the details below</p>
                </div>
                
                <div className="flex flex-col items-center gap-4 bg-secondary/30 p-6 rounded-2xl border border-secondary">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-xl">SP</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-xl">StarPlayer99</div>
                    <div className="text-muted-foreground">@starplayer99</div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 text-3xl font-bold">
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-accent-foreground text-sm">R</span>
                    </div>
                    {amount}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 py-6 rounded-xl" onClick={() => setStage(1)}>
                    Back
                  </Button>
                  <Button 
                    className="flex-1 py-6 rounded-xl font-bold bg-primary hover:bg-primary/90 text-lg" 
                    onClick={handleSend}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Send"}
                  </Button>
                </div>
              </div>
            )}

            {stage === 3 && (
              <div className="p-8 flex flex-col items-center justify-center gap-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle2 className="h-24 w-24 text-green-500" />
                </motion.div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">Success!</h2>
                  <p className="text-lg text-muted-foreground">
                    Sent <span className="font-bold text-white">{amount} Robux</span> to StarPlayer99
                  </p>
                </div>

                <Button 
                  onClick={handleClose}
                  className="w-full mt-4 py-6 rounded-xl font-bold text-lg"
                >
                  Done
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
