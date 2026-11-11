import { isMockEnabled } from "@/core/env";
import type { CreateReportInput, Report } from "./contract";

export const USE_MOCK = isMockEnabled(process.env.NEXT_PUBLIC_MOCK_REPORTS);

// Shaped like Helsinki Open311 service requests (description, address, lat/long).
const reports: Report[] = [
  {
    id: "mock-1",
    body: "Deep pothole on the cycle lane, near the tram stop.",
    photoUrl: null,
    address: "Mannerheimintie 40, Helsinki",
    lat: 60.1749,
    lng: 24.9318,
    source: "open311",
    createdAt: "2026-11-09T07:42:00.000Z",
  },
  {
    id: "mock-2",
    body: "Traffic light on the pedestrian crossing stays red for over three minutes.",
    photoUrl: null,
    address: "Hämeentie 12, Helsinki",
    lat: 60.1861,
    lng: 24.9531,
    source: "open311",
    createdAt: "2026-11-09T12:10:00.000Z",
  },
  {
    id: "mock-3",
    body: "Street lamp out along the whole stretch of the park path.",
    photoUrl: null,
    address: "Kaivopuisto, Helsinki",
    lat: 60.1566,
    lng: 24.9573,
    source: "open311",
    createdAt: "2026-11-10T16:25:00.000Z",
  },
  {
    id: "mock-4",
    body: "Bus lane blocked by delivery vehicles every morning.",
    photoUrl: null,
    address: "Mechelininkatu 20, Helsinki",
    lat: 60.1707,
    lng: 24.9193,
    source: "open311",
    createdAt: "2026-11-10T21:05:00.000Z",
  },
];

const byNewest = (a: Report, b: Report) => b.createdAt.localeCompare(a.createdAt);

export async function mockListReports(limit = 50) {
  return { reports: [...reports].sort(byNewest).slice(0, limit) };
}

export async function mockCreateReport(input: CreateReportInput): Promise<Report> {
  const report: Report = {
    id: `mock-${reports.length + 1}-${Date.now()}`,
    body: input.body,
    photoUrl: input.photoUrl ?? null,
    address: input.address ?? null,
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    source: "user",
    createdAt: new Date().toISOString(),
  };
  reports.push(report);
  return report;
}

export async function mockCountReports() {
  return { count: reports.length };
}
