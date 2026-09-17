import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cleanEntryInput } from "@/utils/entry";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();

  const { data, error } = await supabase
    .from("entries")
    .select()
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();

  const raw = await request.text();
  const body = raw ? JSON.parse(raw) : {};
  const keys = Object.keys(body);
  const isCheckIn = keys.length === 0 || (keys.length === 1 && body.checkedin === true);

  if (isCheckIn) {
    // Only flip checkedin when it's still false, so the QR code can be
    // redeemed exactly once even under concurrent scans of the same code.
    const { data, error } = await supabase
      .from("entries")
      .update({ checkedin: true, checked_in_at: new Date().toISOString() })
      .eq("id", id)
      .eq("checkedin", false)
      .select()
      .single();

    if (data) {
      return NextResponse.json(data);
    }

    const { data: existing } = await supabase
      .from("entries")
      .select()
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    if (existing.checkedin) {
      return NextResponse.json({ error: "Already checked in", entry: existing }, { status: 409 });
    }
    return NextResponse.json({ error: error?.message ?? "Check-in failed" }, { status: 500 });
  }

  // Admin edit path — update whichever fields were provided.
  const input = cleanEntryInput(body, { partial: true });
  if (typeof input === "string") {
    return NextResponse.json({ error: input }, { status: 400 });
  }

  const update: Record<string, unknown> = { ...input };

  if ("checkedin" in body && typeof body.checkedin === "boolean") {
    const { data: current } = await supabase
      .from("entries")
      .select("checkedin")
      .eq("id", id)
      .single();
    update.checkedin = body.checkedin;
    if (body.checkedin !== current?.checkedin) {
      update.checked_in_at = body.checkedin ? new Date().toISOString() : null;
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("entries")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "This phone number is already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();

  const { error } = await supabase.from("entries").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
