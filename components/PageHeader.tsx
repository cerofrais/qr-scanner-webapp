export default function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="eyebrow text-brick">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-3xl leading-tight text-ink">{title}</h1>
      {children && <p className="mt-1.5 text-sm text-umber">{children}</p>}
    </div>
  );
}
