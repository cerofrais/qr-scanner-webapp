// The four-square moodboard mark from the deck cover.
const SQUARES = ["bg-magenta", "bg-gold", "bg-terracotta", "bg-saffron"];

export default function Mosaic({ size = 48, gap = 4, className = "" }: { size?: number; gap?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`grid shrink-0 grid-cols-2 ${className}`}
      style={{ width: size * 2 + gap, gap }}
    >
      {SQUARES.map((bg) => (
        <span key={bg} className={bg} style={{ width: size, height: size }} />
      ))}
    </div>
  );
}
