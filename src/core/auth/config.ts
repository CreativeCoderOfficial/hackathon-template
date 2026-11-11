// "anonymous": every visitor gets an anonymous session and can try the product instantly.
// "required": visitors must log in. Feature code never reads this flag, it only calls getCurrentUser().
export type AuthMode = "anonymous" | "required";

export const AUTH_MODE: AuthMode = "anonymous";
