"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Mosaic from "@/components/Mosaic";
import { EVENT } from "@/utils/event";

function LoginForm() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/verify";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Invalid passcode");
      } else {
        router.push(next);
        router.refresh();
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="passcode" className="field-label">
          Staff passcode
        </label>
        <input
          id="passcode"
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          required
          autoFocus
          placeholder="Enter passcode"
          className="field"
        />
      </div>
      {error && <div className="alert-error">{error}</div>}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Verifying…" : "Enter"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-grid flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-end justify-between text-cream">
          <div>
            <p className="eyebrow text-gold">Staff access</p>
            <p className="mt-1 font-serif text-5xl leading-none">{EVENT.name}</p>
          </div>
          <Mosaic size={18} gap={4} />
        </div>
        <div className="card p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
