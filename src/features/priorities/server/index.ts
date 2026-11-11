import { notImplemented } from "@/core/api/errors";
import { handle } from "@/core/api/route";
import { priorityEndpoints } from "../contract";

// Stub. The client falls back to mock.ts until this ranks real clusters.
export const GET = handle(priorityEndpoints.list, async () => {
  throw notImplemented("priority list");
});
