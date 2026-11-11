import { backendUnavailable, unauthorized } from "@/core/api/errors";
import { getCurrentUser } from "@/core/auth/server";
import { createClient } from "@/core/db/server";
import type { Database } from "@/core/db/types";
import { hasSupabaseEnv } from "@/core/env";
import type { CreateReportInput, Report } from "../contract";

type ReportRow = Database["public"]["Tables"]["reports"]["Row"];

// The only file in this feature that talks to Supabase.
async function getDb() {
  if (!hasSupabaseEnv) throw backendUnavailable("Supabase env vars are not set");
  return createClient();
}

export async function listReports(limit: number): Promise<Report[]> {
  const db = await getDb();
  const { data, error } = await db
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw backendUnavailable(error.message);
  return data.map(mapRowToReport);
}

export async function createReport(input: CreateReportInput): Promise<Report> {
  const db = await getDb();
  const user = await getCurrentUser();
  if (!user) throw unauthorized();

  const { data, error } = await db
    .from("reports")
    .insert({
      user_id: user.id,
      body: input.body,
      photo_url: input.photoUrl ?? null,
      address: input.address ?? null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
    })
    .select()
    .single();
  if (error) throw backendUnavailable(error.message);
  return mapRowToReport(data);
}

export async function countReports(): Promise<number> {
  const db = await getDb();
  const { count, error } = await db.from("reports").select("id", { count: "exact", head: true });
  if (error) throw backendUnavailable(error.message);
  return count ?? 0;
}

function mapRowToReport(row: ReportRow): Report {
  return {
    id: row.id,
    body: row.body,
    photoUrl: row.photo_url,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    source: row.source === "open311" ? "open311" : "user",
    createdAt: row.created_at,
  };
}
