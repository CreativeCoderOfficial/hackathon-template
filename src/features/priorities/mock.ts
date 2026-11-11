import { isMockEnabled } from "@/core/env";
import type { PriorityItem } from "./contract";

export const USE_MOCK = isMockEnabled(process.env.NEXT_PUBLIC_MOCK_PRIORITIES);

const priorities: PriorityItem[] = [
  {
    id: "priority-1",
    rank: 1,
    title: "Repair cycle lane surface on Mannerheimintie",
    reason: "Most reports, and a safety risk for cyclists during rush hour.",
    score: 92,
    evidence: [{ id: "cluster-1", title: "Cycle lane potholes in the city centre", reportCount: 4 }],
  },
  {
    id: "priority-2",
    rank: 2,
    title: "Retime pedestrian signals in Kallio",
    reason: "Long waits push people to cross against the signal.",
    score: 71,
    evidence: [{ id: "cluster-2", title: "Pedestrian signals stuck on red", reportCount: 3 }],
  },
  {
    id: "priority-3",
    rank: 3,
    title: "Replace lamps on park paths",
    reason: "Fewer reports, but darkness is worst in winter.",
    score: 48,
    evidence: [{ id: "cluster-3", title: "Broken street lighting in parks", reportCount: 2 }],
  },
];

export async function mockListPriorities() {
  return { priorities };
}
