import { InkArrow } from "@/components/ink/ink-arrow";
import { InkBox } from "@/components/ink/ink-box";
import type { ArchitectureNode } from "@/content/projects";

// Spec 8.1: the architecture as a whiteboard sketch. Hand-drawn boxes with
// clean labels, joined by drawn arrows: left to right from lg, top to bottom
// below. Still an ordered list, so it reads in data-flow order.
export function WhiteboardDiagram({ nodes, label }: { nodes: ArchitectureNode[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-col lg:flex-row lg:items-stretch">
      {nodes.map((node, i) => (
        <li key={node.label} className="flex flex-col lg:flex-1 lg:flex-row">
          <InkBox
            rough={i % 2 ? "b" : "a"}
            delay={0.15 + i * 0.4}
            className="grid flex-1 content-start gap-1.5 rounded-md bg-sheet px-5 py-4.5"
          >
            <span className="font-semibold">{node.label}</span>
            {node.detail ? <span className="text-base leading-snug text-ink-soft">{node.detail}</span> : null}
          </InkBox>
          {i < nodes.length - 1 ? (
            <span aria-hidden="true" className="grid place-items-center py-2 lg:px-2 lg:py-0">
              <InkArrow dir="down" tone="ink" rough={false} delay={0.4 + i * 0.4} className="lg:hidden" />
              <InkArrow dir="right" tone="ink" rough={false} delay={0.4 + i * 0.4} className="hidden lg:block" />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
