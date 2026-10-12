// Spec 12: the first focusable element on every page; hidden until focused.
export function SkipLink() {
  return (
    <a
      href="#main"
      className={
        "tone-accent sr-only no-underline print:hidden focus:not-sr-only focus:fixed focus:top-3 focus:left-3 " +
        "focus:z-[var(--z-toast)] focus:rounded-control focus:border-3 focus:border-ink focus:bg-mint " +
        "focus:px-4 focus:py-3 focus:font-bold focus:shadow-brut-md"
      }
    >
      Skip to content
    </a>
  );
}
