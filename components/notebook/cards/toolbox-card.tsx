import { ToolChip } from "@/components/tool-chip";
import { DAILY_SENTENCE, LOOP_OF, TOOL_GROUPS, TOOL_ICONS } from "@/lib/toolbox";

// Notebook card: Toolbox (notebook spec 3). The home page's five groups of
// logo chips, the daily tools circled in pen. On the desk's landscape card
// each group is a row, its label beside its chips.
export function ToolboxCard() {
  return (
    <div className="grid gap-6 @2xl:gap-0">
      {/* The circles are pen only, so say which tools they mark. */}
      <p className="sr-only">{`Open every day: ${DAILY_SENTENCE}.`}</p>
      {TOOL_GROUPS.map((group) => (
        <div
          key={group.label}
          className="@2xl:grid @2xl:grid-cols-[8.5rem_1fr] @2xl:items-start @2xl:border-t-2 @2xl:border-ink @2xl:py-3 @2xl:first-of-type:border-t-0 @2xl:first-of-type:pt-0"
        >
          <h3 className="border-b-2 border-ink pb-2 text-base font-bold @2xl:border-b-0 @2xl:pt-2 @2xl:pb-0">{group.label}</h3>
          <ul className="mt-3.5 flex flex-wrap gap-x-2.5 gap-y-3 @2xl:mt-0">
            {group.items.map((item, i) => (
              <li key={item}>
                <ToolChip name={item} icon={TOOL_ICONS[item]} loop={LOOP_OF.get(item)} delay={0.2 + i * 0.08} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p aria-hidden="true" className="type-hand -rotate-2 text-pen print:hidden @2xl:mt-3">
        circled = open every day
      </p>
    </div>
  );
}
