import { Router } from "express";

const router = Router();

interface CachedUser { id: number; name: string; imageUrl: string | null; cachedAt: number }
const userCache = new Map<string, CachedUser>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function lookupRobloxUser(username: string): Promise<CachedUser | null> {
  const key = username.toLowerCase();
  const cached = userCache.get(key);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) return cached;

  const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; RobloxStore/1.0)",
    },
    body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
  });

  if (!userRes.ok) return null;

  const userData = await userRes.json() as { data: { id: number; name: string }[] };
  const user = userData?.data?.[0];
  if (!user) return null;

  const thumbRes = await fetch(
    `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=true`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RobloxStore/1.0)",
      },
    }
  );

  let imageUrl: string | null = null;
  if (thumbRes.ok) {
    const thumbData = await thumbRes.json() as { data: { imageUrl: string }[] };
    imageUrl = thumbData?.data?.[0]?.imageUrl ?? null;
  }

  const result: CachedUser = { id: user.id, name: user.name, imageUrl, cachedAt: Date.now() };
  userCache.set(key, result);
  return result;
}

router.get("/roblox/avatar", async (req, res) => {
  const username = String(req.query.username ?? "").trim();
  if (!username) {
    res.status(400).json({ error: "username required" });
    return;
  }

  try {
    const user = await lookupRobloxUser(username);
    if (!user) {
      res.status(404).json({ error: "user not found" });
      return;
    }
    res.json({ id: user.id, name: user.name, imageUrl: user.imageUrl });
  } catch (err) {
    res.status(502).json({ error: "upstream error" });
  }
});

router.get("/roblox/font", async (_req, res) => {
  try {
    const fontRes = await fetch(
      "https://static.rbxcdn.com/css/images/fbf/RobloxFont.woff2",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!fontRes.ok) {
      res.status(502).json({ error: "font fetch failed" });
      return;
    }
    const buf = await fontRes.arrayBuffer();
    res.setHeader("Content-Type", "font/woff2");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(buf));
  } catch {
    res.status(502).json({ error: "upstream error" });
  }
});

export default router;
