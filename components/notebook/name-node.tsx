"use client";

import type { Node, NodeProps } from "@xyflow/react";

import { NameMark } from "@/components/notebook/name-mark";

export type NameNodeType = Node<Record<string, never>, "name">;

// React Flow node for the name (notebook spec 2). Not draggable or
// selectable, so React Flow gives it an inline `pointer-events: none` and a
// drag on the name pans the desk. Its ring is already drawn: the stand-in
// in Notebook drew it.
export function NameNode(_props: NodeProps<NameNodeType>) {
  return <NameMark draw={false} />;
}
