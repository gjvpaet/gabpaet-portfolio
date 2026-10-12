import type { SimpleIcon } from "simple-icons";

// Renders a Simple Icons mark in currentColor (spec 6.12). Path data comes from
// the package; never hand-draw brand paths.
export function BrandIcon({
  icon,
  size = 24,
  decorative = false,
  className,
}: {
  icon: SimpleIcon;
  size?: number;
  /** Hide from assistive tech when the surrounding text already names it. */
  decorative?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": icon.title })}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}
