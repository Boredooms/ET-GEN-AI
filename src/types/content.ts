// Content and recommendation types

export interface ContentItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  topic: string;
  audience: string[];
  tags: string[];
  url?: string;
  publishedAt: string;
  urgency: "breaking" | "high" | "normal" | "evergreen";
  isPremium: boolean;
  imageUrl?: string;
}

export interface Recommendation {
  id: string;
  userId?: string;
  contentId: string;
  item: ContentItem;
  reason: string;
  score: number;
  actionType: "read" | "subscribe" | "register" | "save" | "explore";
  ctaLabel: string;
  ctaHref?: string;
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  timeline: TimelineEvent[];
  keyPlayers: string[];
  sentiment: "positive" | "negative" | "neutral" | "mixed";
  sources: ContentItem[];
  followUpQuestions: string[];
  topic: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  headline: string;
  description: string;
  significance: "low" | "medium" | "high";
}
