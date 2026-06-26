import { Router } from "express";

const router = Router();

interface CachedUser {
  id: number;
  name: string;
  displayName: string;
  imageUrl: string | null;
  created: string;
  friendsCount: number;
  followersCount: number;
  cachedAt: number;
}
const userCache = new Map<string, CachedUser>();
const CACHE_TTL_MS = 5 * 60 * 1000;

async function lookupRobloxUser(username: string): Promise<CachedUser | null> {
  const key = username.toLowerCase();
  const cached = userCache.get(key);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) return cached;

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (compatible; RobloxStore/1.0)",
  };

  const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    headers,
    body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
  });
  if (!userRes.ok) return null;

  const userData = await userRes.json() as { data: { id: number; name: string }[] };
  const user = userData?.data?.[0];
  if (!user) return null;

  const [thumbRes, profileRes, friendsRes, followersRes] = await Promise.allSettled([
    fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=true`, { headers }),
    fetch(`https://users.roblox.com/v1/users/${user.id}`, { headers }),
    fetch(`https://friends.roblox.com/v1/users/${user.id}/friends/count`, { headers }),
    fetch(`https://friends.roblox.com/v1/users/${user.id}/followers/count`, { headers }),
  ]);

  let imageUrl: string | null = null;
  if (thumbRes.status === "fulfilled" && thumbRes.value.ok) {
    const td = await thumbRes.value.json() as { data: { imageUrl: string }[] };
    imageUrl = td?.data?.[0]?.imageUrl ?? null;
  }

  let displayName = user.name;
  let created = "";
  if (profileRes.status === "fulfilled" && profileRes.value.ok) {
    const pd = await profileRes.value.json() as { displayName?: string; created?: string };
    displayName = pd.displayName ?? user.name;
    created = pd.created ?? "";
  }

  let friendsCount = 0;
  if (friendsRes.status === "fulfilled" && friendsRes.value.ok) {
    const fd = await friendsRes.value.json() as { count?: number };
    friendsCount = fd.count ?? 0;
  }

  let followersCount = 0;
  if (followersRes.status === "fulfilled" && followersRes.value.ok) {
    const fd = await followersRes.value.json() as { count?: number };
    followersCount = fd.count ?? 0;
  }

  const result: CachedUser = {
    id: user.id, name: user.name, displayName, imageUrl,
    created, friendsCount, followersCount, cachedAt: Date.now(),
  };
  userCache.set(key, result);
  return result;
}

router.get("/roblox/avatar", async (req, res) => {
  const username = String(req.query.username ?? "").trim();
  if (!username) { res.status(400).json({ error: "username required" }); return; }

  try {
    const user = await lookupRobloxUser(username);
    if (!user) { res.status(404).json({ error: "user not found" }); return; }
    res.json({
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      created: user.created,
      friendsCount: user.friendsCount,
      followersCount: user.followersCount,
    });
  } catch {
    res.status(502).json({ error: "upstream error" });
  }
});

router.get("/roblox/font", async (_req, res) => {
  try {
    const fontRes = await fetch(
      "https://static.rbxcdn.com/css/images/fbf/RobloxFont.woff2",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!fontRes.ok) { res.status(502).json({ error: "font fetch failed" }); return; }
    const buf = await fontRes.arrayBuffer();
    res.setHeader("Content-Type", "font/woff2");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(buf));
  } catch {
    res.status(502).json({ error: "upstream error" });
  }
});

export default router;
