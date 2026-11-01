"use client";

import { X } from "@phosphor-icons/react";
import type { Node, NodeProps } from "@xyflow/react";
import type { CSSProperties } from "react";

import { Tape } from "@/components/ink/tape";
import { CardIcon } from "@/components/notebook/card-icon";
import { useCardBody, useDeskActions } from "@/components/notebook/desk-context";
import { CARD_SIZE, CARD_TITLES, HOME, type CardId } from "@/lib/notebook";

export type CardNodeType = Node<{ id: CardId }, "card">;

// A taped-in sheet on the desk (notebook spec 3): a title bar to drag it by
// (React Flow's dragHandle, `.card-handle`), × to put it away, and the body,
// which never scrolls (each card is sized to fit it, lib/notebook.ts) and
// keeps text selectable (`nodrag`). The body is a size container, so a
// landscape card can lay its body out in columns (`@2xl:`); the phone sheet
// is not one, so there the same body stays a single column. It settles at its own tilt; globals.css lifts and straightens
// it while dragged.
export function CardNode({ data }: NodeProps<CardNodeType>) {
  const { id } = data;
  const body = useCardBody(id);
  const { close } = useDeskActions();
  const title = CARD_TITLES[id];
  const tilt = HOME[id].tilt;

  return (
    <section
      aria-labelledby={`card-${id}-h`}
      className="desk-card paper relative"
      style={{ width: CARD_SIZE[id].width, "--tilt": `${tilt}deg` } as CSSProperties}
    >
      <Tape className="-top-3 left-1/2 h-6.5 w-20 -ml-10" style={{ rotate: `${-tilt * 2}deg` }} />
      <header className="mx-5 flex items-center gap-2.5 border-b-2 border-ink pt-3 pb-2">
        {/* The handle's children ignore the pointer, so it always lands on
            the handle itself: the grab cursor (globals.css), and the pen
            cursor's native-cursor check (lib/pointer-targets.ts). × sits
            outside it, so the pen cursor rings it like any button. */}
        <div className="card-handle flex min-h-11 flex-1 cursor-grab items-center gap-2.5 active:cursor-grabbing">
          <span className="pointer-events-none flex">
            <CardIcon id={id} />
          </span>
          <h2 id={`card-${id}-h`} className="pointer-events-none flex-1 text-[1.1875rem] leading-tight font-bold">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => close(id)}
          aria-label={`Put away ${title}`}
          className="nodrag group -mr-1 grid size-11 cursor-pointer place-items-center"
        >
          <span className="grid size-9 place-items-center rounded-full border-2 border-ink bg-sheet text-ink group-hover:bg-wash">
            <X aria-hidden="true" size={16} weight="bold" />
          </span>
        </button>
      </header>
      <div className="nodrag @container cursor-auto px-5 pt-4 pb-5 select-text">
        {body}
      </div>
    </section>
  );
}
