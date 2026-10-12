import { ArrowDown, ArrowRight } from "@phosphor-icons/react/ssr";

import type { ArchitectureNode } from "@/content/projects";

// Spec 6.14: outlined boxes joined by 3px ink connectors, left to right on
// md+ and top to bottom on phones. Plain HTML, so it reads as an ordered list.
export function ArchitectureDiagram({ nodes, label }: { nodes: ArchitectureNode[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-col md:flex-row md:items-stretch">
      {nodes.map((node, i) => (
        <li key={node.label} className="flex flex-col md:flex-1 md:flex-row">
          <div className="grid flex-1 content-start gap-1.5 rounded-control border-3 border-ink bg-surface p-4 shadow-brut-sm">
            <span className="font-bold [font-stretch:110%]">{node.label}</span>
            {node.detail ? <span className="type-meta text-ink-muted">{node.detail}</span> : null}
          </div>
          {i < nodes.length - 1 ? (
            <span aria-hidden="true" className="flex flex-col items-center justify-center py-1 md:flex-row md:px-1 md:py-0">
              <span className="h-4 w-[3px] bg-ink md:h-[3px] md:w-4" />
              <ArrowDown size={18} weight="bold" className="-mt-1 md:hidden" />
              <ArrowRight size={18} weight="bold" className="-ml-1 hidden md:block" />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
