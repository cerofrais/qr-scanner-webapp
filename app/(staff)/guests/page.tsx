import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/server";
import { formatPhone, type Entry } from "@/utils/entry";

const PAGE_SIZE = 20;

function istDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function istClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
}

function PageLink({ page, disabled, children }: { page: number; disabled: boolean; children: React.ReactNode }) {
  const base = "border px-4 py-2 text-sm font-medium transition";
  if (disabled) {
    return <span className={`${base} border-rule text-sand`}>{children}</span>;
  }
  return (
    <Link href={`/guests?page=${page}`} className={`${base} border-rule bg-paper text-ink-soft hover:border-taupe hover:text-ink`}>
      {children}
    </Link>
  );
}

// Reading searchParams makes this render per request, so the list is
// always current.
export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = (await searchParams).page;
  const requested = Math.max(1, Number.parseInt((Array.isArray(raw) ? raw[0] : raw) ?? "1", 10) || 1);

  const supabase = createClient();
  const [totalRes, checkedInRes] = await Promise.all([
    supabase.from("entries").select("*", { count: "exact", head: true }),
    supabase.from("entries").select("*", { count: "exact", head: true }).eq("checkedin", true),
  ]);

  const total = totalRes.count ?? 0;
  const checkedIn = checkedInRes.count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, pages);
  const from = (page - 1) * PAGE_SIZE;

  const { data, error } = await supabase
    .from("entries")
    .select()
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  const entries = (data ?? []) as Entry[];
  const loadError = totalRes.error ?? checkedInRes.error ?? error;

  return (
    <>
      <PageHeader eyebrow="Guest list" title="All registrations">
        {total} registered · {checkedIn} checked in
      </PageHeader>

      <a href="/api/entries/export" download className="btn-secondary mb-6">
        Download CSV
      </a>

      {loadError && <div className="alert-error mb-4">{loadError.message}</div>}

      {!loadError && entries.length === 0 ? (
        <div className="card px-6 py-12 text-center text-sm text-sand">No registrations yet.</div>
      ) : (
        <ol className="card divide-y divide-rule">
          {entries.map((entry, i) => (
            <li key={entry.id} className="flex items-start gap-3 px-4 py-3">
              <span className="w-7 shrink-0 pt-0.5 text-right text-xs tabular-nums text-sand">{from + i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate font-medium text-ink">{entry.name}</p>
                  <span className={`eyebrow shrink-0 pt-0.5 ${entry.checkedin ? "text-forest" : "text-sand"}`}>
                    {entry.checkedin
                      ? `Scanned${entry.checked_in_at ? ` ${istClock(entry.checked_in_at)}` : ""}`
                      : "Not scanned"}
                  </span>
                </div>
                <p className="truncate text-sm text-umber">
                  {formatPhone(entry.number)} · {entry.email}
                </p>
                <p className="mt-0.5 text-xs text-sand">Registered {istDateTime(entry.created_at)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {total > PAGE_SIZE && (
        <nav className="mt-5 flex items-center justify-between gap-3" aria-label="Pagination">
          <PageLink page={page - 1} disabled={page <= 1}>
            ‹ Previous
          </PageLink>
          <p className="text-center text-xs text-umber">
            Page {page} of {pages}
            <span className="block text-sand">
              {from + 1}–{from + entries.length} of {total}
            </span>
          </p>
          <PageLink page={page + 1} disabled={page >= pages}>
            Next ›
          </PageLink>
        </nav>
      )}
    </>
  );
}
