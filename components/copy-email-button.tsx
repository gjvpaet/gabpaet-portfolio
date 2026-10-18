"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { buttonClasses } from "@/components/button";

type Status = "idle" | "copied" | "manual";

const RESET_MS: Record<Status, number> = { idle: 0, copied: 2000, manual: 3000 };

// Spec 6.11. Copies the address; if the Clipboard API is missing or refuses,
// selects the visible address instead and tells the visitor which keys to press.
export function CopyEmailButton({
  email,
  selectTargetId,
  className,
}: {
  email: string;
  /** id of the element showing the address, selected when copying fails. */
  selectTargetId: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [shortcut, setShortcut] = useState("Ctrl+C");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function show(next: Status) {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), RESET_MS[next]);
  }

  function selectAddress() {
    const target = document.getElementById(selectTargetId);
    const selection = window.getSelection();
    if (!target || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      show("copied");
    } catch {
      selectAddress();
      setShortcut(/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘C" : "Ctrl+C");
      show("manual");
    }
  }

  const label = status === "copied" ? "Copied" : status === "manual" ? `Press ${shortcut} to copy` : "Copy email";

  return (
    <>
      <button type="button" onClick={copy} className={buttonClasses("secondary", className)}>
        <span aria-hidden="true" className="inline-flex size-5 items-center justify-center">
          {status === "copied" ? <Check size={20} weight="bold" /> : <Copy size={20} weight="bold" />}
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={label}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </button>
      <span className="sr-only" aria-live="polite">
        {status === "idle" ? "" : label}
      </span>
    </>
  );
}
