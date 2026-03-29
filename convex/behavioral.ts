import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Behavioral Tracking & Cross-sell Intelligence
 * Tracks user actions and identifies cross-sell opportunities
 */

// ============================================================================
// EVENT TRACKING
// ============================================================================

/**
 * Track a user behavioral event
 */
export const trackEvent = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    eventType: v.union(
      v.literal("article_view"),
      v.literal("article_read"),
      v.literal("product_view"),
      v.literal("product_compare"),
      v.literal("product_apply"),
      v.literal("conversation_started"),
      v.literal("profile_updated"),
      v.literal("dashboard_visit"),
      v.literal("marketplace_visit"),
      v.literal("search_performed")
    ),
    metadata: v.object({
      articleId: v.optional(v.string()),
      articleTopic: v.optional(v.string()),
      productId: v.optional(v.id("financialProducts")),
      productCategory: v.optional(v.string()),
      searchQuery: v.optional(v.string()),
      timeSpent: v.optional(v.number()), // seconds
      scrollDepth: v.optional(v.number()), // percentage
      conversationId: v.optional(v.id("conversations")),
    }),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("behavioralEvents", {
      userId: args.userId,
      deviceId: args.deviceId,
      eventType: args.eventType,
      eventCategory: args.eventType.split('_')[0],
      engagement: "active",
      source: "web",
      sessionId: `session_${Date.now()}`,
      metadata: args.metadata as any,
      createdAt: Date.now(),
    });

    // Check if this event triggers a cross-sell opportunity
    await detectCrossSellOpportunity(ctx, {
      userId: args.userId,
      deviceId: args.deviceId,
      eventType: args.eventType,
      metadata: args.metadata,
    });

    return eventId;
  },
});

/**
 * Get user's behavioral events history
 */
export const getEvents = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    eventType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    let events;
    if (args.userId) {
      events = await ctx.db
        .query("behavioralEvents")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .order("desc")
        .take(limit);
    } else if (args.deviceId) {
      events = await ctx.db
        .query("behavioralEvents")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .order("desc")
        .take(limit);
    } else {
      return [];
    }

    // Filter by event type if specified
    if (args.eventType) {
      events = events.filter((e: any) => e.eventType === args.eventType);
    }

    return events;
  },
});

/**
 * Get behavioral insights summary
 */
export const getInsights = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all events for user
    let events;
    if (args.userId) {
      events = await ctx.db
        .query("behavioralEvents")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .collect();
    } else if (args.deviceId) {
      events = await ctx.db
        .query("behavioralEvents")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .collect();
    } else {
      return null;
    }

    // Calculate insights
    const totalEvents = events.length;
    const eventCounts: Record<string, number> = {};
    const topicCounts: Record<string, number> = {};
    const productViews: Record<string, number> = {};
    let totalTimeSpent = 0;
    let articlesRead = 0;

    for (const event of events) {
      // Count event types
      eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1;

      // Count article topics
      if (event.metadata.articleTopic) {
        topicCounts[event.metadata.articleTopic] = 
          (topicCounts[event.metadata.articleTopic] || 0) + 1;
      }

      // Count product views
      if (event.metadata.productCategory) {
        productViews[event.metadata.productCategory] = 
          (productViews[event.metadata.productCategory] || 0) + 1;
      }

      // Sum time spent
      if (event.metadata.timeSpent) {
        totalTimeSpent += event.metadata.timeSpent;
      }

      // Count articles read (>80% scroll depth)
      if (event.eventType === "article_read" || 
          (event.metadata.scrollDepth && event.metadata.scrollDepth > 80)) {
        articlesRead++;
      }
    }

    // Find top interests
    const topTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    const topProductInterests = Object.entries(productViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => ({ category, count }));

    // Calculate engagement level
    let engagementLevel: "low" | "medium" | "high" = "low";
    if (totalEvents > 50 && articlesRead > 10) {
      engagementLevel = "high";
    } else if (totalEvents > 20 && articlesRead > 5) {
      engagementLevel = "medium";
    }

    return {
      totalEvents,
      eventCounts,
      topTopics,
      topProductInterests,
      articlesRead,
      totalTimeSpent: Math.round(totalTimeSpent),
      engagementLevel,
      lastActivityAt: events[0]?.createdAt,
    };
  },
});

// ============================================================================
// CROSS-SELL OPPORTUNITIES
// ============================================================================

/**
 * Detect and create cross-sell opportunities based on behavioral patterns
 */
