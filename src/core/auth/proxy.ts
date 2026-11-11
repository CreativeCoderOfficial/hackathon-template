import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv, requireSupabasePublicEnv } from "@/core/env";
import { AUTH_MODE } from "./config";

// Refreshes the session on every request. Anonymous mode signs new visitors in anonymously,
// required mode redirects them to the login page.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (!hasSupabaseEnv) return supabaseResponse;

  const { url, key } = requireSupabasePublicEnv();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and getClaims. It can log users out at random.
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) return supabaseResponse;

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  if (AUTH_MODE === "anonymous") {
    // Fails quietly when anonymous sign-ins are disabled in the Supabase dashboard.
    // The app then runs without a session and features fall back to their mocks.
    if (!isAuthPage) await supabase.auth.signInAnonymously();
    return supabaseResponse;
  }

  if (!isAuthPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }
  return supabaseResponse;
}
