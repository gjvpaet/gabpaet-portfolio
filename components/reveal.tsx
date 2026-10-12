"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

// Fades and lifts its content in the first time it scrolls into view
// (spec 5, "Section reveal"). The hidden state lives in globals.css behind
// the `.js` class, so without JavaScript, or with reduced motion, the
// content is simply visible. `index` staggers siblings by 60ms each.
//
// Wrap a card or tile rather than putting this on it: the reveal owns
// `transition`, which would otherwise replace the element's press transition.
export function Reveal({
  as: Tag = "div",
  index = 0,
  children,
  className,
}: {
  as?: ElementType;
  index?: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      // Fires once any part is 15% above the bottom edge; a ratio threshold
      // could never be reached by an element taller than the viewport.
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-shown={shown ? "" : undefined}
      style={{ "--i": index } as CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}
