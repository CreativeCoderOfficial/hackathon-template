import { createClient } from "@/core/db/server";
import { hasSupabaseEnv } from "@/core/env";
import type { CurrentUser } from "./types";

// Returns null when there is no session. The proxy creates anonymous sessions in anonymous mode.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!hasSupabaseEnv) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;
  const { sub, email, is_anonymous } = data.claims;
  return { id: sub, email: email ?? null, isAnonymous: Boolean(is_anonymous) };
}
