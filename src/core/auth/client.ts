"use client";

import { createClient } from "@/core/db/client";
import type { CurrentUser } from "./types";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const { id, email, is_anonymous } = data.user;
  return { id, email: email ?? null, isAnonymous: Boolean(is_anonymous) };
}

// Keeps the same user id, so everything the visitor created stays theirs.
// Supabase sends a confirmation email and the account becomes permanent once it is confirmed.
export async function upgradeAnonymousUser(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ email });
  if (error) throw new Error(error.message);
}
