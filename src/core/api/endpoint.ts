import type { z } from "zod";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Describes one endpoint. Features declare these in contract.ts, server and client both use them.
export type Endpoint<Req extends z.ZodType = z.ZodType, Res extends z.ZodType = z.ZodType> = {
  path: string;
  method: HttpMethod;
  request: Req;
  response: Res;
};

export function defineEndpoint<Req extends z.ZodType, Res extends z.ZodType>(
  endpoint: Endpoint<Req, Res>,
) {
  return endpoint;
}
