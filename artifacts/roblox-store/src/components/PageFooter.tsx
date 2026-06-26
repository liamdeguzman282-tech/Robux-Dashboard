export default function PageFooter() {
  const links1 = ["About Us", "Jobs", "Blog", "Parents"];
  const links2 = ["Buy Gift Cards", "Help", "Terms", "Accessibility"];
  const links3 = ["Privacy", "Sitemap"];

  return (
    <footer className="flex flex-col items-center gap-4 py-8 border-t border-border mt-4">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {links1.map(l => <a key={l} href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{l}</a>)}
      </nav>
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {links2.map(l => <a key={l} href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{l}</a>)}
      </nav>
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 items-center">
        {links3.map(l => <a key={l} href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{l}</a>)}
        <a href="#" className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors">
          Your Privacy Choices
          <span className="inline-flex gap-0.5 ml-1">
            <span className="w-4 h-4 rounded bg-blue-600 text-white text-[8px] font-black flex items-center justify-center">✓</span>
            <span className="w-4 h-4 rounded bg-red-500 text-white text-[8px] font-black flex items-center justify-center">✕</span>
          </span>
        </a>
      </nav>
      <p className="text-muted-foreground text-xs text-center max-w-sm mt-2 leading-relaxed">
        ©2026 Roblox Corporation. Roblox, the Roblox logo and Powering Imagination are among our registered and unregistered trademarks in the U.S. and other countries.
      </p>
    </footer>
  );
}
