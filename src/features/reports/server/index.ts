import { handle } from "@/core/api/route";
import { reportEndpoints } from "../contract";
import * as service from "./service";

const DEFAULT_LIST_LIMIT = 50;

export const GET = handle(reportEndpoints.list, async ({ input }) => ({
  reports: await service.listReports(input.limit ?? DEFAULT_LIST_LIMIT),
}));

export const POST = handle(reportEndpoints.create, ({ input }) => service.createReport(input));

export const GET_COUNT = handle(reportEndpoints.count, async () => ({
  count: await service.countReports(),
}));
