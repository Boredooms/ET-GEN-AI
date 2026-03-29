import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * User Applications Management
 * Track product applications and conversion status
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all applications for a user
 */
export const getApplications = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let applications;

    if (args.userId) {
      applications = await ctx.db
        .query("userApplications")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    } else if (args.deviceId) {
      applications = await ctx.db
        .query("userApplications")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .order("desc")
        .collect();
    } else {
      return [];
    }

    // Filter by status if provided
    if (args.status) {
      applications = applications.filter((app) => app.status === args.status);
    }

    // Populate product details
    const applicationsWithProducts = await Promise.all(
      applications.map(async (app) => {
        const product = await ctx.db.get(app.productId);
        return {
          ...app,
          product,
        };
      })
    );

    return applicationsWithProducts;
  },
});

/**
 * Get a single application by ID
 */
export const getApplication = query({
  args: { applicationId: v.id("userApplications") },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);
    if (!application) return null;

    const product = await ctx.db.get(application.productId);
    return {
      ...application,
      product,
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new application
 */
export const createApplication = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    productId: v.id("financialProducts"),
    recommendationId: v.optional(v.id("serviceRecommendations")),
  },
  handler: async (ctx, args) => {
    // Generate application ID
    const applicationId = `APP${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const appId = await ctx.db.insert("userApplications", {
      userId: args.userId,
      deviceId: args.deviceId,
      productId: args.productId,
      recommendationId: args.recommendationId,
      applicationId,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { applicationId: appId, referenceId: applicationId };
  },
});

/**
 * Update application status
 */
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("userApplications"),
    status: v.string(),
    partnerReferenceId: v.optional(v.string()),
    partnerStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.partnerReferenceId) {
      updates.partnerReferenceId = args.partnerReferenceId;
    }

    if (args.partnerStatus) {
      updates.partnerStatus = args.partnerStatus;
    }

    if (args.status === "approved") {
      updates.approvedAt = Date.now();
    }

    if (args.status === "completed") {
      updates.submittedAt = Date.now();
    }

    await ctx.db.patch(args.applicationId, updates);

    return { success: true };
  },
});
