import { handle } from "@/core/api/route";
import { exampleEndpoints } from "../contract";
import * as service from "./service";

export const GET = handle(exampleEndpoints.list, async () => ({
  items: await service.listItems(),
}));

export const POST = handle(exampleEndpoints.create, ({ input }) => service.createItem(input.title));
