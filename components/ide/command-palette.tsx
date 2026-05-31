"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { usePalette } from "@/context/palette-provider";
import { getVisibleFiles, ICON_TEXT } from "@/lib/files";
import { FileIcon } from "./file-icon";

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, close } = usePalette();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const files = getVisibleFiles();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter(
      (f) =>
        f.id.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        f.lang.toLowerCase().includes(q),
    );
  }, [files, query]);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setIndex(0);
    const id = setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      clearTimeout(id);
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (index >= results.length) setIndex(0);
  }, [results.length, index]);

  if (!isOpen) return null;

  function openResult(i: number) {
    const f = results[i];
    if (!f) return;
    close();
    router.push(f.route);
  }

  function trapTab(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const root = dialogRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'input, button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-25 [backdrop-filter:blur(2px)]"
      style={{ background: "rgba(7,13,21,0.55)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Go to file"
        onKeyDown={trapTab}
        className="palette-dialog w-[560px] max-w-[90vw] overflow-hidden rounded-lg border border-[var(--border-2)] bg-[var(--panel)]"
        style={{ boxShadow: "0 24px 70px rgba(0,0,0,0.5)" }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              openResult(index);
            } else if (e.key === "Escape") {
              e.preventDefault();
              close();
            }
          }}
          placeholder="Go to file… (type to filter)"
          className="block w-full border-b border-[var(--border)] bg-transparent px-4.5 py-4 font-mono text-[14px] text-[var(--fg-bright)] outline-none placeholder:text-[var(--fg-dim)]"
        />
        <div className="max-h-[360px] overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <div className="px-4.5 py-1.5 text-[13px] text-[var(--fg-dim)]">no results</div>
          ) : (
            results.map((f, i) => {
              const isActive = i === index;
              const segs = f.id.split("/");
              const folder = segs.length > 1 ? segs.slice(0, -1).join("/") + "/" : "";
              return (
                <button
                  key={f.id}
                  type="button"
                  onMouseMove={() => {
                    if (i !== index) setIndex(i);
                  }}
                  onClick={() => openResult(i)}
                  className={[
                    "flex w-full items-center gap-2.5 px-4.5 py-[7px] text-left text-[13px]",
                    isActive
                      ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                      : "text-[var(--fg)]",
                  ].join(" ")}
                >
                  <FileIcon icon={f.icon} />
                  <span>{f.name}</span>
                  <span
                    className={[
                      "ml-auto text-[11.5px]",
                      isActive
                        ? "text-[var(--accent-ink)] opacity-80"
                        : "text-[var(--fg-dim)]",
                    ].join(" ")}
                  >
                    {folder || f.path}
                  </span>
                </button>
              );
            })
          )}
        </div>
        <div className="flex gap-4 border-t border-[var(--border)] px-4.5 py-2 text-[10.5px] text-[var(--fg-dim)]">
          <span>
            <Kbd>↑↓</Kbd> navigate
          </span>
          <span>
            <Kbd>↵</Kbd> open
          </span>
          <span>
            <Kbd>esc</Kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-[3px] border border-[var(--border)] bg-white/[.06] px-1.5 py-px font-mono text-[10px] text-[var(--fg)]">
      {children}
    </kbd>
  );
}

// Avoid "unused" warning while we wire incremental palette features.
void ICON_TEXT;
