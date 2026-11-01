import { InkSvg } from "@/components/ink/ink-svg";
import { profile } from "@/content/profile";
import { NAME_BOX } from "@/lib/notebook";

// The middle of the desk (notebook spec 2): the "gp" ring, the name, the
// role and where, and a handwritten hint (hidden on touch screens, where
// the tour says it instead). `draw={false}` on the desk's own copy: the
// stand-in before it has already drawn the ring.
export function NameMark({ draw = true }: { draw?: boolean }) {
  return (
    <div className="grid place-items-center text-center" style={{ width: NAME_BOX.width, height: NAME_BOX.height }}>
      <div>
        <span className="relative mx-auto flex size-16 items-center justify-center rounded-full">
          <InkSvg name="ring" stretch draw={draw} delay={0.2} className="absolute inset-0 size-full" />
          <span aria-hidden="true" className="font-hand -mt-1 text-[1.75rem] leading-none font-bold text-ink">
            gp
          </span>
        </span>
        <h1 className="mt-4 text-[2.75rem] leading-none font-[750] tracking-[-0.03em] whitespace-nowrap">
          {profile.shortName}
        </h1>
        <p className="type-meta mt-3 text-ink-soft">{profile.role}</p>
        <p className="type-meta text-ink-soft">{profile.location}</p>
        <p aria-hidden="true" className="desk-hint type-hand mt-4 -rotate-3 text-pen print:hidden">
          drag the paper around →
        </p>
      </div>
    </div>
  );
}