async function detectCrossSellOpportunity(
  ctx: any,
  params: {
    userId?: Id<"users">;
    deviceId?: string;
    eventType: string;
    metadata: any;
  }
) {
  // Get recent events (last 7 days)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let recentEvents;

  if (params.userId) {
    recentEvents = await ctx.db
      .query("behavioralEvents")
      .withIndex("by_userId", (q: any) => q.eq("userId", params.userId))
      .filter((q: any) => q.gte(q.field("createdAt"), sevenDaysAgo))
      .collect();
  } else if (params.deviceId) {
    recentEvents = await ctx.db
      .query("behavioralEvents")
      .withIndex("by_deviceId", (q: any) => q.eq("deviceId", params.deviceId))
      .filter((q: any) => q.gte(q.field("createdAt"), sevenDaysAgo))
      .collect();
  } else {
    return;
  }

  // Get financial profile
  let financialProfile;
  if (params.userId) {
    financialProfile = await ctx.db
      .query("financialProfiles")
      .withIndex("by_userId", (q: any) => q.eq("userId", params.userId))
      .first();
  } else if (params.deviceId) {
    financialProfile = await ctx.db
      .query("financialProfiles")
      .withIndex("by_deviceId", (q: any) => q.eq("deviceId", params.deviceId))
      .first();
  }

  if (!financialProfile) return;

  const opportunities: Array<{
    trigger: string;
    productCategory: string;
    reason: string;
    triggerScore: number;
  }> = [];

  // ===== PATTERN 1: Multiple credit card articles + no credit card =====
  const creditCardArticles = recentEvents.filter(
    (e: any) => e.metadata.articleTopic && 
    (e.metadata.articleTopic.includes("credit-card") || 
     e.metadata.articleTopic.includes("cashback") ||
     e.metadata.articleTopic.includes("rewards"))
  );

  if (creditCardArticles.length >= 3 && !financialProfile.hasCreditCard) {
    opportunities.push({
      trigger: "article_pattern",
      productCategory: "creditCard",
      reason: `Read ${creditCardArticles.length} credit card articles in the last week`,
      triggerScore: Math.min(95, 60 + creditCardArticles.length * 10),
    });
  }

  // ===== PATTERN 2: Investment articles + low investment rate =====
  const investmentArticles = recentEvents.filter(
    (e: any) => e.metadata.articleTopic &&
    (e.metadata.articleTopic.includes("investment") ||
     e.metadata.articleTopic.includes("mutual-fund") ||
     e.metadata.articleTopic.includes("stock"))
  );

  const investmentRate = financialProfile.income 
    ? (financialProfile.investments || 0) / financialProfile.income 
    : 0;

  if (investmentArticles.length >= 2 && investmentRate < 0.1) {
    opportunities.push({
      trigger: "article_pattern",
      productCategory: "investment",
      reason: `Showing interest in investments (${investmentArticles.length} articles) but low investment rate`,
      triggerScore: 85,
    });
  }

  // ===== PATTERN 3: Insurance articles + financial gaps =====
  const insuranceArticles = recentEvents.filter(
    (e: any) => e.metadata.articleTopic &&
    (e.metadata.articleTopic.includes("insurance") ||
     e.metadata.articleTopic.includes("health") ||
     e.metadata.articleTopic.includes("life"))
  );

  const hasInsuranceGap = financialProfile.gaps?.some(
    (g: string) => g === "noInsurance" || g === "underInsured"
  );

  if (insuranceArticles.length >= 2 && hasInsuranceGap) {
    opportunities.push({
      trigger: "article_pattern_gap",
      productCategory: "insurance",
      reason: "Active interest in insurance + identified coverage gap",
      triggerScore: 90,
    });
  }

  // ===== PATTERN 4: Product views without application =====
  const productViews = recentEvents.filter((e: any) => e.eventType === "product_view");
  const productApplications = recentEvents.filter((e: any) => e.eventType === "product_apply");

  if (productViews.length >= 5 && productApplications.length === 0) {
    // User is browsing but not applying - might need nudge
    const viewedCategories = productViews
      .map((e: any) => e.metadata.productCategory)
      .filter((c: any) => c);
    
    const mostViewedCategory = viewedCategories.reduce((acc: any, cat: any) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(mostViewedCategory)
      .sort((a: any, b: any) => b[1] - a[1])[0];

    if (topCategory) {
      opportunities.push({
        trigger: "browsing_without_action",
        productCategory: topCategory[0],
        reason: `Viewed ${topCategory[1]} ${topCategory[0]} products but hasn't applied`,
        triggerScore: 75,
      });
    }
  }

  // ===== PATTERN 5: High savings rate + no investment =====
  const savingsRate = financialProfile.income
    ? (financialProfile.savings || 0) / financialProfile.income
    : 0;

  if (savingsRate > 0.3 && !financialProfile.investments) {
    opportunities.push({
      trigger: "profile_analysis",
      productCategory: "investment",
      reason: `High savings rate (${(savingsRate * 100).toFixed(0)}%) but no investments`,
      triggerScore: 88,
    });
  }

  // ===== PATTERN 6: Loan articles + high debt =====
  const loanArticles = recentEvents.filter(
    (e: any) => e.metadata.articleTopic &&
    (e.metadata.articleTopic.includes("loan") ||
     e.metadata.articleTopic.includes("debt") ||
     e.metadata.articleTopic.includes("emi"))
  );

  const hasHighDebt = financialProfile.gaps?.includes("highDebtRatio");

  if (loanArticles.length >= 2 && hasHighDebt) {
    opportunities.push({
      trigger: "article_pattern_gap",
      productCategory: "loan",
      reason: "Researching debt consolidation with high debt ratio",
      triggerScore: 82,
    });
  }

  // ===== CREATE OPPORTUNITY RECORDS =====
  for (const opp of opportunities) {
    // Check if opportunity already exists
    const existingOpportunities = params.userId
      ? await ctx.db
          .query("crossSellOpportunities")
          .withIndex("by_userId", (q: any) => q.eq("userId", params.userId))
          .collect()
      : await ctx.db
          .query("crossSellOpportunities")
          .withIndex("by_deviceId", (q: any) => q.eq("deviceId", params.deviceId))
          .collect();

    const alreadyExists = existingOpportunities.some(
      (existing: any) => 
        existing.productCategory === opp.productCategory &&
        existing.status === "active"
    );

    if (!alreadyExists && opp.triggerScore >= 70) {
      await ctx.db.insert("crossSellOpportunities", {
        userId: params.userId,
        deviceId: params.deviceId,
        opportunityType: opp.trigger,
        category: opp.productCategory,
        triggeredBy: [opp.trigger],
        triggerScore: opp.triggerScore,
        channel: "in-app",
        message: opp.reason,
        ctaLabel: "Explore Options",
        ctaUrl: `/marketplace?category=${opp.productCategory}`,
        status: "active",
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Create a notification for high-triggerScore opportunities
      if (opp.triggerScore >= 85) {
        await ctx.db.insert("notifications", {
          userId: params.userId,
          deviceId: params.deviceId,
          type: "cross_sell",
          title: `We found ${opp.productCategory} options for you`,
          message: opp.reason,
          priority: "medium",
          category: opp.productCategory,
          actionUrl: `/marketplace?category=${opp.productCategory}`,
          actionLabel: "Explore Options",
          isRead: false,
          createdAt: Date.now(),
        });
      }
    }
  }
}

/**
 * Get active cross-sell opportunities for user
 */
export const getCrossSellOpportunities = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("converted"),
      v.literal("dismissed")
    )),
  },
  handler: async (ctx, args) => {
    let opportunities;
    if (args.userId) {
      opportunities = await ctx.db
        .query("crossSellOpportunities")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    } else if (args.deviceId) {
      opportunities = await ctx.db
        .query("crossSellOpportunities")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .order("desc")
        .collect();
    } else {
      return [];
    }

    // Filter by status if specified
    if (args.status) {
      opportunities = opportunities.filter(o => o.status === args.status);
    }

    // Sort by triggerScore
    opportunities.sort((a: any, b: any) => b.triggerScore - a.triggerScore);

    return opportunities;
  },
});

/**
 * Update cross-sell opportunity status
 */
export const updateOpportunityStatus = mutation({
  args: {
    opportunityId: v.id("crossSellOpportunities"),
    status: v.union(
      v.literal("active"),
      v.literal("converted"),
      v.literal("dismissed")
    ),
    productId: v.optional(v.id("financialProducts")),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      status: args.status,
    };
    
    // Add product ID if converting
    if (args.productId && args.status === "converted") {
      updates.productId = args.productId;
      updates.convertedAt = Date.now();
    }
    
    // Add engaged/dismissed time
    if (args.status === "dismissed") {
      updates.engagedAt = Date.now();
    }
    
    await ctx.db.patch(args.opportunityId, updates);

    return { success: true };
  },
});
