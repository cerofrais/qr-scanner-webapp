// Smoke test against the configured Supabase project: insert → check in →
// read back → delete. Cleans up after itself, so it's safe to run on the
// live table.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Missing env vars.");
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY");
  console.error("(entries has no policies for the public key — the secret key is required.)");
  process.exit(1);
}

const supabase = createClient(url, key);

async function assertTableExists() {
  const { error } = await supabase.from("entries").select("id,name,email,number,checked_in_at").limit(1);

  if (error) {
    if (error.message?.includes("Could not find the table 'public.entries'")) {
      console.error("Table public.entries does not exist in your Supabase project.");
      console.error("Run scripts/setup_entries.sql in the Supabase SQL Editor, then retry.");
      process.exit(1);
    }
    if (error.message?.includes("checked_in_at")) {
      console.error("public.entries is on the old schema. Apply supabase/migrations/ (supabase db push), then retry.");
      process.exit(1);
    }

    console.error("Failed while checking table access:", error.message);
    process.exit(1);
  }
}

async function run() {
  await assertTableExists();

  const suffix = Date.now().toString().slice(-6);
  const sample = [
    { name: `Test Guest ${suffix}-1`, email: `test-${suffix}-1@example.com`, number: `+9199990${suffix.slice(0, 5)}` },
    { name: `Test Guest ${suffix}-2`, email: `test-${suffix}-2@example.com`, number: `+9188880${suffix.slice(0, 5)}` },
  ];

  const { data: inserted, error: insertError } = await supabase.from("entries").insert(sample).select();

  if (insertError) {
    console.error("Insert failed:", insertError.message);
    process.exit(1);
  }

  const ids = inserted.map((row) => row.id);

  try {
    const { data: updated, error: updateError } = await supabase
      .from("entries")
      .update({ checkedin: true, checked_in_at: new Date().toISOString() })
      .eq("id", ids[0])
      .eq("checkedin", false)
      .select()
      .single();

    if (updateError) throw new Error(`Update failed: ${updateError.message}`);

    const { data: again } = await supabase
      .from("entries")
      .update({ checkedin: true })
      .eq("id", ids[0])
      .eq("checkedin", false)
      .select();

    if (again?.length) throw new Error("Second check-in should have matched no rows");

    console.log("Entries test passed.");
    console.log("Inserted rows:", inserted.length);
    console.log("Checked in:", updated.id, "at", updated.checked_in_at, "(second scan correctly rejected)");
  } finally {
    const { error: deleteError } = await supabase.from("entries").delete().in("id", ids);
    if (deleteError) console.error("Cleanup failed — delete these ids manually:", ids, deleteError.message);
    else console.log("Cleaned up test rows.");
  }
}

run().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
