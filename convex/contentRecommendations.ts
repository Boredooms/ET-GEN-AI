import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Category interest mapping
const CATEGORY_INTERESTS: Record<string, string[]> = {
  "Markets": ["investing", "trading", "stocks", "markets"],
  "Technology": ["technology", "startups", "innovation"],
  "Business": ["business", "entrepreneurship", "startups"],
  "Personal Finance": ["savings", "insurance", "tax-planning", "retirement", "credit-cards"],
  "Economy": ["economics", "policy", "regulation"],
};

// User type preferred categories
const USER_TYPE_CATEGORIES: Record<string, string[]> = {
  "investor": ["Markets", "Personal Finance", "Business", "Economy"],
  "student": ["Technology", "Personal Finance", "Business"],
  "founder": ["Business", "Technology", "Markets", "Economy"],
  "professional": ["Personal Finance", "Technology", "Business", "Markets"],
  "general": ["Business", "Technology", "Personal Finance", "Markets"],
};

// Calculate profile match score (0-1)
function calculateProfileMatchScore(
  article: any,
  userType: string,
  interests: string[]
): number {
  let score = 0;
  
  // Category match with user type
  const preferredCategories = USER_TYPE_CATEGORIES[userType] || USER_TYPE_CATEGORIES["general"];
  const categoryIndex = preferredCategories.indexOf(article.category);
  if (categoryIndex !== -1) {
    score += (1 - categoryIndex * 0.2) * 0.5; // Up to 0.5 points
  }

  // Interest match
  const articleKeywords = [...article.tags, article.category, article.subCategory || ""]
    .map(t => t.toLowerCase());
  
  const matchingInterests = interests.filter(interest => 
    articleKeywords.some(keyword => keyword.includes(interest.toLowerCase()))
  );
  
  score += (matchingInterests.length / Math.max(interests.length, 1)) * 0.5; // Up to 0.5 points

  return Math.min(1, score);
}

// Calculate recency score (0-1)
function calculateRecencyScore(publishedAt: number): number {
  const now = Date.now();
  const ageInHours = (now - publishedAt) / (1000 * 60 * 60);
  
  if (ageInHours < 1) return 1.0;
  if (ageInHours < 6) return 0.9;
  if (ageInHours < 12) return 0.8;
  if (ageInHours < 24) return 0.7;
  if (ageInHours < 48) return 0.5;
  if (ageInHours < 72) return 0.3;
  return 0.1;
}

// Calculate engagement score (0-1)
function calculateEngagementScore(article: any): number {
  const totalEngagement = article.viewCount + article.readCount * 3 + article.shareCount * 5 + article.saveCount * 4;
  
  // Normalize using log scale
  if (totalEngagement === 0) return 0.1;
  
  const score = Math.log10(totalEngagement + 1) / 3; // Log scale, max around 1000 engagements = 1.0
  return Math.min(1, Math.max(0.1, score));
}

// Calculate diversity bonus (0-1)
function calculateDiversityScore(
  article: any,
  recentlyShownCategories: string[]
): number {
  const categoryCount = recentlyShownCategories.filter(c => c === article.category).length;
  
  if (categoryCount === 0) return 1.0;
  if (categoryCount === 1) return 0.8;
  if (categoryCount === 2) return 0.6;
  if (categoryCount === 3) return 0.4;
  return 0.2;
}

