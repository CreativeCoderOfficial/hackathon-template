export type ApiErrorBody = {
  error: { code: string; message: string; details?: unknown };
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }

  toBody(): ApiErrorBody {
    return { error: { code: this.code, message: this.message, details: this.details } };
  }
}

export const unauthorized = () => new ApiError(401, "unauthorized", "Sign in required");
export const backendUnavailable = (message = "Backend is not available") =>
  new ApiError(503, "backend_unavailable", message);
export const notImplemented = (what: string) =>
  new ApiError(501, "not_implemented", `${what} is not implemented yet`);
