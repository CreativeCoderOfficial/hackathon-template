import type { z } from "zod";
import { ApiError, type ApiErrorBody } from "./errors";
import type { Endpoint } from "./endpoint";

export async function callEndpoint<Req extends z.ZodType, Res extends z.ZodType>(
  endpoint: Endpoint<Req, Res>,
  input: z.input<Req>,
): Promise<z.output<Res>> {
  const isQuery = endpoint.method === "GET" || endpoint.method === "DELETE";
  const url = isQuery ? `${endpoint.path}${toQueryString(input)}` : endpoint.path;
  const response = await fetch(url, {
    method: endpoint.method,
    headers: isQuery ? undefined : { "Content-Type": "application/json" },
    body: isQuery ? undefined : JSON.stringify(input),
  });

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const body = payload as Partial<ApiErrorBody> | null;
    throw new ApiError(
      response.status,
      body?.error?.code ?? "unknown",
      body?.error?.message ?? `Request failed with status ${response.status}`,
      body?.error?.details,
    );
  }
  return endpoint.response.parse(payload);
}

// Every feature must keep working when its backend is down, so the mock is the fallback.
export async function callOrMock<Req extends z.ZodType, Res extends z.ZodType>(options: {
  endpoint: Endpoint<Req, Res>;
  input: z.input<Req>;
  useMock: boolean;
  mock: () => Promise<z.output<Res>>;
}): Promise<z.output<Res>> {
  if (options.useMock) return options.mock();
  try {
    return await callEndpoint(options.endpoint, options.input);
  } catch (error) {
    if (isClientMistake(error)) throw error;
    console.warn(`${options.endpoint.path} failed, using mock data`, error);
    return options.mock();
  }
}

// 4xx errors mean the user input is wrong. A mock would hide that, so they are not masked.
function isClientMistake(error: unknown) {
  return error instanceof ApiError && error.status >= 400 && error.status < 500;
}

function toQueryString(input: unknown) {
  const entries = Object.entries((input ?? {}) as Record<string, unknown>).filter(
    ([, value]) => value !== undefined && value !== null,
  );
  if (entries.length === 0) return "";
  return `?${new URLSearchParams(entries.map(([key, value]) => [key, String(value)])).toString()}`;
}
