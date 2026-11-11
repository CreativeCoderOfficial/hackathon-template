import { callOrMock } from "@/core/api/client";
import { exampleEndpoints, type CreateItemInput } from "./contract";
import { USE_MOCK, mockCreateItem, mockListItems } from "./mock";

export async function listItems() {
  const { items } = await callOrMock({
    endpoint: exampleEndpoints.list,
    input: {},
    useMock: USE_MOCK,
    mock: mockListItems,
  });
  return items;
}

export function createItem(input: CreateItemInput) {
  return callOrMock({
    endpoint: exampleEndpoints.create,
    input,
    useMock: USE_MOCK,
    mock: () => mockCreateItem(input),
  });
}
