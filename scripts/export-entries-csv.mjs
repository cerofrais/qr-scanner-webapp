// Exports every registration in Supabase to a CSV.
//
// Usage: node scripts/export-entries-csv.mjs [output.csv]
import { createClient } from "@supabase/supabase-js";
import { writeFile } from "node:fs/promises";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Missing env vars.");
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const outPath = process.argv[2] ?? "entries.csv";
const PAGE_SIZE = 1000;

const supabase = createClient(url, key);

function csvEscape(value) {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function fetchAll() {
  // PostgREST caps each response at 1,000 rows, so page through.
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("entries")
      .select("name, email, number, checkedin, checked_in_at, created_at")
      .order("created_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error("Failed to fetch entries:", error.message);
      process.exit(1);
    }
    rows.push(...data);
    if (data.length < PAGE_SIZE) return rows;
  }
}

async function run() {
  const rows = await fetchAll();

  const header = ["Name", "Email", "Number", "Checked In", "Checked In At", "Created At"];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [r.name, r.email, r.number, r.checkedin ? "yes" : "no", r.checked_in_at, r.created_at].map(csvEscape).join(",")
    ),
  ];

  await writeFile(outPath, lines.join("\n") + "\n", "utf8");
  console.log(`Wrote ${rows.length} rows to ${outPath}`);
}

run().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