// Generate personalized content recommendations
export const generateRecommendations = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, deviceId, limit = 50 }) => {
    if (!userId && !deviceId) {
      throw new Error("Either userId or deviceId must be provided");
    }

    // Get user profile
    let profile;
    if (userId) {
      profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
    } else if (deviceId) {
      profile = await ctx.db
        .query("profiles")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
        .first();
    }

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Get recent articles
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(200);

    // Get user's recent interactions to calculate behavioral score
    let interactions: any[] = [];
    if (userId) {
      interactions = await ctx.db
        .query("userArticleInteractions")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .order("desc")
        .take(50);
    } else if (deviceId) {
      interactions = await ctx.db
        .query("userArticleInteractions")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
        .order("desc")
        .take(50);
    }

    // Extract recently interacted categories for diversity
    const interactedArticleIds = new Set(interactions.map(i => i.articleId));
    const interactedArticles = await Promise.all(
      Array.from(interactedArticleIds).slice(0, 20).map(id => ctx.db.get(id as any))
    );
    const recentCategories = interactedArticles
      .filter(a => a !== null && 'category' in a)
      .map(a => (a as any).category);

    // Get recently shown recommendations to avoid duplicates
    let existingRecs: any[] = [];
    if (userId) {
      existingRecs = await ctx.db
        .query("contentRecommendations")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .filter((q) => q.gt(q.field("createdAt"), Date.now() - 24 * 60 * 60 * 1000))
        .collect();
    } else if (deviceId) {
      existingRecs = await ctx.db
        .query("contentRecommendations")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
        .filter((q) => q.gt(q.field("createdAt"), Date.now() - 24 * 60 * 60 * 1000))
        .collect();
    }

    const alreadyRecommendedIds = new Set(existingRecs.map(r => r.articleId));

    // Score each article
    const scoredArticles = articles
      .filter(article => 
        article.isActive && 
        !interactedArticleIds.has(article._id) &&
        !alreadyRecommendedIds.has(article._id)
      )
      .map(article => {
        const profileMatchScore = calculateProfileMatchScore(
          article,
          profile!.userType,
          profile!.interests
        );
        const recencyScore = calculateRecencyScore(article.publishedAt);
        const engagementScore = calculateEngagementScore(article);
        const diversityScore = calculateDiversityScore(article, recentCategories);
        
        // Behavioral score (simple version - can be enhanced)
        const behavioralScore = 0.5; // Placeholder for now

        // Weighted final score
        const finalScore = 
          profileMatchScore * 0.30 +
          recencyScore * 0.25 +
          engagementScore * 0.20 +
          diversityScore * 0.15 +
          behavioralScore * 0.10;

        return {
          article,
          profileMatchScore,
          recencyScore,
          engagementScore,
          diversityScore,
          behavioralScore,
          finalScore,
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, limit);

    // Save recommendations
    const recommendations = [];
    for (let i = 0; i < scoredArticles.length; i++) {
      const { article, profileMatchScore, recencyScore, engagementScore, diversityScore, behavioralScore, finalScore } = scoredArticles[i];
      
      const reason = `Recommended based on your ${profile!.userType} profile`;
      
      const recId = await ctx.db.insert("contentRecommendations", {
        userId,
        deviceId,
        articleId: article._id,
        score: finalScore,
        reason,
        profileMatchScore,
        recencyScore,
        engagementScore,
        diversityScore,
        behavioralScore,
        status: "pending",
        position: i,
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      recommendations.push({
        _id: recId,
        article,
        score: finalScore,
        reason,
      });
    }

    return recommendations;
  },
});

// Get personalized feed
export const getPersonalizedFeed = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, deviceId, limit = 50 }) => {
    // Get existing recommendations
    let recommendations;
    if (userId) {
      recommendations = await ctx.db
        .query("contentRecommendations")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .filter((q) => 
          q.and(
            q.eq(q.field("status"), "pending"),
            q.gt(q.field("expiresAt"), Date.now())
          )
        )
        .order("desc")
        .take(limit);
    } else if (deviceId) {
      recommendations = await ctx.db
        .query("contentRecommendations")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
        .filter((q) => 
          q.and(
            q.eq(q.field("status"), "pending"),
            q.gt(q.field("expiresAt"), Date.now())
          )
        )
        .order("desc")
        .take(limit);
    } else {
      // Anonymous users get recent articles sorted by engagement
      const articles = await ctx.db
        .query("articles")
        .withIndex("by_publishedAt")
        .order("desc")
        .take(limit);
      
      return articles.map(article => ({
        article,
        score: 0.5,
        reason: "Trending article",
      }));
    }

    // Fetch articles
    const feed = await Promise.all(
      recommendations.map(async (rec) => {
        const article = await ctx.db.get(rec.articleId);
        return {
          recommendation: rec,
          article,
          score: rec.score,
          reason: rec.reason,
        };
      })
    );

    return feed.filter(item => item.article !== null);
  },
});

// Mark recommendation as shown
export const markRecommendationShown = mutation({
  args: {
    recommendationId: v.id("contentRecommendations"),
  },
  handler: async (ctx, { recommendationId }) => {
    await ctx.db.patch(recommendationId, {
      status: "shown",
      shownAt: Date.now(),
    });
  },
});

// Mark recommendation as clicked
export const markRecommendationClicked = mutation({
  args: {
    recommendationId: v.id("contentRecommendations"),
  },
  handler: async (ctx, { recommendationId }) => {
    await ctx.db.patch(recommendationId, {
      status: "clicked",
      clickedAt: Date.now(),
    });
  },
});
