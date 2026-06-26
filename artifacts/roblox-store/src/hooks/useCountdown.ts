import { useState, useEffect } from "react";

const STORAGE_KEY = "roblox_deal_deadline";
const DAYS = 5;

function getDeadline(): Date {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const d = new Date(stored);
    if (!isNaN(d.getTime()) && d > new Date()) return d;
  }
  const deadline = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000);
  localStorage.setItem(STORAGE_KEY, deadline.toISOString());
  return deadline;
}

export function useCountdown() {
  const [deadline] = useState<Date>(getDeadline);
  const [remaining, setRemaining] = useState(() => deadline.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const r = deadline.getTime() - Date.now();
      setRemaining(Math.max(0, r));
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const totalSecs = Math.floor(remaining / 1000);
  const days  = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins  = Math.floor((totalSecs % 3600) / 60);
  const secs  = totalSecs % 60;

  const label = days > 0
    ? `${days} day${days !== 1 ? "s" : ""} left`
    : hours > 0
    ? `${hours}h ${mins}m left`
    : `${mins}m ${secs}s left`;

  return { days, hours, mins, secs, label, expired: remaining <= 0 };
}
