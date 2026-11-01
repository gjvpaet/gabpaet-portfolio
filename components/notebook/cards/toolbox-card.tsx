import { ToolChip } from "@/components/tool-chip";
import { DAILY_SENTENCE, LOOP_OF, TOOL_GROUPS, TOOL_ICONS } from "@/lib/toolbox";

// Notebook card: Toolbox (notebook spec 3). The home page's five groups of
// logo chips, the daily tools circled in pen.
export function ToolboxCard() {
  return (
    <div className="grid gap-6">
      {/* The circles are pen only, so say which tools they mark. */}
      <p className="sr-only">{`Open every day: ${DAILY_SENTENCE}.`}</p>
      {TOOL_GROUPS.map((group) => (
        <div key={group.label}>
          <h3 className="border-b-2 border-ink pb-2 text-base font-bold">{group.label}</h3>
          <ul className="mt-3.5 flex flex-wrap gap-x-2.5 gap-y-3">
            {group.items.map((item, i) => (
              <li key={item}>
                <ToolChip name={item} icon={TOOL_ICONS[item]} loop={LOOP_OF.get(item)} delay={0.2 + i * 0.08} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p aria-hidden="true" className="type-hand -rotate-2 text-pen print:hidden">
        circled = open every day
      </p>
    </div>
  );
}
