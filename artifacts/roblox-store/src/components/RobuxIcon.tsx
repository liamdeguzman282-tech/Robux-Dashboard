export default function RobuxIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <span className={`${className} inline-flex shrink-0 relative`}>
      <img
        src="/robux-icon-light.jpg"
        alt="Robux"
        className="absolute inset-0 w-full h-full rounded-sm object-cover dark:opacity-0 opacity-100 transition-opacity"
      />
      <img
        src="/roblox-icon.jpg"
        alt="Robux"
        className="absolute inset-0 w-full h-full rounded-sm object-cover grayscale brightness-150 dark:opacity-100 opacity-0 transition-opacity"
      />
    </span>
  );
}
