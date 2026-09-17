"use client";

import { useState } from "react";
import EventPass from "./EventPass";
import { formatPhone, type Entry } from "@/utils/entry";

function checkedInLabel(entry: Entry): string {
  if (!entry.checkedin) return "Not scanned";
  if (!entry.checked_in_at) return "Scanned";
  const time = new Date(entry.checked_in_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  return `Scanned ${time}`;
}

export default function AdminSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Entry[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Entry | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [checkedin, setCheckedin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const runSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearching(true);
    setSearchError(null);
    setSelected(null);
    try {
      const res = await fetch(`/api/entries?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setResults(data);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Unknown error");
      setResults(null);
    } finally {
      setSearching(false);
    }
  };

  const select = (entry: Entry) => {
    setSelected(entry);
    setName(entry.name);
    setEmail(entry.email);
    setNumber(formatPhone(entry.number));
    setCheckedin(entry.checkedin);
    setSaveError(null);
    setSaveOk(false);
    setConfirmingDelete(false);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveError(null);
    setSaveOk(false);
    try {
      const res = await fetch(`/api/entries/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, number, checkedin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      select(data);
      setResults((prev) => prev?.map((e) => (e.id === data.id ? data : e)) ?? prev);
      setSaveOk(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/entries/${selected.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setResults((prev) => prev?.filter((e) => e.id !== selected.id) ?? prev);
      setSelected(null);
      setConfirmingDelete(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={runSearch} className="flex">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, email or phone"
          className="field border-r-0"
        />
        <button type="submit" disabled={searching} className="btn-primary w-auto shrink-0 px-5 py-2.5">
          {searching ? "Searching…" : "Search"}
        </button>
      </form>

      {searchError && <div className="alert-error">{searchError}</div>}

      {results && (
        <div className="space-y-2">
          <p className="eyebrow text-sand">
            {results.length === 50 ? "First 50 matches — narrow your search" : `${results.length} match${results.length === 1 ? "" : "es"}`}
          </p>
          <div className="card divide-y divide-rule">
            {results.map((entry) => (
              <button
                key={entry.id}
                onClick={() => select(entry)}
                className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-cream ${
                  selected?.id === entry.id ? "bg-cream" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{entry.name}</span>
                  <span className="block truncate text-sm text-umber">
                    {formatPhone(entry.number)} · {entry.email}
                  </span>
                </span>
                <span className={`eyebrow shrink-0 pt-1 ${entry.checkedin ? "text-forest" : "text-sand"}`}>
                  {entry.checkedin ? "Scanned" : "Not scanned"}
                </span>
              </button>
            ))}
            {results.length === 0 && <p className="px-4 py-6 text-center text-sm text-sand">No matches</p>}
          </div>
        </div>
      )}

      {selected && (
        <div className="card space-y-5 border-t-4 border-t-navy p-5">
          <div>
            <h2 className="font-serif text-2xl text-ink">Edit registration</h2>
            <p className="mt-0.5 break-all font-mono text-[0.65rem] text-sand">{selected.id}</p>
          </div>

          {saveError && <div className="alert-error">{saveError}</div>}
          {saveOk && <div className="alert-ok">Saved.</div>}

          <div>
            <label htmlFor="edit-name" className="field-label">Full name</label>
            <input id="edit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="edit-email" className="field-label">Email</label>
            <input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="edit-number" className="field-label">Phone number</label>
            <input id="edit-number" type="tel" value={number} onChange={(e) => setNumber(e.target.value)} className="field" />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={checkedin}
              onChange={(e) => setCheckedin(e.target.checked)}
              className="h-4 w-4 accent-navy"
            />
            Pass scanned
            <span className="text-xs text-sand">({checkedInLabel(selected)})</span>
          </label>

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3">
              {saving ? "Saving…" : "Save changes"}
            </button>
            {!confirmingDelete ? (
              <button
                onClick={() => setConfirmingDelete(true)}
                className="border border-brick/40 px-4 text-sm font-medium text-brick transition hover:bg-brick/5"
              >
                Delete
              </button>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-brick px-4 text-sm font-semibold text-cream transition hover:bg-brick/90 disabled:opacity-50"
                >
                  {deleting ? "Deleting…" : "Confirm"}
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="border border-rule px-4 text-sm text-umber transition hover:bg-cream"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="border-t border-rule pt-5">
            <p className="eyebrow mb-3 text-sand">Pass</p>
            <EventPass entry={selected} />
          </div>
        </div>
      )}
    </div>
  );
}
