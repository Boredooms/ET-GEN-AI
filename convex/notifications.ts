import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Smart Notifications System
 * Context-aware, time-optimized alerts for users
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get notifications for a user
 */
export const getNotifications = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    isRead: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    let notifications;
    if (args.userId) {
      notifications = await ctx.db
        .query("notifications")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .order("desc")
        .take(limit);
    } else if (args.deviceId) {
      notifications = await ctx.db
        .query("notifications")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .order("desc")
        .take(limit);
    } else {
      return [];
    }

    // Filter by read status if specified
    if (args.isRead !== undefined) {
      notifications = notifications.filter(n => n.isRead === args.isRead);
    }

    return notifications;
  },
});

/**
 * Get unread notification count
 */
export const getUnreadCount = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let notifications;
    if (args.userId) {
      notifications = await ctx.db
        .query("notifications")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .collect();
    } else if (args.deviceId) {
      notifications = await ctx.db
        .query("notifications")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .collect();
    } else {
      return 0;
    }

    return notifications.filter(n => !n.isRead).length;
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new notification
 */
export const createNotification = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    type: v.union(
      v.literal("cross_sell"),
      v.literal("recommendation"),
      v.literal("application_update"),
      v.literal("financial_tip"),
      v.literal("goal_progress"),
      v.literal("system")
    ),
    title: v.string(),
    message: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    category: v.optional(v.union(
      v.literal("creditCard"),
      v.literal("loan"),
      v.literal("insurance"),
      v.literal("investment"),
      v.literal("savings")
    )),
    actionUrl: v.optional(v.string()),
    actionLabel: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      deviceId: args.deviceId,
      type: args.type,
      title: args.title,
      message: args.message,
      priority: args.priority,
      category: args.category || "general",
      actionLabel: args.actionLabel,
      actionUrl: args.actionUrl,
      isRead: false,
      createdAt: Date.now(),
    });

    return notificationId;
  },
});

/**
 * Mark notification as read
 */
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      isRead: true,
      readAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Mark all notifications as read
 */
export const markAllAsRead = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let notifications;
    if (args.userId) {
      notifications = await ctx.db
        .query("notifications")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .filter(q => q.eq(q.field("isRead"), false))
        .collect();
    } else if (args.deviceId) {
      notifications = await ctx.db
        .query("notifications")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .filter(q => q.eq(q.field("isRead"), false))
        .collect();
    } else {
      return { count: 0 };
    }

    await Promise.all(
      notifications.map(n => 
        ctx.db.patch(n._id, {
          isRead: true,
          readAt: Date.now(),
        })
      )
    );

    return { count: notifications.length };
  },
});

/**
 * Delete a notification
 */
export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
    return { success: true };
  },
});

/**
 * Delete all read notifications
 */
export const deleteAllRead = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let notifications;
    if (args.userId) {
      notifications = await ctx.db
        .query("notifications")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .filter(q => q.eq(q.field("isRead"), true))
        .collect();
    } else if (args.deviceId) {
      notifications = await ctx.db
        .query("notifications")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .filter(q => q.eq(q.field("isRead"), true))
        .collect();
    } else {
      return { count: 0 };
    }

    await Promise.all(
      notifications.map(n => ctx.db.delete(n._id))
    );

    return { count: notifications.length };
  },
});

/**
 * Smart notification generator - creates context-aware notifications
 */
export const generateSmartNotifications = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.deviceId) {
      throw new Error("Either userId or deviceId required");
    }

    // Get financial profile
    let financialProfile;
    if (args.userId) {
      financialProfile = await ctx.db
        .query("financialProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();
    } else if (args.deviceId) {
      financialProfile = await ctx.db
        .query("financialProfiles")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .first();
    }

    if (!financialProfile) {
      return { message: "No financial profile found", count: 0 };
    }

    const createdNotifications = [];

    // ===== HEALTH SCORE NOTIFICATIONS =====
    if (financialProfile.healthScore < 50) {
      createdNotifications.push(
        await ctx.db.insert("notifications", {
          userId: args.userId,
          deviceId: args.deviceId,
          type: "financial_tip",
          title: "Improve Your Financial Health",
          message: `Your financial health score is ${financialProfile.healthScore}/100. Let's work on improving it together!`,
          priority: "high",
          category: "general",
          actionUrl: "/dashboard",
          actionLabel: "View Dashboard",
          isRead: false,
          createdAt: Date.now(),
        })
      );
    }

    // ===== GAP-BASED NOTIFICATIONS =====
    if (financialProfile.gaps && financialProfile.gaps.length > 0) {
      for (const gap of financialProfile.gaps.slice(0, 2)) { // Top 2 gaps
        let title = "";
        let message = "";
        let category = undefined;
        let actionUrl = "/marketplace";

        switch (gap) {
          case "noInsurance":
            title = "You're not covered by insurance";
            message = "Protect yourself and your family with comprehensive insurance plans.";
            category = "insurance";
            actionUrl = "/marketplace?category=insurance";
            break;
          case "noEmergencyFund":
            title = "Build an emergency fund";
            message = "Start saving with high-interest savings accounts to build your safety net.";
            category = "savings";
            actionUrl = "/marketplace?category=savings";
            break;
          case "noInvestments":
            title = "Start your investment journey";
            message = "Grow your wealth with smart investment options starting from just ₹500/month.";
            category = "investment";
            actionUrl = "/marketplace?category=investment";
            break;
          case "highDebtRatio":
            title = "Manage your debt better";
            message = "Consider debt consolidation loans to reduce your interest burden.";
            category = "loan";
            actionUrl = "/marketplace?category=loan";
            break;
          case "lowSavingsRate":
            title = "Increase your savings";
            message = "Automate your savings with high-yield accounts and SIPs.";
            category = "savings";
            actionUrl = "/marketplace?category=savings";
            break;
        }

        if (title) {
          createdNotifications.push(
            await ctx.db.insert("notifications", {
              userId: args.userId,
              deviceId: args.deviceId,
              type: "recommendation",
              title,
              message,
              priority: "medium",
              category: category as any,
              actionUrl,
              actionLabel: "Explore Solutions",
              isRead: false,
              createdAt: Date.now(),
            })
          );
        }
      }
    }

    // ===== GOAL PROGRESS NOTIFICATIONS =====
    if (financialProfile.goals && financialProfile.goals.length > 0) {
      for (const goal of financialProfile.goals) {
        if (goal.targetAmount && goal.currentProgress !== undefined) {
          const progress = goal.currentProgress;
          
          // Milestone notifications
          if (progress >= 25 && progress < 30) {
            createdNotifications.push(
              await ctx.db.insert("notifications", {
                userId: args.userId,
                deviceId: args.deviceId,
                type: "goal_progress",
                title: "Goal Progress: 25% Complete!",
                message: `You're a quarter of the way to your ${goal.type} goal. Keep going!`,
                priority: "low",
                category: "general",
                actionUrl: "/dashboard",
                actionLabel: "View Progress",
                isRead: false,
                createdAt: Date.now(),
              })
            );
          }
        }
      }
    }

    return {
      message: "Smart notifications generated",
      count: createdNotifications.length,
    };
  },
});
