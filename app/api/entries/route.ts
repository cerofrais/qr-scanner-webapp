import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cleanEntryInput } from "@/utils/entry";

const SEARCH_LIMIT = 50;

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const input = cleanEntryInput(body);
  if (typeof input === "string") {
    return NextResponse.json({ error: input }, { status: 400 });
  }

  const { data, error } = await supabase.from("entries").insert(input).select().single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "This phone number is already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// Admin search. Filtering happens in Postgres — PostgREST caps responses
// at 1,000 rows, so fetching everything and filtering here would silently
// miss older registrations.
export async function GET(request: NextRequest) {
  const supabase = createClient();

  // Strip characters that have meaning inside a PostgREST or() filter.
  const q = (request.nextUrl.searchParams.get("q") ?? "").replace(/[,()"\\%*]/g, " ").trim();

  let query = supabase
    .from("entries")
    .select()
    .order("created_at", { ascending: false })
    .limit(SEARCH_LIMIT);

  if (q) {
    const digits = q.replace(/[\s+\-]/g, "");
    const numberTerm = /^\d{3,}$/.test(digits) ? digits : q;
    // `*` is PostgREST's URL-safe alias for the `%` wildcard.
    query = query.or(`name.ilike.*${q}*,email.ilike.*${q}*,number.ilike.*${numberTerm}*`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
