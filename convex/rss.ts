"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

// ET RSS Feed URLs by category
const ET_RSS_FEEDS = {
  markets: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
  tech: "https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms",
  industry: "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms",
  wealth: "https://economictimes.indiatimes.com/wealth/rssfeeds/837555174.cms",
  startups: "https://economictimes.indiatimes.com/small-biz/startups/rssfeeds/76680551.cms",
  policy: "https://economictimes.indiatimes.com/news/economy/policy/rssfeeds/1373380680.cms",
};

// Category mapping for our system
const CATEGORY_MAP: Record<string, { category: string; subCategory?: string }> = {
  markets: { category: "Markets", subCategory: "Stocks & Trading" },
  tech: { category: "Technology", subCategory: "IT & Telecom" },
  industry: { category: "Business", subCategory: "Industry News" },
  wealth: { category: "Personal Finance", subCategory: "Wealth Management" },
  startups: { category: "Business", subCategory: "Startups" },
  policy: { category: "Economy", subCategory: "Policy & Regulation" },
};

interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  guid?: string;
  creator?: string;
  categories?: string[];
}

interface RSSFeed {
  items: RSSItem[];
}

// Estimate read time based on content length
function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Extract clean text from HTML
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// Parse RSS feed using rss-parser
export const fetchRssFeed = action({
  args: { feedUrl: v.string(), feedKey: v.string() },
  handler: async (ctx, { feedUrl, feedKey }): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      // Dynamic import of rss-parser
      const Parser = (await import("rss-parser")).default;
      const parser = new Parser();

      const feed = await parser.parseURL(feedUrl) as RSSFeed;
      const categoryInfo = CATEGORY_MAP[feedKey];

      let newArticlesCount = 0;

      // Process each article
      for (const item of feed.items.slice(0, 20)) { // Limit to 20 most recent
        if (!item.title || !item.link) continue;

        const articleId = item.guid || item.link;
        const publishedAt = item.pubDate ? new Date(item.pubDate).getTime() : Date.now();
        
        const summary = item.contentSnippet 
          ? stripHtml(item.contentSnippet).substring(0, 300)
          : "";
        
        const content = item.content 
          ? stripHtml(item.content).substring(0, 5000)
          : summary;

        const readTime = estimateReadTime(content);

        // Extract image from content if available
        const imageMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
        const imageUrl = imageMatch ? imageMatch[1] : undefined;

        // Extract tags from categories
        const tags = item.categories || [];

        // Save to database
        await ctx.runMutation(internal.articles.upsertArticle, {
          articleId,
          title: item.title,
          summary,
          content,
          sourceUrl: item.link,
          publishedAt,
          author: item.creator,
          category: categoryInfo.category,
          subCategory: categoryInfo.subCategory,
          tags,
          imageUrl,
          readTime,
          rssSource: feedKey,
        });

        newArticlesCount++;
      }

      return { success: true, count: newArticlesCount };
    } catch (error) {
      console.error(`Error fetching RSS feed ${feedKey}:`, error);
      return { 
        success: false, 
        count: 0, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  },
});

// Fetch all ET RSS feeds
export const fetchAllFeeds = action({
  args: {},
  handler: async (ctx): Promise<{
    totalFeeds: number;
    successCount: number;
    totalArticles: number;
    results: Array<{ feedKey: string; success: boolean; count: number; error?: string }>;
  }> => {
    const results: Array<{ feedKey: string; success: boolean; count: number; error?: string }> = [];

    for (const [feedKey, feedUrl] of Object.entries(ET_RSS_FEEDS)) {
      // Fetch RSS feed inline instead of calling fetchRssFeed
      try {
        const Parser = (await import("rss-parser")).default;
        const parser = new Parser();
        const feed = await parser.parseURL(feedUrl) as RSSFeed;
        const categoryInfo = CATEGORY_MAP[feedKey];
        let newArticlesCount = 0;

        for (const item of feed.items.slice(0, 20)) {
          if (!item.title || !item.link) continue;

          const articleId = item.guid || item.link;
          const publishedAt = item.pubDate ? new Date(item.pubDate).getTime() : Date.now();
          
          const summary = item.contentSnippet 
            ? stripHtml(item.contentSnippet).substring(0, 300)
            : "";
          
          const content = item.content 
            ? stripHtml(item.content).substring(0, 5000)
            : summary;

          const readTime = estimateReadTime(content);
          const imageMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
          const imageUrl = imageMatch ? imageMatch[1] : undefined;
          const tags = item.categories || [];

          await ctx.runMutation(internal.articles.upsertArticle, {
            articleId,
            title: item.title,
            summary,
            content,
            sourceUrl: item.link,
            publishedAt,
            author: item.creator,
            category: categoryInfo.category,
            subCategory: categoryInfo.subCategory,
            tags,
            imageUrl,
            readTime,
            rssSource: feedKey,
          });

          newArticlesCount++;
        }

        results.push({ feedKey, success: true, count: newArticlesCount });
      } catch (error) {
        console.error(`Error fetching RSS feed ${feedKey}:`, error);
        results.push({ 
          feedKey,
          success: false, 
          count: 0, 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    }

    return {
      totalFeeds: results.length,
      successCount: results.filter(r => r.success).length,
      totalArticles: results.reduce((sum, r) => sum + r.count, 0),
      results,
    };
  },
});
