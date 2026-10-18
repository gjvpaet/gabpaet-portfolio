import { InkArrow } from "@/components/ink/ink-arrow";
import { InkBox } from "@/components/ink/ink-box";
import { InkSvg } from "@/components/ink/ink-svg";
import { cn } from "@/lib/cn";

const STEPS = ["rough idea", "first version", "people use it"] as const;

// The hero's napkin (spec 7.1): how Gabriel likes to build, as three boxes
// and a loop back. It draws itself in after the hero text has risen.
// Readable as a list for screen readers; the boxes and arrows are decoration.
export function HowIBuildNapkin({ delay = 0.6 }: { delay?: number }) {
  return (
    <div className="grid gap-6">
      <p className="type-hand-title text-ink">how I like to build</p>
      <ol className="grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)_28px_minmax(0,1fr)] items-center">
        {STEPS.map((step, i) => (
          <li key={step} className="contents">
            {i > 0 ? (
              <InkArrow dir="right" tone="ink" rough={false} delay={delay + i * 0.45 - 0.1} className="justify-self-center" />
            ) : null}
            <InkBox
              rough={i % 2 ? "b" : "a"}
              delay={delay + i * 0.45}
              className={cn(
                "type-hand px-1.5 py-4 text-center leading-[1.2] text-balance text-ink",
                i === STEPS.length - 1 && "rounded-md bg-wash",
              )}
            >
              {step}
            </InkBox>
          </li>
        ))}
      </ol>
      <div className="-mt-6 grid gap-1">
        <InkSvg name="arrowLoop" tone="soft" rough="b" delay={delay + 1.4} stretch className="h-16 w-full" />
        <p className="type-hand-lg text-center text-pen">then make it better. repeat.</p>
      </div>
    </div>
  );
}
