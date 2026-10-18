import { ArrowDown, FileText } from "@phosphor-icons/react/ssr";
import type { CSSProperties } from "react";

import { ButtonLink } from "@/components/button";
import { InkArrow } from "@/components/ink/ink-arrow";
import { InkCircle } from "@/components/ink/ink-circle";
import { InkStrike } from "@/components/ink/ink-strike";
import { HeroPaper } from "@/components/home/hero-paper";
import { StickerBoard } from "@/components/home/sticker-board";
import { HowIBuildNapkin } from "@/components/napkins/how-i-build";
import { PaperCard } from "@/components/paper-card";
import { profile } from "@/content/profile";

const rise = (i: number) => ({ "--i": i }) as CSSProperties;

// Spec 7.1: split hero. Left: a "hi, I'm" note, the name, the crossed-out
// draft and the circled title, one line, two buttons. Right: the napkin card
// with taped logo stickers around it. The pen draws in after the text rises.
export function Hero() {
  return (
    <HeroPaper>
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <div className="min-w-0">
          <div className="rise mb-1.5 flex items-end gap-1.5" style={rise(0)}>
            <p className="type-hand-lg -rotate-3 text-pen">hi, I&apos;m</p>
            <InkArrow dir="down-right" delay={0.5} className="-mb-4" />
          </div>
          <h1 id="hero-name" className="type-display rise" style={rise(1)}>
            {profile.name}
          </h1>
          <div className="rise mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5" style={rise(2)}>
            <span className="type-hand-lg text-ink-soft">
              <InkStrike delay={0.8}>{profile.heroDraft}</InkStrike>
            </span>
            <InkCircle delay={1.1} className="text-[1.75rem] leading-tight font-[650] tracking-[-0.01em]">
              {profile.role}
            </InkCircle>
          </div>
          <p className="type-lead rise mt-7 max-w-[34ch] text-ink-soft" style={rise(3)}>
            {profile.heroLine}
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3.5" style={rise(4)}>
            <ButtonLink href="/resume" variant="primary" icon={<FileText size={20} weight="bold" />}>
              Résumé
            </ButtonLink>
            <ButtonLink href="/#projects" icon={<ArrowDown size={20} weight="bold" />}>
              See projects
            </ButtonLink>
          </div>
        </div>

        {/* lg:pr-10 leaves room for the stickers taped over the right edge. */}
        <div className="mx-auto w-full max-w-[500px] md:pt-6 md:pb-10 lg:pt-0 lg:pr-10 xl:pr-0">
          <StickerBoard tools="Tools I use daily: Claude, Next.js, Node.js, PostgreSQL and Docker.">
            <PaperCard rotate={1.4} tape="top" className="ink-boil px-6 pt-9 pb-6 sm:px-8.5 sm:pt-10 sm:pb-7">
              <HowIBuildNapkin delay={0.9} />
            </PaperCard>
          </StickerBoard>
          <p className="type-hand mt-8 -rotate-2 text-right text-pen md:mt-4">click the paper, it leaves a mark</p>
        </div>
      </div>
    </HeroPaper>
  );
}
