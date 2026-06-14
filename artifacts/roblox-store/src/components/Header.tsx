import { Menu, Search, Bell, Settings } from "lucide-react";
import { SiRoblox } from "react-icons/si";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border h-16 flex items-center px-4 justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-foreground">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="bg-white p-1 rounded-md flex items-center justify-center">
          <SiRoblox className="text-black h-6 w-6" />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 ring-2 ring-border cursor-pointer">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gradient-to-tr from-purple-500 to-primary text-xs font-bold">RX</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" className="text-foreground">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2 bg-secondary/50 rounded-full px-3 py-1 cursor-pointer hover:bg-secondary transition-colors">
          <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center animate-pulse">
            <span className="text-accent-foreground font-bold text-[10px]">R</span>
          </div>
          <span className="font-bold text-sm">14,231</span>
        </div>
        
        <Button variant="ghost" size="icon" className="text-foreground">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
