import { ArrowDown, FileText } from "@phosphor-icons/react/ssr";
import type { CSSProperties } from "react";

import { ButtonLink } from "@/components/button";
import { StatusChip } from "@/components/chip";
import { StickerBoard } from "@/components/home/sticker-board";
import { profile } from "@/content/profile";

// Spec 7.1: split hero, text left (7 cols), sticker board right (5 cols).
// Four text elements: status chip, name, one line, buttons.
export function Hero() {
  const words = profile.name.split(" ");

  return (
    <section id="hero" aria-labelledby="hero-name" className="pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
        <div className="grid min-w-0 gap-6 md:col-span-7">
          <div className="rise" style={{ "--i": 0 } as CSSProperties}>
            <StatusChip>{profile.status}</StatusChip>
          </div>
          <h1 id="hero-name" className="type-display rise" style={{ "--i": 1 } as CSSProperties}>
            {words.map((word, i) => (
              <span key={word} className="block">
                {word}
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p className="rise max-w-[34ch] text-[1.1875rem] leading-normal" style={{ "--i": 2 } as CSSProperties}>
            {profile.heroLine}
          </p>
          <div className="rise flex flex-wrap gap-4" style={{ "--i": 3 } as CSSProperties}>
            <ButtonLink href="/resume" variant="primary" icon={<FileText size={20} weight="bold" />}>
              Resume
            </ButtonLink>
            <ButtonLink href="/#projects" icon={<ArrowDown size={20} weight="bold" />}>
              See projects
            </ButtonLink>
          </div>
        </div>
        <div className="md:col-span-5">
          <StickerBoard tools="Tools I use daily: Claude, Next.js, Node.js, PostgreSQL and Docker." />
        </div>
      </div>
    </section>
  );
}
