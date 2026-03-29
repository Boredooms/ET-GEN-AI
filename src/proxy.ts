import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/feed",
  "/marketplace",
  "/concierge",
  "/profile",
  "/settings",
  "/insights",
  "/applications",
];

// Routes that require onboarding completion
const onboardingRequiredRoutes = [
  "/dashboard",
  "/feed",
  "/marketplace",
  "/concierge",
  "/insights",
];

// Routes that should redirect if already authenticated
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check session cookie from Better Auth
  const sessionCookie = request.cookies.get("better-auth.session_token") ||
                       request.cookies.get("better-auth.signed") ||
                       request.cookies.get("authjs.session-token");
  const isAuthenticated = !!sessionCookie;

  // Check if user has completed onboarding
  const hasCompletedOnboarding = request.cookies.get("onboarding_complete");

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    if (!hasCompletedOnboarding) {
      return NextResponse.redirect(new URL("/financial-setup", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to signup
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    const signupUrl = new URL("/signup", request.url);
    signupUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signupUrl);
  }

  // Redirect to onboarding if not completed
  if (
    onboardingRequiredRoutes.some(route => pathname.startsWith(route)) &&
    isAuthenticated &&
    !hasCompletedOnboarding &&
    !pathname.startsWith("/financial-setup")
  ) {
    return NextResponse.redirect(new URL("/financial-setup", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
