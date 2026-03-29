// AI Schemas — Zod types for structured LLM outputs
import { z } from "zod";

export const IntentClassificationSchema = z.object({
  intent: z.enum([
    "onboarding",
    "news-query",
    "market-query",
    "money-help",
    "et-product-discovery",
    "story-deepdive",
    "general",
  ]),
  confidence: z.number().min(0).max(1),
  entities: z.array(z.string()),
});

export const AgentResponseSchema = z.object({
  answer: z.string(),
  reasoning: z.string(),
  needsRetrieval: z.boolean(),
  topics: z.array(z.string()),
  suggestedActions: z.array(z.object({
    label: z.string(),
    type: z.enum(["read", "subscribe", "register", "save", "explore"]),
    href: z.string().optional(),
  })),
});

export const ProfileExtractionSchema = z.object({
  userType: z.enum(["student", "investor", "founder", "professional", "general"]),
  interests: z.array(z.string()),
  goals: z.array(z.string()),
  riskLevel: z.enum(["low", "medium", "high"]),
  summary: z.string(),
});

export const RecommendationSchema = z.object({
  contentId: z.string(),
  reason: z.string(),
  score: z.number().min(0).max(1),
  actionType: z.enum(["read", "subscribe", "register", "save", "explore"]),
  ctaLabel: z.string(),
});

export type IntentClassification = z.infer<typeof IntentClassificationSchema>;
export type AgentResponse = z.infer<typeof AgentResponseSchema>;
export type ProfileExtraction = z.infer<typeof ProfileExtractionSchema>;
export type RecommendationType = z.infer<typeof RecommendationSchema>;
