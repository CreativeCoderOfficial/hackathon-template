import { callOrMock } from "@/core/api/client";
import { reportEndpoints, type CreateReportInput } from "./contract";
import { USE_MOCK, mockCountReports, mockCreateReport, mockListReports } from "./mock";

export async function listReports(limit?: number) {
  const { reports } = await callOrMock({
    endpoint: reportEndpoints.list,
    input: { limit },
    useMock: USE_MOCK,
    mock: () => mockListReports(limit),
  });
  return reports;
}

export function createReport(input: CreateReportInput) {
  return callOrMock({
    endpoint: reportEndpoints.create,
    input,
    useMock: USE_MOCK,
    mock: () => mockCreateReport(input),
  });
}

export async function countReports() {
  const { count } = await callOrMock({
    endpoint: reportEndpoints.count,
    input: {},
    useMock: USE_MOCK,
    mock: mockCountReports,
  });
  return count;
}
