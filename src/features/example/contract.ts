import { z } from "zod";
import { defineEndpoint } from "@/core/api/endpoint";

export const itemSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
});
export type Item = z.infer<typeof itemSchema>;

export const createItemInputSchema = z.object({
  title: z.string().trim().min(1, "Enter a title").max(200),
});
export type CreateItemInput = z.infer<typeof createItemInputSchema>;

export const exampleEndpoints = {
  list: defineEndpoint({
    path: "/api/example",
    method: "GET",
    request: z.object({}),
    response: z.object({ items: z.array(itemSchema) }),
  }),
  create: defineEndpoint({
    path: "/api/example",
    method: "POST",
    request: createItemInputSchema,
    response: itemSchema,
  }),
};
