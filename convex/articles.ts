import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// Get recent articles
export const getRecentArticles = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, { limit = 50, category }) => {
    let articles;

    if (category) {
      articles = await ctx.db
        .query("articles")
        .withIndex("by_category", (q) => q.eq("category", category))
        .order("desc")
        .take(limit);
    } else {
      articles = await ctx.db
        .query("articles")
        .withIndex("by_publishedAt")
        .order("desc")
        .take(limit);
    }

    return articles.filter(a => a.isActive);
  },
});

// Get article by ID
export const getArticle = query({
  args: { id: v.id("articles") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Internal mutation to upsert article
export const upsertArticle = internalMutation({
  args: {
    articleId: v.string(),
    title: v.string(),
    summary: v.string(),
    content: v.optional(v.string()),
    sourceUrl: v.string(),
    publishedAt: v.number(),
    author: v.optional(v.string()),
    category: v.string(),
    subCategory: v.optional(v.string()),
    tags: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    readTime: v.optional(v.number()),
    rssSource: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if article already exists
    const existing = await ctx.db
      .query("articles")
      .withIndex("by_articleId", (q) => q.eq("articleId", args.articleId))
      .first();

    if (existing) {
      // Update existing article
      await ctx.db.patch(existing._id, {
        updatedAt: Date.now(),
      });
    } else {
      // Insert new article
      await ctx.db.insert("articles", {
        ...args,
        viewCount: 0,
        readCount: 0,
        shareCount: 0,
        saveCount: 0,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

// Increment view count (internal)
export const incrementViewCount = internalMutation({
  args: { articleId: v.id("articles") },
  handler: async (ctx, { articleId }) => {
    const article = await ctx.db.get(articleId);
    if (article) {
      await ctx.db.patch(articleId, {
        viewCount: article.viewCount + 1,
      });
    }
  },
});

// Increment read count (internal)
export const incrementReadCount = internalMutation({
  args: { articleId: v.id("articles") },
  handler: async (ctx, { articleId }) => {
    const article = await ctx.db.get(articleId);
    if (article) {
      await ctx.db.patch(articleId, {
        readCount: article.readCount + 1,
      });
    }
  },
});

// Increment share count (internal)
export const incrementShareCount = internalMutation({
  args: { articleId: v.id("articles") },
  handler: async (ctx, { articleId }) => {
    const article = await ctx.db.get(articleId);
    if (article) {
      await ctx.db.patch(articleId, {
        shareCount: article.shareCount + 1,
      });
    }
  },
});

// Increment save count (internal)
export const incrementSaveCount = internalMutation({
  args: { articleId: v.id("articles"), increment: v.number() },
  handler: async (ctx, { articleId, increment }) => {
    const article = await ctx.db.get(articleId);
    if (article) {
      await ctx.db.patch(articleId, {
        saveCount: article.saveCount + increment,
      });
    }
  },
});

// Search articles
export const searchArticles = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { query: searchQuery, limit = 20 }) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(100);

    const lowerQuery = searchQuery.toLowerCase();
    
    return articles
      .filter(article => 
        article.isActive && (
          article.title.toLowerCase().includes(lowerQuery) ||
          article.summary.toLowerCase().includes(lowerQuery) ||
          article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
      )
      .slice(0, limit);
  },
});

// Track user article interaction
export const trackInteraction = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    articleId: v.id("articles"),
    interactionType: v.string(),
    readProgress: v.optional(v.number()),
    timeSpent: v.optional(v.number()),
    scrollDepth: v.optional(v.number()),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("userArticleInteractions", {
      ...args,
      createdAt: Date.now(),
    });

    // Update article engagement counts
    if (args.interactionType === "view") {
      const article = await ctx.db.get(args.articleId);
      if (article) {
        await ctx.db.patch(args.articleId, {
          viewCount: article.viewCount + 1,
        });
      }
    } else if (args.interactionType === "read") {
      const article = await ctx.db.get(args.articleId);
      if (article) {
        await ctx.db.patch(args.articleId, {
          readCount: article.readCount + 1,
        });
      }
    } else if (args.interactionType === "share") {
      const article = await ctx.db.get(args.articleId);
      if (article) {
        await ctx.db.patch(args.articleId, {
          shareCount: article.shareCount + 1,
        });
      }
    } else if (args.interactionType === "save") {
      const article = await ctx.db.get(args.articleId);
      if (article) {
        await ctx.db.patch(args.articleId, {
          saveCount: article.saveCount + 1,
        });
      }
    } else if (args.interactionType === "unsave") {
      const article = await ctx.db.get(args.articleId);
      if (article) {
        await ctx.db.patch(args.articleId, {
          saveCount: Math.max(0, article.saveCount - 1),
        });
      }
    }
  },
});

// Get user's saved articles
export const getSavedArticles = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, { userId, deviceId }) => {
    // Get all save interactions
    let interactions;
    
    if (userId) {
      interactions = await ctx.db
        .query("userArticleInteractions")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("interactionType"), "save"))
        .collect();
    } else if (deviceId) {
      interactions = await ctx.db
        .query("userArticleInteractions")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
        .filter((q) => q.eq(q.field("interactionType"), "save"))
        .collect();
    } else {
      return [];
    }

    // Get unique article IDs that are currently saved (not unsaved)
    const savedArticleIds = new Set<string>();
    const unsavedArticleIds = new Set<string>();

    // Sort by time and process in reverse to get latest state
    const sortedInteractions = interactions.sort((a, b) => b.createdAt - a.createdAt);
    
    for (const interaction of sortedInteractions) {
      const articleId = interaction.articleId;
      
      if (!savedArticleIds.has(articleId) && !unsavedArticleIds.has(articleId)) {
        if (interaction.interactionType === "save") {
          savedArticleIds.add(articleId);
        } else if (interaction.interactionType === "unsave") {
          unsavedArticleIds.add(articleId);
        }
      }
    }

    // Fetch articles
    const articles = await Promise.all(
      Array.from(savedArticleIds).map(id => ctx.db.get(id as any))
    );

    return articles.filter(a => a !== null);
  },
});

// Get user's reading history
export const getReadingHistory = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, deviceId, limit = 20 }) => {
    let interactions;
    
    if (userId) {
      interactions = await ctx.db
        .query("userArticleInteractions")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("interactionType"), "read"))
        .order("desc")
        .take(limit);
    } else if (deviceId) {
      interactions = await ctx.db
        .query("userArticleInteractions")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
        .filter((q) => q.eq(q.field("interactionType"), "read"))
        .order("desc")
        .take(limit);
    } else {
      return [];
    }

    // Get unique articles (avoid duplicates)
    const seenArticles = new Set();
    const uniqueInteractions = interactions.filter(i => {
      if (seenArticles.has(i.articleId)) return false;
      seenArticles.add(i.articleId);
      return true;
    });

    // Fetch articles
    const articles = await Promise.all(
      uniqueInteractions.map(i => ctx.db.get(i.articleId))
    );

    return articles.filter(a => a !== null);
  },
});
