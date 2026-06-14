import { useState, useEffect } from "react";

interface RobloxUserData {
  id: number;
  name: string;
  imageUrl: string | null;
}

async function fetchRobloxAvatar(username: string): Promise<RobloxUserData | null> {
  try {
    const res = await fetch(`/api/roblox/avatar?username=${encodeURIComponent(username)}`);
    if (!res.ok) return null;
    return await res.json() as RobloxUserData;
  } catch {
    return null;
  }
}

const cache: Record<string, RobloxUserData | null> = {};

export function useRobloxAvatar(username: string) {
  const key = username.trim().toLowerCase();
  const [data, setData] = useState<RobloxUserData | null>(key && cache[key] !== undefined ? cache[key] : null);
  const [loading, setLoading] = useState(!!key && cache[key] === undefined);

  useEffect(() => {
    if (!key) { setData(null); setLoading(false); return; }
    if (cache[key] !== undefined) { setData(cache[key]); setLoading(false); return; }
    setLoading(true);
    fetchRobloxAvatar(key).then(result => {
      cache[key] = result;
      setData(result);
      setLoading(false);
    });
  }, [key]);

  return { url: data?.imageUrl ?? null, name: data?.name ?? null, loading };
}
