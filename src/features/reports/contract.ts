import { z } from "zod";
import { defineEndpoint } from "@/core/api/endpoint";

export const reportSchema = z.object({
  id: z.string(),
  body: z.string(),
  photoUrl: z.string().nullable(),
  address: z.string().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  source: z.enum(["user", "open311"]),
  createdAt: z.string(),
});
export type Report = z.infer<typeof reportSchema>;

export const createReportInputSchema = z.object({
  body: z.string().trim().min(3, "Describe the problem in a few words").max(1000),
  photoUrl: z.string().url().optional(),
  address: z.string().trim().max(200).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});
export type CreateReportInput = z.infer<typeof createReportInputSchema>;

export const reportEndpoints = {
  list: defineEndpoint({
    path: "/api/reports",
    method: "GET",
    request: z.object({ limit: z.coerce.number().int().min(1).max(100).optional() }),
    response: z.object({ reports: z.array(reportSchema) }),
  }),
  create: defineEndpoint({
    path: "/api/reports",
    method: "POST",
    request: createReportInputSchema,
    response: reportSchema,
  }),
  count: defineEndpoint({
    path: "/api/reports/count",
    method: "GET",
    request: z.object({}),
    response: z.object({ count: z.number().int().min(0) }),
  }),
};
