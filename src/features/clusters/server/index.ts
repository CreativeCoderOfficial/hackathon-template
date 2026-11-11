import { notImplemented } from "@/core/api/errors";
import { handle } from "@/core/api/route";
import { clusterEndpoints } from "../contract";

// Stub. The client falls back to mock.ts until this reads real clusters.
export const GET = handle(clusterEndpoints.list, async () => {
  throw notImplemented("cluster list");
});
