import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client. Every database call goes through the route
// handlers in app/api, so this uses the secret key and the `entries` table
// carries no policies for the public key — see
// supabase/migrations/20260917235000_lock_down_entries_rls.sql.
//
// SUPABASE_SECRET_KEY must never be exposed with a NEXT_PUBLIC_ prefix.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let warned = false;

export const createClient = () => {
  const key = secretKey ?? publishableKey;

  if (!secretKey && !warned) {
    warned = true;
    // Falling back keeps a deploy working before the lock-down migration
    // is applied; afterwards the anon role has no policies and every query
    // comes back empty or denied.
    console.warn(
      "[supabase] SUPABASE_SECRET_KEY is not set — falling back to the publishable key. " +
        "Set it in the deployment environment, or database access will fail once RLS is locked down."
    );
  }

  if (!supabaseUrl || !key) {
    throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY");
  }

  return createSupabaseClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
