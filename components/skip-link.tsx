// Spec 12: the first focusable element on every page; hidden until focused,
// then shown as a primary button in the top-left corner.
export function SkipLink() {
  return (
    <a
      href="#main"
      className={
        "sr-only no-underline print:hidden focus:not-sr-only focus:fixed focus:top-3 focus:left-3 " +
        "focus:z-[var(--z-toast)] focus:rounded-control focus:border-2 focus:border-ink focus:bg-btn focus:text-on-btn " +
        "focus:px-4 focus:py-3 focus:font-semibold"
      }
    >
      Skip to content
    </a>
  );
}
