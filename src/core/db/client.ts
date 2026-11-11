import { createBrowserClient } from "@supabase/ssr";
import { requireSupabasePublicEnv } from "@/core/env";
import type { Database } from "./types";

export function createClient() {
  const { url, key } = requireSupabasePublicEnv();
  return createBrowserClient<Database>(url, key);
}
