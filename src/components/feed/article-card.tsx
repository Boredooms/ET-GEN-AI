"use client";

import Link from "next/link";
import { Clock, Bookmark, Share2, Eye } from "lucide-react";

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    summary: string;
    category: string;
    subCategory?: string;
    author?: string;
    publishedAt: number;
    readTime?: number;
    imageUrl?: string;
    sourceUrl: string;
    viewCount: number;
    readCount: number;
    saveCount: number;
  };
  score?: number;
  reason?: string;
  onSave?: () => void;
  onShare?: () => void;
  isSaved?: boolean;
  compact?: boolean;
}

export function ArticleCard({ 
  article, 
  score, 
  reason, 
  onSave, 
  onShare,
  isSaved = false,
  compact = false 
}: ArticleCardProps) {
  const categoryColors: Record<string, string> = {
    "Markets": "oklch(0.6 0.15 270)", // Purple
    "Technology": "oklch(0.6 0.15 220)", // Blue
    "Business": "oklch(0.65 0.15 85)", // Yellow
    "Personal Finance": "oklch(0.6 0.15 142)", // Green
    "Economy": "oklch(0.6 0.15 180)", // Cyan
  };

  const categoryColor = categoryColors[article.category] || "oklch(0.5 0 0)";

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] transition-all hover:border-[oklch(1_0_0_/_15%)] hover:bg-[oklch(0.11_0_0)]">
      {/* Image Section */}
      {article.imageUrl && !compact && (
        <div className="relative aspect-video w-full overflow-hidden bg-[oklch(0.15_0_0)]">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.09_0_0)] to-transparent opacity-60" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-5">
        {/* Category Badge */}
        <div className="mb-2 flex items-center gap-2">
          <span 
            className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
            style={{ 
              backgroundColor: `color-mix(in oklch, ${categoryColor} 15%, transparent)`,
              color: categoryColor 
            }}
          >
            {article.subCategory || article.category}
          </span>
          {score !== undefined && (
            <span className="text-[10px] text-muted-foreground">
              {Math.round(score * 100)}% match
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
          <h3 className={`font-semibold text-foreground transition-colors group-hover:text-primary ${compact ? "text-base line-clamp-2" : "text-lg line-clamp-2 mb-2"}`}>
            {article.title}
          </h3>
        </Link>

        {/* Summary */}
        <p className={`text-sm text-muted-foreground ${compact ? "line-clamp-2" : "line-clamp-3"} mb-3`}>
          {article.summary}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {article.author && (
            <span className="font-medium">{article.author}</span>
          )}
          <span>{formattedDate}</span>
          {article.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime} min read</span>
            </div>
          )}
        </div>

        {/* Engagement Stats */}
        {!compact && (
          <div className="mt-3 flex items-center gap-4 border-t border-[oklch(1_0_0_/_5%)] pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{article.viewCount}</span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                onSave?.();
              }}
              className={`flex items-center gap-1 transition-colors hover:text-primary ${isSaved ? "text-primary" : ""}`}
            >
              <Bookmark className={`h-3 w-3 ${isSaved ? "fill-current" : ""}`} />
              <span>{article.saveCount}</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onShare?.();
              }}
              className="flex items-center gap-1 transition-colors hover:text-primary"
            >
              <Share2 className="h-3 w-3" />
              <span>Share</span>
            </button>
          </div>
        )}

        {/* Reason (if provided) */}
        {reason && !compact && (
          <div className="mt-3 rounded-lg bg-[oklch(1_0_0_/_3%)] px-3 py-2 text-xs text-muted-foreground">
            {reason}
          </div>
        )}
      </div>
    </div>
  );
}
