"use client";

import { ArrowLeft, ArrowsOut, Broom, PencilSimple, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import Link from "next/link";

import { LampToggle } from "@/components/lamp-toggle";
import { cn } from "@/lib/cn";
import { pencil, usePencil } from "@/lib/pencil";

const ITEM =
  "inline-flex h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control px-3 text-[0.9375rem] font-semibold text-ink no-underline hover:bg-wash max-md:px-2.5";

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-6 w-0.5 rounded-full bg-ink/20" />;
}

// The desk's toolbar (notebook spec 4): Fit all, Tidy up (desktop only),
// the pencil, sound and the lamp, and the way back to the site. On phones
// only Fit and Back keep their labels. With Sound off, the pencil and the
// lamp switch quietly. `w-max`: centred with left-1/2, it would otherwise be
// squeezed to half the screen and wrap its labels.
export function Toolbar({
  desktop,
  soundOn,
  onSound,
  onFit,
  onTidy,
}: {
  desktop: boolean;
  soundOn: boolean;
  onSound: () => void;
  onFit: () => void;
  onTidy: () => void;
}) {
  const pencilOut = usePencil();

  return (
    <div
      role="toolbar"
      aria-label="Desk tools"
      className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-1/2 z-[var(--z-desk-ui)] flex w-max -translate-x-1/2 items-center gap-1 rounded-control border-2 border-ink bg-sheet p-1 print:hidden"
    >
      <button type="button" onClick={onFit} className={ITEM}>
        <ArrowsOut aria-hidden="true" size={18} weight="bold" />
        <span className="md:hidden">Fit</span>
        <span className="max-md:hidden">Fit all</span>
      </button>
      {desktop ? (
        <button type="button" onClick={onTidy} className={ITEM}>
          <Broom aria-hidden="true" size={18} weight="bold" />
          Tidy up
        </button>
      ) : null}
      <Divider />
      <button
        type="button"
        aria-pressed={pencilOut}
        aria-label="Pencil"
        title={pencilOut ? "Put the pencil down" : "Pick up the pencil and doodle on the paper"}
        onClick={() => pencil.toggle(!soundOn)}
        className={cn(ITEM, pencilOut && "bg-wash")}
      >
        <PencilSimple aria-hidden="true" size={18} weight="bold" />
        <span className="max-md:hidden">Pencil</span>
      </button>
      <button
        type="button"
        aria-pressed={soundOn}
        aria-label="Sound"
        title={soundOn ? "Turn the sound off" : "Turn the sound on"}
        onClick={onSound}
        className={cn(ITEM, soundOn && "bg-wash")}
      >
        {soundOn ? (
          <SpeakerHigh aria-hidden="true" size={18} weight="bold" />
        ) : (
          <SpeakerSlash aria-hidden="true" size={18} weight="bold" />
        )}
        <span className="max-md:hidden">Sound</span>
      </button>
      <LampToggle bare silent={!soundOn} />
      <Divider />
      <Link href="/" className={ITEM}>
        <ArrowLeft aria-hidden="true" size={18} weight="bold" />
        <span className="md:hidden">Site</span>
        <span className="max-md:hidden">Back to the site</span>
      </Link>
    </div>
  );
}
