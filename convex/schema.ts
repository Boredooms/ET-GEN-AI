import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    authProviderId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]).index("by_authProviderId", ["authProviderId"]),

  profiles: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()), // For anonymous users before signup
    userType: v.string(), // "student" | "investor" | "founder" | "professional" | "general"
    interests: v.array(v.string()),
    goals: v.array(v.string()),
    language: v.string(),
    riskLevel: v.string(),
    consentGiven: v.boolean(),
    profileSummary: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]).index("by_deviceId", ["deviceId"]),

  conversations: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    title: v.optional(v.string()),
    intent: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]).index("by_deviceId", ["deviceId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.string(), // "user" | "assistant" | "system"
    content: v.string(),
    status: v.string(), // "pending" | "streaming" | "complete" | "error"
    sources: v.optional(v.array(v.object({
      id: v.string(),
      title: v.string(),
      url: v.optional(v.string()),
      excerpt: v.string(),
      publishedAt: v.optional(v.string()),
      topic: v.optional(v.string()),
      source: v.optional(v.string())
    }))),
    actions: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      type: v.string(),
      href: v.optional(v.string()),
      payload: v.optional(v.any()), // v.record fallback if any doesn't work? v.any() is valid in Convex
    }))),
    createdAt: v.number(),
  }).index("by_conversationId", ["conversationId"]),

  recommendations: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    contentId: v.string(),
    title: v.string(),
    summary: v.string(),
    source: v.string(),
    topic: v.string(),
    url: v.optional(v.string()),
    publishedAt: v.string(),
    reason: v.string(),
    score: v.number(),
    actionType: v.string(),
    ctaLabel: v.string(),
    ctaHref: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]).index("by_deviceId", ["deviceId"]),

  // FINANCIAL PROFILES - Deep financial snapshot
  financialProfiles: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    
    // Income & Expenses
    monthlyIncome: v.optional(v.number()),
    incomeSource: v.array(v.string()),
    monthlyExpenses: v.optional(v.number()),
    savingsRate: v.optional(v.number()),
    
    // Assets & Liabilities
    totalAssets: v.optional(v.number()),
    totalLiabilities: v.optional(v.number()),
    netWorth: v.optional(v.number()),
    
    // Investment Portfolio
    hasInvestments: v.boolean(),
    investmentTypes: v.array(v.string()),
    portfolioValue: v.optional(v.number()),
    riskAppetite: v.string(),
    
    // Insurance
    hasHealthInsurance: v.boolean(),
    hasLifeInsurance: v.boolean(),
    hasVehicleInsurance: v.boolean(),
    insuranceCoverage: v.optional(v.number()),
    
    // Loans & Credit
    hasHomeLoan: v.boolean(),
    hasPersonalLoan: v.boolean(),
    hasCarLoan: v.boolean(),
    totalDebt: v.optional(v.number()),
    creditScore: v.optional(v.number()),
    hasCreditCard: v.boolean(),
    creditCardCount: v.number(),
    
    // Financial Goals
    goals: v.array(v.object({
      type: v.string(),
      targetAmount: v.number(),
      timeHorizon: v.number(),
      priority: v.string(),
      currentProgress: v.number(),
    })),
    
    // Financial Health
    healthScore: v.number(),
    gaps: v.array(v.string()),
    
    // Metadata
    completeness: v.number(),
    lastUpdated: v.number(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]).index("by_deviceId", ["deviceId"]),

  // FINANCIAL PRODUCTS - ET Partner products catalog
  financialProducts: defineTable({
    productId: v.string(),
    category: v.string(),
    subCategory: v.string(),
    
    partnerName: v.string(),
    partnerLogo: v.optional(v.string()),
    
    name: v.string(),
    description: v.string(),
    features: v.array(v.string()),
    
    // Eligibility
    minIncome: v.optional(v.number()),
    minCreditScore: v.optional(v.number()),
    ageMin: v.optional(v.number()),
    ageMax: v.optional(v.number()),
    
    // Financial Details
    interestRate: v.optional(v.number()),
    processingFee: v.optional(v.number()),
    annualFee: v.optional(v.number()),
    coverageAmount: v.optional(v.number()),
    returns: v.optional(v.string()),
    
    // Benefits
    benefits: v.array(v.string()),
    
    // CTA
    ctaLabel: v.string(),
    applicationUrl: v.optional(v.string()),
    
    // Targeting
    bestFor: v.array(v.string()),
    
    // Metadata
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    etCommission: v.optional(v.number()),
    rank: v.number(),
    createdAt: v.number(),
  }).index("by_category", ["category"]).index("by_productId", ["productId"]),

  // SERVICE RECOMMENDATIONS - AI-generated matches
  serviceRecommendations: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    
    productId: v.id("financialProducts"),
    
    reason: v.string(),
    matchScore: v.number(),
    priority: v.string(),
    
    estimatedSavings: v.optional(v.number()),
    estimatedReturns: v.optional(v.number()),
    eligibilityScore: v.number(),
    
    triggeredBy: v.string(),
    triggerEvent: v.optional(v.string()),
    
    status: v.string(),
    shownAt: v.optional(v.number()),
    interactedAt: v.optional(v.number()),
    
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_deviceId", ["deviceId"])
    .index("by_status", ["status"]),

  // USER APPLICATIONS - Track product applications
  userApplications: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    
    productId: v.id("financialProducts"),
    recommendationId: v.optional(v.id("serviceRecommendations")),
    
    applicationId: v.string(),
    status: v.string(),
    
    partnerReferenceId: v.optional(v.string()),
    partnerStatus: v.optional(v.string()),
    
    submittedAt: v.optional(v.number()),
    approvedAt: v.optional(v.number()),
    
    conversionValue: v.optional(v.number()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_deviceId", ["deviceId"])
    .index("by_status", ["status"]),

  // BEHAVIORAL EVENTS - User action tracking
  behavioralEvents: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    
    eventType: v.string(),
    eventCategory: v.string(),
    
    contentId: v.optional(v.string()),
    contentTitle: v.optional(v.string()),
    contentTopic: v.optional(v.string()),
    query: v.optional(v.string()),
    
    timeSpent: v.optional(v.number()),
    scrollDepth: v.optional(v.number()),
    engagement: v.string(),
    
    conversationId: v.optional(v.id("conversations")),
    sessionId: v.string(),
    
    source: v.string(),
    metadata: v.optional(v.any()),
    
    createdAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_deviceId", ["deviceId"])
    .index("by_eventType", ["eventType"]),

  // CROSS-SELL OPPORTUNITIES
  crossSellOpportunities: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    
    opportunityType: v.string(),
    category: v.string(),
    
    productId: v.optional(v.id("financialProducts")),
    
    triggeredBy: v.array(v.string()),
    triggerScore: v.number(),
    
    optimalTime: v.optional(v.number()),
    channel: v.string(),
    
    message: v.string(),
    ctaLabel: v.string(),
    ctaUrl: v.optional(v.string()),
    
    status: v.string(),
    sentAt: v.optional(v.number()),
    engagedAt: v.optional(v.number()),
    convertedAt: v.optional(v.number()),
    
    estimatedValue: v.optional(v.number()),
    actualValue: v.optional(v.number()),
    
    createdAt: v.number(),
    expiresAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_deviceId", ["deviceId"])
    .index("by_status", ["status"]),

  // NOTIFICATIONS - Smart notifications system
  notifications: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    
    type: v.string(),
    title: v.string(),
    message: v.string(),
    
    priority: v.string(),
    category: v.string(),
    
    actionLabel: v.optional(v.string()),
    actionUrl: v.optional(v.string()),
    
    relatedId: v.optional(v.string()),
    
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_deviceId", ["deviceId"])
    .index("by_isRead", ["isRead"]),

  // ARTICLES - ET News content cache
  articles: defineTable({
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
    
    // Engagement metrics
    viewCount: v.number(),
    readCount: v.number(),
    shareCount: v.number(),
    saveCount: v.number(),
    
    // RSS metadata
    rssSource: v.string(),
    
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_articleId", ["articleId"])
    .index("by_category", ["category"])
    .index("by_publishedAt", ["publishedAt"])
    .index("by_rssSource", ["rssSource"]),

  // USER ARTICLE INTERACTIONS - Track reading behavior
  userArticleInteractions: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    
    articleId: v.id("articles"),
    
    interactionType: v.string(), // "view" | "read" | "save" | "share" | "unsave"
    
    readProgress: v.optional(v.number()), // 0-100%
    timeSpent: v.optional(v.number()), // seconds
    
    scrollDepth: v.optional(v.number()), // 0-100%
    
    sessionId: v.string(),
    
    createdAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_deviceId", ["deviceId"])
    .index("by_articleId", ["articleId"])
    .index("by_interactionType", ["interactionType"]),

  // CONTENT RECOMMENDATIONS - Personalized article feed
  contentRecommendations: defineTable({
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    
    articleId: v.id("articles"),
    
    score: v.number(),
    reason: v.string(),
    
    // Scoring factors
    profileMatchScore: v.number(),
    recencyScore: v.number(),
    engagementScore: v.number(),
    diversityScore: v.number(),
    behavioralScore: v.number(),
    
    status: v.string(), // "pending" | "shown" | "clicked" | "dismissed"
    
    shownAt: v.optional(v.number()),
    clickedAt: v.optional(v.number()),
    dismissedAt: v.optional(v.number()),
    
    position: v.optional(v.number()),
    
    createdAt: v.number(),
    expiresAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_deviceId", ["deviceId"])
    .index("by_status", ["status"])
    .index("by_score", ["score"]),

  // PROVIDER CONNECTIONS - User connections to financial providers (Zerodha, Upstox, etc.)
  providerConnections: defineTable({
    userId: v.id("users"),
    providerId: v.string(), // "zerodha" | "upstox"
    
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.number(),
    
    metadata: v.optional(v.any()), // Extra provider-specific data
    
    isActive: v.boolean(),
    lastSyncedAt: v.number(),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_userId_providerId", ["userId", "providerId"]),

  // PORTFOLIO CACHE - Cached portfolio data from financial providers
  portfolioCache: defineTable({
    userId: v.id("users"),
    providerId: v.string(),
    
    totalValue: v.number(),
    totalInvested: v.number(),
    totalPnl: v.number(),
    totalPnlPercentage: v.number(),
    dayChange: v.number(),
    dayChangePercentage: v.number(),
    
    holdings: v.array(v.any()),
    positions: v.array(v.any()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_userId_providerId", ["userId", "providerId"]),
});
