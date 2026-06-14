import { useState } from "react";
import { Crown, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import AvatarItemCard from "@/components/AvatarItemCard";
import RobuxPackageRow from "@/components/RobuxPackageRow";
import SendModal from "@/components/SendModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full bg-background relative pb-24">
      {/* Background SVG Pattern */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <Header />

      <main className="relative z-10">
        {/* Sub-nav Row */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-sm sticky top-16 z-30">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pr-4">
            {['Charts', 'Marketplace', 'Create', 'Robux'].map((item, i) => (
              <button 
                key={item} 
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${i === 3 ? 'bg-white text-black' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                {item}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 bg-secondary hover:bg-secondary/80 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 transition-transform hover:scale-105"
          >
            <span className="text-lg leading-none mb-1">↑</span> Send
          </button>
        </div>

        <div className="p-4 flex flex-col gap-8 max-w-3xl mx-auto w-full">
          
          {/* Hero Banner */}
          <div className="pt-6 pb-2">
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Enjoy up to 25% <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
                more Robux
              </span>
            </h1>
            <p className="text-lg font-medium text-muted-foreground mt-2">
              with Roblox Premium membership
            </p>
          </div>

          {/* Limited Items */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Limited-time avatar items</h2>
              <div className="bg-card px-3 py-1 rounded-full border border-card-border flex items-center gap-1.5 text-xs font-bold text-white shadow-sm">
                <span>🕐</span> 18 days left
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4">
              <AvatarItemCard 
                title="Fractured Domino Crown"
                value="24,000"
                original="22,500"
                price="₱11.49k"
                imageFallbackContent={<Crown className="w-24 h-24 text-accent drop-shadow-2xl" />}
              />
              <AvatarItemCard 
                title="Wings of the Pactbreaker"
                value="11,000"
                original="10,000"
                price="₱5,700.00"
                imageFallbackContent={<Sparkles className="w-24 h-24 text-blue-400 drop-shadow-2xl" />}
              />
            </div>
          </section>

          {/* Robux Packages */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white">Robux packages</h2>
            <div className="bg-card border border-card-border rounded-3xl overflow-hidden shadow-xl">
              <RobuxPackageRow amount="5,250" original="4,500" price="₱2,890.00" />
              <RobuxPackageRow amount="3,625" original="3,150" price="₱1,990.00" />
              <RobuxPackageRow amount="2,000" original="1,700" price="₱1,150.00" />
              <RobuxPackageRow amount="1,500" original="1,200" price="₱799.00" />
              <RobuxPackageRow amount="1,000" original="800" price="₱569.00" />
              <RobuxPackageRow amount="500" original="400" price="₱269.00" />
            </div>
          </section>

        </div>
      </main>

      <SendModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
