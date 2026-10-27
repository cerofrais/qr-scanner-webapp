// The Late Checkout wordmark, traced from the brand PDF. Drawn as a mask so
// it takes whatever `color` the surface sets (maroon on parchment, cream on
// maroon) from one asset.
const RATIO = 946 / 402; // the SVG's viewBox

export default function LateCheckoutLogo({ width = 160, className = "" }: { width?: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label="Late Checkout"
      className={`logo-mask inline-block shrink-0 ${className}`}
      style={{ width, height: width / RATIO }}
    />
  );
}
