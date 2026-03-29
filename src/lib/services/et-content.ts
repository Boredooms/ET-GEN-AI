// ET Content Service — Mock ET article data with search and retrieval
// In production, this would call the real ET CMS API / vector store

import type { ContentItem, Recommendation } from "@/types";

const ET_CONTENT: ContentItem[] = [
  {
    id: "et-001",
    title: "Nifty 50 Climbs 1.2% as RBI Signals Rate Pause",
    summary: "The Indian benchmark index gained momentum after the Reserve Bank of India hinted at holding interest rates, boosting investor sentiment across banking and FMCG stocks.",
    source: "ET Markets",
    topic: "markets",
    audience: ["investor", "professional"],
    tags: ["nifty", "rbi", "interest-rates", "banking"],
    url: "https://economictimes.indiatimes.com",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    urgency: "high",
    isPremium: false,
  },
  {
    id: "et-002",
    title: "India's Startup Ecosystem Raises $2.1B in Q1 2026",
    summary: "Despite global funding slowdowns, Indian startups attracted significant capital in the first quarter, led by fintech, SaaS, and climate tech verticals.",
    source: "ET Startup",
    topic: "startups",
    audience: ["founder", "investor"],
    tags: ["startup", "funding", "fintech", "saas"],
    url: "https://economictimes.indiatimes.com",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    urgency: "normal",
    isPremium: false,
  },
  {
    id: "et-003",
    title: "Union Budget 2026: Tax Slabs Revised for Middle-Income Earners",
    summary: "The Finance Ministry has proposed significant revisions to income tax slabs under the new regime, potentially increasing take-home pay for individuals earning between ₹7L-₹15L annually.",
    source: "ET Policy",
    topic: "policy",
    audience: ["professional", "general"],
    tags: ["budget", "tax", "income-tax", "finance-ministry"],
    url: "https://economictimes.indiatimes.com",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    urgency: "high",
    isPremium: true,
  },
  {
    id: "et-004",
    title: "SEBI Tightens F&O Rules: What Retail Investors Need to Know",
    summary: "The Securities and Exchange Board of India has introduced new guardrails for futures and options trading, increasing margin requirements and capping weekly expiry contracts.",
    source: "ET Markets",
    topic: "policy",
    audience: ["investor"],
    tags: ["sebi", "fno", "derivatives", "regulation"],
    url: "https://economictimes.indiatimes.com",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    urgency: "high",
    isPremium: false,
  },
  {
    id: "et-005",
    title: "Explainer: Understanding India's Current Account Deficit in 2026",
    summary: "India's CAD widened to 1.8% of GDP in Q3 FY26, driven by higher gold imports and a services surplus. Here is what it means for the rupee and the broader economy.",
    source: "ET Explainers",
    topic: "macro",
    audience: ["student", "general", "professional"],
    tags: ["current-account", "cad", "rupee", "economy"],
    url: "https://economictimes.indiatimes.com",
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    urgency: "normal",
    isPremium: false,
  },
  {
    id: "et-006",
    title: "Reliance Jio Launches AI-Powered 6G Trial in Mumbai",
    summary: "Jio's 6G pilot is running across select Mumbai corridors using AI-managed spectrum allocation, promising 10Gbps speeds with sub-1ms latency for enterprise and consumer applications.",
    source: "ET Tech",
    topic: "tech",
    audience: ["founder", "professional", "general"],
    tags: ["jio", "6g", "telecom", "ai"],
    url: "https://economictimes.indiatimes.com",
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    urgency: "normal",
    isPremium: false,
  },
  {
    id: "et-007",
    title: "Gold Hits ₹78,000 per 10g — Safe Haven or Overvalued?",
    summary: "Gold prices have surged to record highs amid geopolitical uncertainty and central bank buying. Analysts are divided on whether the rally has further room or is due for a correction.",
    source: "ET Wealth",
    topic: "commodities",
    audience: ["investor", "general"],
    tags: ["gold", "commodities", "safe-haven", "inflation"],
    url: "https://economictimes.indiatimes.com",
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    urgency: "normal",
    isPremium: true,
  },
  {
    id: "et-008",
    title: "How to Start SIP in 2026: A Beginner's Complete Guide",
    summary: "Systematic Investment Plans remain one of the most accessible wealth-building tools for Indian investors. This guide walks through fund selection, time horizon, and risk matching.",
    source: "ET Money",
    topic: "personal-finance",
    audience: ["student", "general"],
    tags: ["sip", "mutual-funds", "investing", "beginner"],
    url: "https://economictimes.indiatimes.com",
    publishedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    urgency: "evergreen",
    isPremium: false,
  },
  {
    id: "et-009",
    title: "IT Stocks Rally 4% on Strong Cloud Guidance from Global Tech Giants",
    summary: "Nifty IT index outperformed broader markets today as investors cheered positive commentary from US hyper-scalers. TCS, Infosys, and HCL Tech are leading the charge as enterprise spend shows signs of recovery.",
    source: "ET Tech",
    topic: "markets",
    audience: ["investor", "professional"],
    tags: ["it-stocks", "tcs", "infosys", "tech-rally", "cloud"],
    url: "https://economictimes.indiatimes.com",
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    urgency: "high",
    isPremium: false,
  },
];

/**
 * Search content by query terms and topic tags
 */
export function searchContent(query: string, limit = 5): ContentItem[] {
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);

  const scored = ET_CONTENT.map((item) => {
    let score = 0;
    const searchText = `${item.title} ${item.summary} ${item.tags.join(" ")} ${item.topic}`.toLowerCase();

    queryWords.forEach((word) => {
      if (searchText.includes(word)) score += 1;
    });

    // Boost recent content
    const ageHours = (Date.now() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60);
    if (ageHours < 6) score += 2;
    else if (ageHours < 24) score += 1;

    // Boost high urgency
    if (item.urgency === "breaking" || item.urgency === "high") score += 1;

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}

/**
 * Get recommendations for a user profile (rule-based, not AI)
 */
export function getRecommendationsForProfile(
  userType: string,
  interests: string[],
  limit = 6
): ContentItem[] {
  const scored = ET_CONTENT.map((item) => {
    let score = 0;

    // Audience match
    if (item.audience.includes(userType)) score += 3;

    // Interest / topic match
    interests.forEach((interest) => {
      if (item.topic === interest || item.tags.includes(interest)) score += 2;
    });

    // Freshness
    const ageHours = (Date.now() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60);
    if (ageHours < 24) score += 1;

    return { item, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}

/**
 * Get content by ID
 */
export function getContentById(id: string): ContentItem | undefined {
  return ET_CONTENT.find((item) => item.id === id);
}

/**
 * Get all content (paginated)
 */
export function getAllContent(page = 1, pageSize = 10) {
  const sorted = [...ET_CONTENT].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const start = (page - 1) * pageSize;
  return {
    items: sorted.slice(start, start + pageSize),
    total: ET_CONTENT.length,
    page,
    pageSize,
    hasMore: start + pageSize < ET_CONTENT.length,
  };
}
