// Rangoli motif: concentric rings of petals and dots around a lotus centre,
// drawn in the flyer's marigold / rose / gold / olive.
//
// Rings are generated so the geometry stays exact at any size; `detail`
// drops the outer rings for small placements (nav bar, pass header).
const ring = (count: number, offset = 0) =>
  Array.from({ length: count }, (_, i) => (360 / count) * i + offset);

export default function Rangoli({
  size = 160,
  detail = "full",
  className = "",
}: {
  size?: number;
  detail?: "full" | "simple";
  className?: string;
}) {
  const simple = detail === "simple";

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {!simple && (
        <>
          {/* Outer dotted halo */}
          {ring(24).map((a) => (
            <circle key={`halo-${a}`} cx="100" cy="6" r="2.6" fill="var(--color-gold)" transform={`rotate(${a} 100 100)`} />
          ))}
          {/* Outer petal ring */}
          {ring(16).map((a) => (
            <path
              key={`outer-${a}`}
              d="M100 16 C108 30 108 44 100 54 C92 44 92 30 100 16 Z"
              fill="var(--color-marigold)"
              transform={`rotate(${a} 100 100)`}
            />
          ))}
        </>
      )}

      {/* Scalloped band */}
      {ring(12, simple ? 0 : 11.25).map((a) => (
        <circle key={`band-${a}`} cx="100" cy="62" r="7" fill="var(--color-rose)" transform={`rotate(${a} 100 100)`} />
      ))}

      {/* Inner lotus petals */}
      {ring(8).map((a) => (
        <path
          key={`lotus-${a}`}
          d="M100 52 C112 68 112 84 100 96 C88 84 88 68 100 52 Z"
          fill="var(--color-gold)"
          transform={`rotate(${a} 100 100)`}
        />
      ))}
      {ring(8, 22.5).map((a) => (
        <path
          key={`lotus2-${a}`}
          d="M100 68 C108 78 108 88 100 97 C92 88 92 78 100 68 Z"
          fill="var(--color-olive)"
          transform={`rotate(${a} 100 100)`}
        />
      ))}

      {/* Centre */}
      <circle cx="100" cy="100" r="19" fill="var(--color-maroon)" />
      <circle cx="100" cy="100" r="12" fill="var(--color-marigold)" />
      {ring(6).map((a) => (
        <circle key={`core-${a}`} cx="100" cy="94" r="2.4" fill="var(--color-maroon)" transform={`rotate(${a} 100 100)`} />
      ))}
    </svg>
  );
}
