"use client";

import { useSyncExternalStore } from "react";

import type { YearMonth } from "@/content/profile";
import { formatMonth, thisMonth } from "@/lib/dates";

const noop = () => () => {};

// The current month, "Oct 2026", for the hero's notebook-entry header (spec
// 7.1). Pages are built ahead of time, so the server renders the build's
// month (`built`) and the browser swaps in the visitor's own on hydration;
// the header never reads stale between deploys.
export function ThisMonth({ built, className }: { built: YearMonth; className?: string }) {
  const month = useSyncExternalStore(noop, thisMonth, () => built);
  return (
    <time dateTime={month} className={className}>
      {formatMonth(month)}
    </time>
  );
}
