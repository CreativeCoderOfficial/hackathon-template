import { isMockEnabled } from "@/core/env";
import type { Cluster } from "./contract";

export const USE_MOCK = isMockEnabled(process.env.NEXT_PUBLIC_MOCK_CLUSTERS);

const clusters: Cluster[] = [
  {
    id: "cluster-1",
    title: "Cycle lane potholes in the city centre",
    summary: "Several reports describe damaged surfaces on cycle lanes along Mannerheimintie.",
    reportIds: ["mock-1"],
    reportCount: 4,
    createdAt: "2026-11-10T09:00:00.000Z",
  },
  {
    id: "cluster-2",
    title: "Pedestrian signals stuck on red",
    summary: "Long waits at crossings in Kallio and along Hämeentie.",
    reportIds: ["mock-2"],
    reportCount: 3,
    createdAt: "2026-11-10T09:05:00.000Z",
  },
  {
    id: "cluster-3",
    title: "Broken street lighting in parks",
    summary: "Dark stretches on park paths in Kaivopuisto and Töölönlahti.",
    reportIds: ["mock-3"],
    reportCount: 2,
    createdAt: "2026-11-10T09:10:00.000Z",
  },
];

export async function mockListClusters() {
  return { clusters };
}
