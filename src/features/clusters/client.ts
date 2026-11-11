import { callOrMock } from "@/core/api/client";
import { clusterEndpoints } from "./contract";
import { USE_MOCK, mockListClusters } from "./mock";

export async function listClusters() {
  const { clusters } = await callOrMock({
    endpoint: clusterEndpoints.list,
    input: {},
    useMock: USE_MOCK,
    mock: mockListClusters,
  });
  return clusters;
}
