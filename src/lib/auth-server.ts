import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convexSiteUrl = process.env.CONVEX_SITE_URL || process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

// On Vercel build, this can sometimes be missing if not explicitly added.
// We use a dummy URL during build to avoid crashing 'Collecting page data'.
const isBuild = process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "production" && !convexSiteUrl;

if (!isBuild && !convexSiteUrl) {
  throw new Error(
    "FATAL: CONVEX_SITE_URL or NEXT_PUBLIC_CONVEX_SITE_URL is not set in Vercel. " +
    "Please add 'CONVEX_SITE_URL=https://kindred-hawk-939.convex.site' to your Vercel Environment Variables."
  );
}

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl,
  convexSiteUrl: convexSiteUrl || "https://build-time-dummy.convex.site",
});
