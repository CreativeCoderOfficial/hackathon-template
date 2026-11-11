import { z } from "zod";
import { ApiError } from "./errors";
import type { Endpoint } from "./endpoint";

type HandlerContext<Req extends z.ZodType> = {
  input: z.output<Req>;
  request: Request;
};

// Wraps a route handler: parses input with the endpoint's request schema, checks the output
// against its response schema and turns every failure into the same JSON error shape.
export function handle<Req extends z.ZodType, Res extends z.ZodType>(
  endpoint: Endpoint<Req, Res>,
  run: (context: HandlerContext<Req>) => Promise<z.input<Res>>,
) {
  return async function routeHandler(request: Request): Promise<Response> {
    try {
      const rawInput = await readRawInput(request, endpoint.method);
      const parsed = endpoint.request.safeParse(rawInput);
      if (!parsed.success) {
        throw new ApiError(400, "invalid_request", "Request does not match the contract", z.treeifyError(parsed.error));
      }
      const result = await run({ input: parsed.data, request });
      return Response.json(endpoint.response.parse(result));
    } catch (error) {
      return toErrorResponse(error);
    }
  };
}

async function readRawInput(request: Request, method: Endpoint["method"]) {
  if (method === "GET" || method === "DELETE") {
    return Object.fromEntries(new URL(request.url).searchParams);
  }
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "invalid_json", "Body must be valid JSON");
  }
}

function toErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(error.toBody(), { status: error.status });
  }
  console.error(error);
  const internal = new ApiError(500, "internal", "Unexpected server error");
  return Response.json(internal.toBody(), { status: 500 });
}
