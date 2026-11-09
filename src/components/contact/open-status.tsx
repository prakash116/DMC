"use client";

import { useSyncExternalStore } from "react";
import { db } from "@/lib/db";

const { schedule } = db.site.contact;

type Status = { open: boolean; label: string };

/* "Open now · closes 8 PM" / "Closed · opens Tue 10 AM", in studio (IST) time */
function compute(): Status {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: schedule.timezone, weekday: "short", hour: "numeric", hourCycle: "h23" }).formatToParts(new Date());
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days.indexOf(wd);
  const fmt = (h: number) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;
  const isOpenDay = (d: number) => !schedule.closedDays.includes(d);

  if (isOpenDay(day) && hour >= schedule.open && hour < schedule.close) {
    return { open: true, label: `Open now · closes ${fmt(schedule.close)}` };
  }
  // next opening
  let d = day;
  const sameDay = isOpenDay(day) && hour < schedule.open;
  if (!sameDay) {
    do d = (d + 1) % 7;
    while (!isOpenDay(d));
  }
  return { open: false, label: `Closed · opens ${sameDay ? "today" : days[d]} ${fmt(schedule.open)}` };
}

let cached: Status | null = null;
let cachedAt = 0;
const snapshot = () => {
  // recompute at most once a minute; stable reference otherwise (required by useSyncExternalStore)
  if (!cached || Date.now() - cachedAt > 60_000) {
    cached = compute();
    cachedAt = Date.now();
  }
  return cached;
};
const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};

export function OpenStatus({ className = "" }: { className?: string }) {
  const s = useSyncExternalStore(subscribe, snapshot, () => null);
  if (!s) return <span className={`inline-block h-7 w-44 rounded-full bg-foreground/5 ${className}`} aria-hidden="true" />;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        s.open ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400" : "bg-primary/10 text-primary"
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {s.open && <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.open ? "bg-emerald-500" : "bg-primary"}`} />
      </span>
      {s.label}
    </span>
  );
}
