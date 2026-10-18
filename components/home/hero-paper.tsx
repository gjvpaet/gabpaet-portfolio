"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";

import { InkSvg } from "@/components/ink/ink-svg";
import { CLICK_MARKS } from "@/lib/ink";
import { pencil } from "@/lib/pencil";

type Mark = { id: number; x: number; y: number; name: (typeof CLICK_MARKS)[number]; pen: boolean; rotate: number };

const MAX_MARKS = 6;
const MARK_LIFE_MS = 2600;

// The hero section, as paper you can mark (spec 5.2). Clicking empty paper
// (not a link, button or sticker, and not while the pencil is out) drops a
// hand-drawn star, check, scribble or burst that draws in and fades away.
export function HeroPaper({ children }: { children: ReactNode }) {
  const [marks, setMarks] = useState<Mark[]>([]);
  const count = useRef(0);

  function onClick(e: MouseEvent<HTMLElement>) {
    if (pencil.get()) return;
    const target = e.target as HTMLElement;
    if (target.closest("a, button, .sticker-drop")) return;
    const box = e.currentTarget.getBoundingClientRect();
    const id = ++count.current;
    const mark: Mark = {
      id,
      x: e.clientX - box.left - 26,
      y: e.clientY - box.top - 26,
      name: CLICK_MARKS[id % CLICK_MARKS.length],
      pen: id % 2 === 1,
      rotate: ((id * 37) % 40) - 20,
    };
    setMarks((all) => [...all, mark].slice(-MAX_MARKS));
    setTimeout(() => setMarks((all) => all.filter((m) => m.id !== id)), MARK_LIFE_MS);
  }

  return (
    <section id="hero" aria-labelledby="hero-name" onClick={onClick} className="relative pt-10 pb-20 md:pt-14 md:pb-28">
      {children}
      {marks.map((m) => (
        <InkSvg
          key={m.id}
          name={m.name}
          tone={m.pen ? "pen" : "ink"}
          draw={false}
          className="ink-mark absolute size-13"
          style={{ left: m.x, top: m.y, rotate: `${m.rotate}deg` }}
        />
      ))}
    </section>
  );
}
