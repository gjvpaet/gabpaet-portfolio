"use client";

import { useSidebar } from "@/context/sidebar-provider";

/**
 * Dim layer behind the mobile sidebar drawer. The element is always in the
 * tree; CSS in globals.css keeps it `display: none` until `.open` is added
 * (and the @media (max-width: 900px) block is what makes the sidebar a
 * drawer to begin with). Clicking the backdrop closes the drawer.
 */
export function SidebarBackdrop() {
  const { isOpen, close } = useSidebar();
  return (
    <div
      className={`sidebar-backdrop ${isOpen ? "open" : ""}`}
      onClick={close}
      aria-hidden
    />
  );
}
