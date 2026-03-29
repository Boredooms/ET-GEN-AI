import { betterAuth } from "better-auth";

const getBaseURL = () => {
  // Priority order for base URL determination
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL.replace(/\/$/, ''); // Remove trailing slash
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

const baseURL = getBaseURL();

// Collect all possible origins for production
const getAllowedOrigins = () => {
  const origins = new Set([
    baseURL,
    "http://localhost:3000",
    "http://localhost:3001",
  ]);

  // Add all Vercel-related URLs
  if (process.env.BETTER_AUTH_URL) origins.add(process.env.BETTER_AUTH_URL.replace(/\/$/, ''));
  if (process.env.NEXT_PUBLIC_APP_URL) origins.add(process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ''));
  if (process.env.SITE_URL) origins.add(process.env.SITE_URL.replace(/\/$/, ''));
  if (process.env.VERCEL_URL) origins.add(`https://${process.env.VERCEL_URL}`);

  // Add wildcard for all Vercel preview deployments
  origins.add("https://*.vercel.app");

  return Array.from(origins);
};

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      enabled: !!process.env.AUTH_GOOGLE_ID,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  trustedOrigins: getAllowedOrigins(),
  advanced: {
    // IMPORTANT: Keep these disabled in production for security
    // Only the trustedOrigins list should control access
    disableOriginCheck: process.env.NODE_ENV === "development",
    disableCSRFCheck: process.env.NODE_ENV === "development",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  baseURL: baseURL,
  secret: process.env.BETTER_AUTH_SECRET || "secret",
});

export type Session = typeof auth.$Infer.Session;
