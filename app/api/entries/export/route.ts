import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { EVENT } from "@/utils/event";
import { localPhone, type Entry } from "@/utils/entry";

// PostgREST caps each response at 1,000 rows, so page through.
const PAGE_SIZE = 1000;

// Registration is public, so names and emails are guest-controlled.
// Spreadsheet apps run cells starting with = + - @ as formulas; prefixing
// a quote makes them plain text. Phones are written as "98765 43210":
// no leading +, and the space keeps spreadsheets from turning them into
// numbers.
function textCell(value: string | null): string {
  const str = value ?? "";
  return /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
}

function csvEscape(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

// sv-SE formats as "2026-09-27 14:05:12", which spreadsheets sort correctly.
function ist(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }) : "";
}

export async function GET() {
  const supabase = createClient();
  const rows: Entry[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("entries")
      .select()
      .order("created_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
  }

  const header = ["Name", "Email", "Phone", "Checked in", "Checked in at (IST)", "Registered at (IST)", "Pass ID"];
  const lines = [
    header,
    ...rows.map((r) => [
      textCell(r.name),
      textCell(r.email),
      localPhone(r.number),
      r.checkedin ? "Yes" : "No",
      ist(r.checked_in_at),
      ist(r.created_at),
      r.id,
    ]),
  ].map((cols) => cols.map(csvEscape).join(","));

  const date = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Kolkata" });

  // Leading BOM so Excel reads the file as UTF-8 (non-Latin names).
  return new NextResponse(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${EVENT.name}-registrations-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
