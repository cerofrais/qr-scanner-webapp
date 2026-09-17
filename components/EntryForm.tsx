"use client";

import { useEffect, useRef, useState } from "react";
import EventPass from "./EventPass";
import WelcomeNote from "./WelcomeNote";
import { DEFAULT_COUNTRY_CODE, type Entry } from "@/utils/entry";

// `guest` is the public /register flow (welcome note after submit);
// `staff` is the /onboard flow (register-another loop).
export default function EntryForm({ variant = "staff" }: { variant?: "guest" | "staff" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Entry | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const isGuest = variant === "guest";

  useEffect(() => {
    if (created) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [created]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // A number pasted with its own "+code" wins over the code box.
    const local = number.trim();
    const fullNumber = local.startsWith("+") ? local : `${countryCode}${local.replace(/^0+/, "")}`;

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, number: fullNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setCreated(data);
      setName("");
      setEmail("");
      setCountryCode(DEFAULT_COUNTRY_CODE);
      setNumber("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <div ref={topRef} className="scroll-mt-6 space-y-5">
        {isGuest ? (
          <WelcomeNote name={created.name} />
        ) : (
          <div className="alert-ok">
            Registered <strong className="font-semibold">{created.name}</strong>. Hand over or print the pass below.
          </div>
        )}
        <EventPass entry={created} />
        <button
          onClick={() => setCreated(null)}
          className={isGuest ? "w-full py-2 text-sm text-umber underline underline-offset-4 hover:text-ink" : "btn-secondary"}
        >
          {isGuest ? "Register someone else" : "Register another guest"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${isGuest ? "card border-t-4 border-t-navy p-5 sm:p-7" : ""}`}>
      {error && <div className="alert-error">{error}</div>}

      <div>
        <label htmlFor="entry-name" className="field-label">
          Full name
        </label>
        <input
          id="entry-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          placeholder="e.g. Ananya Rao"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="entry-email" className="field-label">
          Email
        </label>
        <input
          id="entry-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="entry-number" className="field-label">
          Phone number
        </label>
        <div className="flex">
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(`+${e.target.value.replace(/\D/g, "").slice(0, 3)}`)}
            aria-label="Country code"
            autoComplete="tel-country-code"
            inputMode="tel"
            className="field w-[4.5rem] shrink-0 border-r-0 bg-cream/60 px-2 text-center font-medium"
          />
          <input
            id="entry-number"
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            autoComplete="tel-national"
            inputMode="tel"
            placeholder="98765 43210"
            className="field"
          />
        </div>
        <p className="mt-1.5 text-xs text-sand">One pass per phone number.</p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Creating your pass…" : isGuest ? "Get my pass" : "Register & generate pass"}
      </button>
    </form>
  );
}
