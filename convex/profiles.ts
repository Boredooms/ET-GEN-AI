import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createProfile = mutation({
  args: {
    userId: v.id("users"),
    userType: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    
    if (existing) {
      // Update existing profile
      await ctx.db.patch(existing._id, {
        userType: args.userType,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    // Create new profile with defaults
    const now = Date.now();
    return await ctx.db.insert("profiles", {
      userId: args.userId,
      userType: args.userType,
      interests: [],
      goals: [],
      language: "en",
      riskLevel: "moderate",
      consentGiven: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getByUserOrDevice = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.deviceId) return null;

    if (args.userId) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();
      if (profile) return profile;
    }

    if (args.deviceId) {
      return await ctx.db
        .query("profiles")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .first();
    }
    return null;
  },
});

export const saveProfile = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    userType: v.string(),
    interests: v.array(v.string()),
    goals: v.array(v.string()),
    language: v.string(),
    riskLevel: v.string(),
    consentGiven: v.boolean(),
    profileSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if it exists
    let existingId = null;
    if (args.userId) {
      const existing = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();
      if (existing) existingId = existing._id;
    } else if (args.deviceId) {
      const existing = await ctx.db
        .query("profiles")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .first();
      if (existing) existingId = existing._id;
    }

    const now = Date.now();
    
    if (existingId) {
      await ctx.db.patch(existingId, {
        ...args,
        updatedAt: now,
      });
      return existingId;
    }

    return await ctx.db.insert("profiles", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});
