import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    title: v.optional(v.string()),
    intent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("conversations", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const list = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db
        .query("conversations")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    }
    if (args.deviceId) {
      return await ctx.db
        .query("conversations")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .order("desc")
        .collect();
    }
    return [];
  },
});

export const getById = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

export const updateIntent = mutation({
  args: {
    conversationId: v.id("conversations"),
    intent: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      intent: args.intent,
      ...(args.title ? { title: args.title } : {}),
      updatedAt: Date.now(),
    });
  },
});
