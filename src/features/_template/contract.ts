import { z } from "zod";
import { defineEndpoint } from "@/core/api/endpoint";

// Written first by the feature owner, reviewed by a human before any server or UI work.
export const templateItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
});
export type TemplateItem = z.infer<typeof templateItemSchema>;

export const templateEndpoints = {
  list: defineEndpoint({
    path: "/api/template",
    method: "GET",
    request: z.object({}),
    response: z.object({ items: z.array(templateItemSchema) }),
  }),
};
