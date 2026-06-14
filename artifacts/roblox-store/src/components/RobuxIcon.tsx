export default function RobuxIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img
      src="/roblox-icon.jpg"
      alt="Robux"
      className={`${className} rounded-sm object-cover grayscale brightness-150`}
    />
  );
}
