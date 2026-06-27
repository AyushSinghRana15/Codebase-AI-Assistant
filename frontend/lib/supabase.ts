// Supabase client — lazy singleton with config validation

import { createClient } from "@supabase/supabase-js";

let _supabase: ReturnType<typeof createClient> | null = null;

// Check that Supabase env vars are set (not placeholders)
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return !!(url && key && !url.includes("placeholder") && !key.includes("placeholder"));
}

// Lazy-init Supabase client, returns null if not configured
export function getSupabase(): ReturnType<typeof createClient> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}
