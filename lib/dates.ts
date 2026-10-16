import type { Role, YearMonth } from "@/content/profile";

// Date helpers for roles. Computed notes ("Programmer to Senior in 8
// months") come from here so they can never drift from `titles`.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parse(ym: YearMonth): { year: number; month: number } {
  const [year, month] = ym.split("-").map(Number);
  return { year, month };
}

/** Whole months from `from` to `to` (2017-05 to 2024-01 is 80). */
export function monthsBetween(from: YearMonth, to: YearMonth): number {
  const a = parse(from);
  const b = parse(to);
  return (b.year - a.year) * 12 + (b.month - a.month);
}

/** 80 → "6 years, 8 months"; 8 → "8 months"; 12 → "1 year". */
export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [
    years ? `${years} ${years === 1 ? "year" : "years"}` : "",
    rest ? `${rest} ${rest === 1 ? "month" : "months"}` : "",
  ].filter(Boolean);
  return parts.join(", ") || "0 months";
}

/** "2026-05" → "May 2026". */
export function formatMonth(ym: YearMonth): string {
  const { year, month } = parse(ym);
  return `${MONTHS[month - 1]} ${year}`;
}

/** First and last month across every title held at the company. */
export function roleSpan(role: Role): { from: YearMonth; to?: YearMonth } {
  return { from: role.titles[role.titles.length - 1].from, to: role.titles[0].to };
}

/** The handwritten margin date: "May 2026 → now", "May 2017 → Jan 2024". */
export function handRange(role: Role): string {
  const { from, to } = roleSpan(role);
  return `${formatMonth(from)} → ${to ? formatMonth(to) : "now"}`;
}

/** Same span as plain years for compact rows: "2015 → 2016". */
export function handYears(role: Role): string {
  const { from, to } = roleSpan(role);
  const a = parse(from).year;
  const b = to ? parse(to).year : "now";
  return a === b ? `${a}` : `${a} → ${b}`;
}

// "{promotion}": "Programmer to Senior in 8 months", from the two oldest
// titles. The newer title is shortened to what changed ("Senior").
function promotion(role: Role): string {
  const [older, newer] = [...role.titles].reverse();
  if (!older || !newer) return "";
  const changed = newer.title.replace(older.title, "").trim() || newer.title;
  return `${older.title} to ${changed} in ${formatDuration(monthsBetween(older.from, newer.from))}`;
}

// "{tenure}": the whole stay, "6 years, 8 months". Ongoing roles have no
// end month to count to, so they never use it.
function tenure(role: Role): string {
  const { from, to } = roleSpan(role);
  return to ? formatDuration(monthsBetween(from, to)) : "";
}

/** The role's margin note with its placeholders filled in, or undefined. */
export function roleNote(role: Role): string | undefined {
  if (!role.note) return undefined;
  return role.note.replace("{promotion}", promotion(role)).replace("{tenure}", tenure(role));
}
