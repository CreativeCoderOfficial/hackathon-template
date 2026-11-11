import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_MOCK_REPORTS: z.string().optional(),
  NEXT_PUBLIC_MOCK_CLUSTERS: z.string().optional(),
  NEXT_PUBLIC_MOCK_PRIORITIES: z.string().optional(),
});

// Each variable is read by its literal name so Next.js can inline it into client bundles.
export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: emptyToUndefined(process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: emptyToUndefined(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ),
  NEXT_PUBLIC_POSTHOG_KEY: emptyToUndefined(process.env.NEXT_PUBLIC_POSTHOG_KEY),
  NEXT_PUBLIC_MOCK_REPORTS: process.env.NEXT_PUBLIC_MOCK_REPORTS,
  NEXT_PUBLIC_MOCK_CLUSTERS: process.env.NEXT_PUBLIC_MOCK_CLUSTERS,
  NEXT_PUBLIC_MOCK_PRIORITIES: process.env.NEXT_PUBLIC_MOCK_PRIORITIES,
});

export const hasSupabaseEnv = Boolean(
  publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

export function requireSupabasePublicEnv() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const key = publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copy .env.example to .env.local.",
    );
  }
  return { url, key };
}

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

// Server only. In the browser these variables are undefined, so a client import fails loudly.
export function getServerEnv() {
  return serverSchema.parse({
    SUPABASE_SERVICE_ROLE_KEY: emptyToUndefined(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
}

export function isMockEnabled(flag: string | undefined) {
  return flag === "true" || flag === "1";
}

function emptyToUndefined(value: string | undefined) {
  return value === "" ? undefined : value;
}
