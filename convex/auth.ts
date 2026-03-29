import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth/minimal";
import authConfig from "./auth.config";

const siteUrl = process.env.BETTER_AUTH_URL || process.env.SITE_URL || "http://localhost:3000";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  const secret = process.env.BETTER_AUTH_SECRET || "dummy_secret_for_build";

  if (!process.env.BETTER_AUTH_SECRET && process.env.NODE_ENV === "production") {
    console.warn("BETTER_AUTH_SECRET is missing. Login will fail.");
  }

  return betterAuth({
    baseURL: siteUrl,
    secret: secret,
    database: authComponent.adapter(ctx),
    // Configure email/password authentication
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    // Trust all deployments (Production and Preview)
    trustedOrigins: [
      siteUrl,
      "https://*.vercel.app", 
      "http://localhost:3000",
    ],
    advanced: {
      disableOriginCheck: true,
      disableCSRFCheck: true,
      useSecureCookies: true,
    },
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex({ authConfig }),
    ],
  });
};

// Example function for getting the current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
