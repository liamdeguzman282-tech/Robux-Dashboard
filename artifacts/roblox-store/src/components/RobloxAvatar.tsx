import { useRobloxAvatar } from "@/hooks/useRobloxAvatar";

interface RobloxAvatarProps {
  username: string;
  size?: string;
  className?: string;
  ringClass?: string;
}

const COLORS = [
  "from-violet-500 to-indigo-600",
  "from-rose-500 to-orange-500",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
];

export default function RobloxAvatar({ username, size = "w-10 h-10", className = "", ringClass = "ring-2 ring-white/20" }: RobloxAvatarProps) {
  const { url, loading } = useRobloxAvatar(username);
  const colorIndex = username.charCodeAt(0) % COLORS.length;
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className={`${size} rounded-full overflow-hidden shrink-0 ${ringClass} ${className} relative`}>
      {loading && (
        <div className={`w-full h-full bg-gradient-to-br ${COLORS[colorIndex]} flex items-center justify-center`}>
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      {!loading && url && (
        <img
          src={url}
          alt={username}
          className="w-full h-full object-cover"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      )}
      {!loading && !url && (
        <div className={`w-full h-full bg-gradient-to-br ${COLORS[colorIndex]} flex items-center justify-center text-white font-bold text-xs`}>
          {initials}
        </div>
      )}
    </div>
  );
}
