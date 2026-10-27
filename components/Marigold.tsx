// Brand mark for the Diwali edition: a marigold rosette, which doubles as
// a firework at small sizes. Petal colours come from the flyer.
const PETALS = 8;

export default function Marigold({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* Outer ring of petals, then an inner ring offset by half a step. */}
      {Array.from({ length: PETALS }, (_, i) => (
        <ellipse
          key={`outer-${i}`}
          cx="24"
          cy="8.5"
          rx="5.2"
          ry="7.5"
          fill="var(--color-marigold)"
          transform={`rotate(${(360 / PETALS) * i} 24 24)`}
        />
      ))}
      {Array.from({ length: PETALS }, (_, i) => (
        <ellipse
          key={`inner-${i}`}
          cx="24"
          cy="14"
          rx="4.4"
          ry="6"
          fill="var(--color-gold)"
          transform={`rotate(${(360 / PETALS) * i + 360 / (PETALS * 2)} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="6.5" fill="var(--color-rose)" />
    </svg>
  );
}
