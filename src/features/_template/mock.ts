import { isMockEnabled } from "@/core/env";
import type { TemplateItem } from "./contract";

export const USE_MOCK = isMockEnabled(process.env.NEXT_PUBLIC_MOCK_TEMPLATE);

const items: TemplateItem[] = [
  { id: "mock-1", title: "Example item", createdAt: "2026-11-10T10:00:00.000Z" },
];

export async function mockListTemplateItems() {
  return { items };
}
