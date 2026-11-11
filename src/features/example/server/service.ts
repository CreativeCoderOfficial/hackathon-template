import { backendUnavailable, unauthorized } from "@/core/api/errors";
import { getCurrentUser } from "@/core/auth/server";
import { createClient } from "@/core/db/server";
import type { Database } from "@/core/db/types";
import { hasSupabaseEnv } from "@/core/env";
import type { Item } from "../contract";

type ItemRow = Database["public"]["Tables"]["example_items"]["Row"];

// The only file in this feature that talks to Supabase.
async function getDb() {
  if (!hasSupabaseEnv) throw backendUnavailable("Supabase env vars are not set");
  return createClient();
}

export async function listItems(): Promise<Item[]> {
  const db = await getDb();
  const { data, error } = await db
    .from("example_items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw backendUnavailable(error.message);
  return data.map(mapRowToItem);
}

export async function createItem(title: string): Promise<Item> {
  const db = await getDb();
  const user = await getCurrentUser();
  if (!user) throw unauthorized();

  const { data, error } = await db
    .from("example_items")
    .insert({ user_id: user.id, title })
    .select()
    .single();
  if (error) throw backendUnavailable(error.message);
  return mapRowToItem(data);
}

function mapRowToItem(row: ItemRow): Item {
  return { id: row.id, title: row.title, createdAt: row.created_at };
}
