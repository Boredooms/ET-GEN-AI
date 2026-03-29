import { betterAuth } from "better-auth";

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const baseURL = getBaseURL();

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
  trustedOrigins: [
    baseURL,
    "https://*.vercel.app",
    "http://localhost:3000",
  ],
  advanced: {
    disableOriginCheck: true,
    disableCSRFCheck: true,
    useSecureCookies: true,
  },
  baseURL: baseURL,
  secret: process.env.BETTER_AUTH_SECRET || "secret",
});

export type Session = typeof auth.$Infer.Session;
