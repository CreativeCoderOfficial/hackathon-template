import { callOrMock } from "@/core/api/client";
import { priorityEndpoints } from "./contract";
import { USE_MOCK, mockListPriorities } from "./mock";

export async function listPriorities() {
  const { priorities } = await callOrMock({
    endpoint: priorityEndpoints.list,
    input: {},
    useMock: USE_MOCK,
    mock: mockListPriorities,
  });
  return priorities;
}
