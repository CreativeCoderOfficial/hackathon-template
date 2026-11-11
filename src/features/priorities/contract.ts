import { z } from "zod";
import { defineEndpoint } from "@/core/api/endpoint";
import { clusterSchema } from "@/features/clusters/contract";

// Intent: ranked list of what to fix first, with evidence from clusters.
export const priorityEvidenceSchema = clusterSchema.pick({
  id: true,
  title: true,
  reportCount: true,
});
export type PriorityEvidence = z.infer<typeof priorityEvidenceSchema>;

export const priorityItemSchema = z.object({
  id: z.string(),
  rank: z.number().int().min(1),
  title: z.string(),
  reason: z.string(),
  score: z.number().min(0).max(100),
  evidence: z.array(priorityEvidenceSchema),
});
export type PriorityItem = z.infer<typeof priorityItemSchema>;

export const priorityEndpoints = {
  list: defineEndpoint({
    path: "/api/priorities",
    method: "GET",
    request: z.object({}),
    response: z.object({ priorities: z.array(priorityItemSchema) }),
  }),
};
