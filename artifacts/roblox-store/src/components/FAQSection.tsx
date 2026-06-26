import { useState } from "react";
import { ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "What are Robux?",
    a: "Robux is the virtual currency that can be purchased using your local currency or with Roblox Gift Card credits. It allows users to customize their avatar and purchase special abilities and items in experiences.",
  },
  {
    q: "Where are my Robux?",
    a: "Your Robux balance and transaction history can be found under My Transactions.\n\nIn the desktop and mobile app, you can find your Robux balance by logging into the account where the Robux were purchased or earned, tapping on the Robux icon at the top right of the app, and see your balance displayed at the top.\n\nOn the web browser, log in to the account where the Robux were purchased or earned and your Robux balance is shown in the upper right corner.",
  },
  {
    q: "Do Robux expire?",
    a: "Robux do not expire. Once purchased, they will remain in the user's account until they are spent. Users can hold onto and utilize their Robux at any time.",
  },
  {
    q: "How to redeem your gift card?",
    a: "Roblox Gift Cards can be redeemed in a browser at roblox.com/redeem.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number[]>([0, 1, 2, 3]);

  function toggle(i: number) {
    setOpen(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-2xl font-black text-foreground">FAQ</h2>
      {FAQS.map((faq, i) => (
        <div key={i} className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between px-4 py-4 text-left"
          >
            <span className="font-bold text-foreground text-base">{faq.q}</span>
            <ChevronUp className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open.includes(i) ? "" : "rotate-180"}`} />
          </button>
          {open.includes(i) && (
            <div className="px-4 pb-4 border-t border-border">
              {faq.a.split("\n\n").map((para, j) => (
                <p key={j} className={`text-foreground text-sm leading-relaxed ${j > 0 ? "mt-3" : "mt-3"}`}>
                  {para.includes("My Transactions") ? (
                    <>Your Robux balance and transaction history can be found under{" "}
                      <span className="font-bold">My Transactions</span>.</>
                  ) : para.includes("roblox.com/redeem") ? (
                    <>Roblox Gift Cards can be redeemed in a browser at{" "}
                      <span className="font-bold">roblox.com/redeem</span>.</>
                  ) : para}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
