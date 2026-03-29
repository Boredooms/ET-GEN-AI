"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";
import { Rss, Clock, ExternalLink, Bookmark, Share2, Loader2, Zap, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ArticleCard } from "@/components/feed/article-card";

export default function FeedPage() {
  const { profile, deviceId, isLoading: profileLoading } = useUserProfile();
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());

  const userId = profile?.userId as any;

  // Fetch personalized feed
  const feedData = useQuery(api.contentRecommendations.getPersonalizedFeed, {
    userId: userId || undefined,
    deviceId: deviceId || undefined,
    limit: 50,
  });

  // Fetch recent articles as fallback
  const recentArticles = useQuery(api.articles.getRecentArticles, {
    limit: 50,
    category,
  });

  // Track interaction
  const trackInteraction = useMutation(api.articles.trackInteraction);

  const handleSave = async (articleId: string) => {
    const sessionId = typeof window !== "undefined" 
      ? sessionStorage.getItem("sessionId") || Date.now().toString() 
      : Date.now().toString();
    
    if (typeof window !== "undefined" && !sessionStorage.getItem("sessionId")) {
      sessionStorage.setItem("sessionId", sessionId);
    }

    const isSaved = savedArticles.has(articleId);
    
    await trackInteraction({
      userId: userId || undefined,
      deviceId: deviceId || undefined,
      articleId: articleId as any,
      interactionType: isSaved ? "unsave" : "save",
      sessionId,
    });

    // Update local state
    setSavedArticles(prev => {
      const next = new Set(prev);
      if (isSaved) {
        next.delete(articleId);
      } else {
        next.add(articleId);
      }
      return next;
    });
  };

  const handleShare = async (articleId: string, article: any) => {
    const sessionId = typeof window !== "undefined" 
      ? sessionStorage.getItem("sessionId") || Date.now().toString() 
      : Date.now().toString();
    
    await trackInteraction({
      userId: userId || undefined,
      deviceId: deviceId || undefined,
      articleId: articleId as any,
      interactionType: "share",
      sessionId,
    });

    // Share functionality
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.sourceUrl,
        });
      } catch (error) {
        // User cancelled or sharing not supported
        console.log("Share cancelled or not supported");
      }
    }
  };

  const categories = ["Markets", "Technology", "Business", "Personal Finance", "Economy"];

  const displayArticles = feedData && feedData.length > 0
    ? feedData.map((item: any) => item.article).filter(Boolean)
    : recentArticles || [];

  if (profileLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Rss className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Your Feed</h1>
              {feedData && feedData.length > 0 && (
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  Personalized
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              Latest news and insights from Economic Times
              {profile?.userType && `, curated for ${profile.userType}s`}
            </p>
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setCategory(undefined)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === undefined
                  ? "bg-primary text-primary-foreground"
                  : "bg-[oklch(1_0_0_/_5%)] text-muted-foreground hover:bg-[oklch(1_0_0_/_10%)]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-[oklch(1_0_0_/_5%)] text-muted-foreground hover:bg-[oklch(1_0_0_/_10%)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {displayArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[oklch(1_0_0_/_10%)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.12_0_0)]">
              <TrendingUp className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">No articles yet</h3>
            <p className="mx-auto max-w-md text-sm text-muted-foreground mb-6">
              Articles from Economic Times will appear here once they're fetched. 
              The system fetches new articles every 30 minutes automatically.
            </p>
            <p className="text-xs text-muted-foreground">
              To manually trigger a fetch, run the RSS feed action from the Convex dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayArticles.map((article: any, i: number) => (
              <motion.div
                key={article._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ArticleCard
                  article={article}
                  score={feedData?.find((f: any) => f.article?._id === article._id)?.score}
                  reason={feedData?.find((f: any) => f.article?._id === article._id)?.reason}
                  onSave={() => handleSave(article._id)}
                  onShare={() => handleShare(article._id, article)}
                  isSaved={savedArticles.has(article._id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
