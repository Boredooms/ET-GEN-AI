/**
 * Financial Provider Connections
 * 
 * Convex mutations and queries for managing user connections to financial providers
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Save or update provider credentials for a user
 */
export const saveProviderCredentials = mutation({
  args: {
    userId: v.id("users"),
    providerId: v.string(), // "zerodha" | "upstox"
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.number(),
    metadata: v.optional(v.any()), // Extra provider-specific data
  },
  handler: async (ctx, args) => {
    // Check if connection already exists
    const existing = await ctx.db
      .query("providerConnections")
      .withIndex("by_userId_providerId", (q) =>
        q.eq("userId", args.userId).eq("providerId", args.providerId)
      )
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing connection
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        metadata: args.metadata,
        isActive: true,
        lastSyncedAt: now,
        updatedAt: now,
      });
      return existing._id;
    }

    // Create new connection
    return await ctx.db.insert("providerConnections", {
      userId: args.userId,
      providerId: args.providerId,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      expiresAt: args.expiresAt,
      metadata: args.metadata,
      isActive: true,
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Get all active provider connections for a user
 */
export const getUserConnections = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("providerConnections")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

/**
 * Get a specific provider connection
 */
export const getProviderConnection = query({
  args: {
    userId: v.id("users"),
    providerId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("providerConnections")
      .withIndex("by_userId_providerId", (q) =>
        q.eq("userId", args.userId).eq("providerId", args.providerId)
      )
      .first();
  },
});

/**
 * Disconnect a provider (soft delete)
 */
export const disconnectProvider = mutation({
  args: {
    userId: v.id("users"),
    providerId: v.string(),
  },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query("providerConnections")
      .withIndex("by_userId_providerId", (q) =>
        q.eq("userId", args.userId).eq("providerId", args.providerId)
      )
      .first();

    if (!connection) {
      throw new Error("Connection not found");
    }

    await ctx.db.patch(connection._id, {
      isActive: false,
      updatedAt: Date.now(),
    });

    return true;
  },
});

/**
 * Cache portfolio data from a provider
 */
export const cachePortfolioData = mutation({
  args: {
    userId: v.id("users"),
    providerId: v.string(),
    data: v.object({
      totalValue: v.number(),
      totalInvested: v.number(),
      totalPnl: v.number(),
      totalPnlPercentage: v.number(),
      dayChange: v.number(),
      dayChangePercentage: v.number(),
      holdings: v.array(v.any()),
      positions: v.array(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    // Check if cache exists
    const existing = await ctx.db
      .query("portfolioCache")
      .withIndex("by_userId_providerId", (q) =>
        q.eq("userId", args.userId).eq("providerId", args.providerId)
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args.data,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("portfolioCache", {
      userId: args.userId,
      providerId: args.providerId,
      ...args.data,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Get cached portfolio data
 */
export const getCachedPortfolio = query({
  args: {
    userId: v.id("users"),
    providerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.providerId) {
      // Get specific provider's cache
      return await ctx.db
        .query("portfolioCache")
        .withIndex("by_userId_providerId", (q) =>
          q.eq("userId", args.userId).eq("providerId", args.providerId!)
        )
        .first();
    }

    // Get all cached portfolios for user
    return await ctx.db
      .query("portfolioCache")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});
