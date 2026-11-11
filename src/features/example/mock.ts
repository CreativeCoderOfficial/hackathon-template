import { isMockEnabled } from "@/core/env";
import type { CreateItemInput, Item } from "./contract";

export const USE_MOCK = isMockEnabled(process.env.NEXT_PUBLIC_MOCK_EXAMPLE);

const items: Item[] = [
  { id: "mock-1", title: "First example item", createdAt: "2026-01-01T10:00:00.000Z" },
  { id: "mock-2", title: "Second example item", createdAt: "2026-01-01T11:00:00.000Z" },
];

export async function mockListItems() {
  return { items: [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) };
}

export async function mockCreateItem(input: CreateItemInput): Promise<Item> {
  const item: Item = {
    id: `mock-${Date.now()}`,
    title: input.title,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  return item;
}
