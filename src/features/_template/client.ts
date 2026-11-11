import { callOrMock } from "@/core/api/client";
import { templateEndpoints } from "./contract";
import { USE_MOCK, mockListTemplateItems } from "./mock";

export async function listTemplateItems() {
  const { items } = await callOrMock({
    endpoint: templateEndpoints.list,
    input: {},
    useMock: USE_MOCK,
    mock: mockListTemplateItems,
  });
  return items;
}
