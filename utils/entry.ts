// Shared registration shape + validation, used by the API routes and the
// client components alike.

export const DEFAULT_COUNTRY_CODE = "+91";

export interface Entry {
  id: string;
  name: string;
  email: string;
  number: string;
  checkedin: boolean;
  checked_in_at: string | null;
  created_at: string;
}

export type EntryInput = Pick<Entry, "name" | "email" | "number">;

// Canonicalise to E.164 so "98765 43210", "+91 98765-43210" and
// "919876543210" all hit the same unique index. Numbers without a
// country code are treated as Indian.
export function normalizePhone(raw: unknown): string | null {
  const str = String(raw ?? "").trim();
  const hasPlus = str.startsWith("+");
  const digits = str.replace(/\D/g, "");

  if (!hasPlus) {
    if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
    if (/^0[6-9]\d{9}$/.test(digits)) return `+91${digits.slice(1)}`;
    if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
    return null;
  }
  if (digits.startsWith("91")) {
    return /^91[6-9]\d{9}$/.test(digits) ? `+${digits}` : null;
  }
  return /^\d{8,15}$/.test(digits) ? `+${digits}` : null;
}

export function formatPhone(number: string): string {
  const m = number.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `+91 ${m[1]} ${m[2]}` : number;
}

// Indian numbers without the country code ("98765 43210"). Anything else
// keeps its +code, since the number is ambiguous without it.
export function localPhone(number: string): string {
  const m = number.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `${m[1]} ${m[2]}` : number;
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

// Validates a full registration (create) or, with `partial`, only the
// fields present in the body (admin edit). Returns an error string on
// failure.
export function cleanEntryInput(
  body: Record<string, unknown>,
  { partial = false }: { partial?: boolean } = {}
): Partial<EntryInput> | string {
  const out: Partial<EntryInput> = {};

  if (!partial || "name" in body) {
    const name = String(body.name ?? "").trim().replace(/\s+/g, " ");
    if (!name) return "Please enter your name";
    if (name.length > 120) return "Name is too long";
    out.name = name;
  }

  if (!partial || "email" in body) {
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email) return "Please enter your email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
    out.email = email;
  }

  if (!partial || "number" in body) {
    if (!String(body.number ?? "").replace(/^\+\d{1,3}\s*$/, "").trim()) {
      return "Please enter your phone number";
    }
    const number = normalizePhone(body.number);
    if (!number) return "Enter a valid phone number, e.g. +91 98765 43210";
    out.number = number;
  }

  return out;
}
