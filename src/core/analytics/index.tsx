"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { publicEnv } from "@/core/env";

const POSTHOG_HOST = "https://eu.i.posthog.com";
let started = false;

function startAnalytics() {
  const key = publicEnv.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || started) return;
  posthog.init(key, { api_host: POSTHOG_HOST, person_profiles: "identified_only" });
  started = true;
}

// Does nothing when NEXT_PUBLIC_POSTHOG_KEY is missing.
export function track(event: string, props?: Record<string, unknown>) {
  startAnalytics();
  if (started) posthog.capture(event, props);
}

export function AnalyticsProvider() {
  useEffect(() => {
    startAnalytics();
  }, []);
  return null;
}
