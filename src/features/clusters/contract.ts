import { z } from "zod";
import { defineEndpoint } from "@/core/api/endpoint";

// Intent: AI groups duplicate reports into clusters.
export const clusterSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  reportIds: z.array(z.string()),
  reportCount: z.number().int().min(1),
  createdAt: z.string(),
});
export type Cluster = z.infer<typeof clusterSchema>;

export const clusterEndpoints = {
  list: defineEndpoint({
    path: "/api/clusters",
    method: "GET",
    request: z.object({}),
    response: z.object({ clusters: z.array(clusterSchema) }),
  }),
};
