import { Router } from "express";

const router = Router();

router.get("/roblox/avatar", async (req, res) => {
  const username = String(req.query.username ?? "").trim();
  if (!username) {
    res.status(400).json({ error: "username required" });
    return;
  }

  try {
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
    });
    if (!userRes.ok) {
      res.status(404).json({ error: "user not found" });
      return;
    }
    const userData = await userRes.json() as { data: { id: number; name: string }[] };
    const user = userData?.data?.[0];
    if (!user) {
      res.status(404).json({ error: "user not found" });
      return;
    }

    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=true`
    );
    if (!thumbRes.ok) {
      res.status(502).json({ error: "thumbnail fetch failed" });
      return;
    }
    const thumbData = await thumbRes.json() as { data: { imageUrl: string }[] };
    const imageUrl = thumbData?.data?.[0]?.imageUrl ?? null;

    res.json({ id: user.id, name: user.name, imageUrl });
  } catch (err) {
    res.status(502).json({ error: "upstream error" });
  }
});

export default router;
