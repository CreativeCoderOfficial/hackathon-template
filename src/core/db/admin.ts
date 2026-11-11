import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getServerEnv, requireSupabasePublicEnv } from "@/core/env";
import type { Database } from "./types";

// Bypasses RLS. Use only inside a feature's server/ folder, never in ui/ or client components.
export function createAdminClient() {
  const { url } = requireSupabasePublicEnv();
  const { SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();
  return createClient<Database>(url, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
