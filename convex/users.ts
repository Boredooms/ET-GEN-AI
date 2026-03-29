import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    authProviderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    if (args.email) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();
      if (existing) return existing._id;
    }
    
    if (args.authProviderId) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_authProviderId", (q) => q.eq("authProviderId", args.authProviderId))
        .first();
      if (existing) return existing._id;
    }

    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getByAuthProviderId = query({
  args: { authProviderId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_authProviderId", (q) => q.eq("authProviderId", args.authProviderId))
      .first();
  },
});
