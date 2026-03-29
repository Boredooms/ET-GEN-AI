import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.string(),
    content: v.string(),
    status: v.string(),
    sources: v.optional(v.array(v.object({
      id: v.string(),
      title: v.string(),
      url: v.optional(v.string()),
      excerpt: v.string(),
      publishedAt: v.optional(v.string()),
      topic: v.optional(v.string()),
      source: v.optional(v.string()),
    }))),
    actions: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      type: v.string(),
      href: v.optional(v.string()),
      payload: v.optional(v.any()),
    }))),
  },
  handler: async (ctx, args) => {
    // Update the conversation's updatedAt timestamp
    await ctx.db.patch(args.conversationId, {
      updatedAt: Date.now(),
    });

    return await ctx.db.insert("messages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
  },
});
