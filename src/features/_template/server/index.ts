import { notImplemented } from "@/core/api/errors";
import { handle } from "@/core/api/route";
import { templateEndpoints } from "../contract";

// Replace with a call into a service.ts that owns all Supabase access for this feature.
export const GET = handle(templateEndpoints.list, async () => {
  throw notImplemented("template list");
});
