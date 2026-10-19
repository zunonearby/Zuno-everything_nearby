import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ROUTES = ["/login", "/register", "/status"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://mwcvagktpvlzorojdsxg.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Y3ZhZ2t0cHZsem9yb2pkc3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2ODk4MDYsImV4cCI6MjEwNjI2NTgwNn0.KmkVlqAY8QmQItwU-JFbWzsFoHGjOtuef4jCVpDiAlY";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const { pathname } = request.nextUrl;

  // Static assets and internal routes bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return response;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let isAuthenticated = Boolean(session);

  // Requirement 2 & 9: In non-production only, support development mock session cookie
  if (!isAuthenticated && process.env.NODE_ENV !== "production") {
    const { isDevMockAuthEnabled, DEV_MOCK_AUTH_COOKIE } = await import("@zuno/config");
    if (isDevMockAuthEnabled()) {
      const rawCookie = request.cookies.get(DEV_MOCK_AUTH_COOKIE)?.value;
      if (rawCookie) {
        try {
          const decoded = rawCookie.startsWith("%") ? decodeURIComponent(rawCookie) : rawCookie;
          const parsed = JSON.parse(decoded);
          if (parsed?.userId && parsed?.shopId) {
            isAuthenticated = true;
          }
        } catch {}
      }
    }
  }

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // If not logged in and requesting a protected dashboard route, redirect to /login
  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const phone = request.nextUrl.searchParams.get("phone");
    if (phone) {
      loginUrl.searchParams.set("phone", phone);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and visiting /login, redirect to dashboard or root
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
