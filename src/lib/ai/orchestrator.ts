// AI Orchestrator — Supervisor agent that routes requests to specialist agents
// Optimized for Ollama Cloud (Phase 2) with rule-based pre-routing + response caching

import { createOllama } from "ai-sdk-ollama";
import { generateText } from "ai";
import { env, hasOllamaKey } from "@/config/env";
import { SYSTEM_PROMPT, SAFETY_ADDENDUM } from "./prompts";
import { sanitizeInput, applyFinancialGuardrail, isFinancialQuery, checkRateLimit } from "./safety";
import { searchContent } from "@/lib/services/et-content";
import type { IntentCategory } from "@/types";
import type { Source, ActionButton } from "@/types/chat";

// ─── Ollama Client — lazy singleton ──────────────────────────────────────────

let _ollama: ReturnType<typeof createOllama> | null = null;

function getOllama(): ReturnType<typeof createOllama> | null {
  if (!hasOllamaKey()) return null;
  if (!_ollama) {
    _ollama = createOllama({
      baseURL: env.OLLAMA_BASE_URL,
      headers: {
        Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
      },
    });
  }
  return _ollama;
}

// ─── Simple response cache (TTL = 5 minutes) ─────────────────────────────────

const _cache = new Map<string, { value: string; expiresAt: number }>();

function getCached(key: string): string | null {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    _cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key: string, value: string, ttlMs = 5 * 60 * 1000) {
  _cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

// ─── Intent classification — rule-based (zero API cost) ─────────────────────

const INTENT_RULES: [string[], IntentCategory][] = [
  [["nifty", "sensex", "stock", "market", "share", "sector", "sebi", "portfolio", "equity", "indices"], "market-query"],
  [["news", "article", "story", "happened", "latest", "today", "update", "report"], "news-query"],
  [["tax", "sip", "invest", "saving", "insurance", "mutual fund", "budget", "wealth", "returns", "retire"], "money-help"],
  [["et prime", "subscribe", "event", "masterclass", "webinar", "newsletter", "prime"], "et-product-discovery"],
  [["explain", "breakdown", "timeline", "history", "deep dive", "analysis", "why"], "story-deepdive"],
];

export function classifyIntentByRules(query: string): { intent: IntentCategory; confidence: number } {
  const lower = query.toLowerCase();
  for (const [keywords, intent] of INTENT_RULES) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return { intent, confidence: 0.85 };
    }
  }
  return { intent: "general", confidence: 0.5 };
}

// ─── Result shape ─────────────────────────────────────────────────────────────

export interface OrchestrationResult {
  answer: string;
  sources: Source[];
  actions: ActionButton[];
  intent: IntentCategory;
}

// ─── Main orchestrate function ────────────────────────────────────────────────

export async function orchestrate(
  query: string,
  userProfile?: { userType: string; interests: string[]; goals: string[] },
  sessionId = "anonymous"
): Promise<OrchestrationResult> {
  const safeQuery = sanitizeInput(query);

  // Rate limit
  if (!checkRateLimit(sessionId)) {
    return {
      answer: "You are sending messages too quickly. Please wait a moment and try again.",
      sources: [],
      actions: [],
      intent: "general",
    };
  }

  // Rule-based intent classification (no API call)
  const { intent } = classifyIntentByRules(safeQuery);

  // Retrieve relevant ET content (no API call)
  const retrieved = searchContent(safeQuery, 4);
  const sources: Source[] = retrieved.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    excerpt: item.summary.slice(0, 150) + "…",
    publishedAt: item.publishedAt,
    topic: item.topic,
  }));

  // Build action buttons
  const actions: ActionButton[] = [];
  if (retrieved.length > 0) {
    actions.push({ id: "save", label: "Save to Library", type: "save", payload: { contentId: retrieved[0].id } });
  }
  if (intent === "et-product-discovery") {
    actions.push({ id: "prime", label: "Explore ET Prime", type: "subscribe", href: "https://economictimes.indiatimes.com/prime" });
  }
  if (intent === "market-query") {
    actions.push({ id: "signals", label: "View Market Signals", type: "explore", href: "/insights" });
  }
  if (intent === "money-help") {
    actions.push({ id: "advisor", label: "Consult Financial Advisor", type: "explore", href: "/insights" });
  }

  // Generate answer: cache → rule-based → Ollama
  const cacheKey = `${safeQuery.slice(0, 80)}|${intent}`;
  const cached = getCached(cacheKey);
  let answer = cached ?? "";

  if (!answer) {
    const articleContext = retrieved.map((a, i) => `[${i + 1}] ${a.title}\n${a.summary}`).join("\n\n");

    if (hasOllamaKey() && retrieved.length > 0) {
      answer = await _generateWithOllama(safeQuery, articleContext, intent, userProfile);
    } else if (retrieved.length > 0) {
      answer = _ruleBasedAnswer(safeQuery, retrieved, intent);
    } else {
      answer = await _generateWithOllama(safeQuery, "", intent, userProfile);
    }

    if (answer) setCache(cacheKey, answer);
  }

  // Apply financial guardrail
  if (isFinancialQuery(safeQuery)) {
    answer = applyFinancialGuardrail(answer);
  }

  return { answer, sources, actions, intent };
}

// ─── Ollama generation ────────────────────────────────────────────────────────

async function _generateWithOllama(
  query: string,
  articleContext: string,
  intent: IntentCategory,
  userProfile?: { userType: string; interests: string[]; goals: string[] }
): Promise<string> {
  try {
    const ollama = getOllama();
    if (!ollama) return _ruleBasedAnswer(query, [], intent);

    const profileCtx = userProfile
      ? `\nUser: ${userProfile.userType} interested in ${userProfile.interests.join(", ")}`
      : "";

    const prompt = `${SYSTEM_PROMPT}${profileCtx}

User query: "${query}"
Intent: ${intent}
${articleContext ? `\nRelevant ET content:\n${articleContext}` : ""}
${isFinancialQuery(query) ? `\n${SAFETY_ADDENDUM}` : ""}

Respond with a concise editorial-style answer (120-180 words). Reference retrieved content where relevant. End with a clear next step.`;

    const { text } = await generateText({
      model: ollama("qwen3-coder-next:cloud"),
      prompt,
    });

    return text ?? _ruleBasedAnswer(query, [], intent);
  } catch (error) {
    console.error("[Orchestrator] Ollama error:", error);
    return _ruleBasedAnswer(query, [], intent);
  }
}

// ─── Rule-based fallback (no AI) ─────────────────────────────────────────────

function _ruleBasedAnswer(
  query: string,
  articles: { title: string; summary: string; source: string }[],
  intent: IntentCategory
): string {
  if (articles.length === 0) {
    return `No specific ET coverage found for "${query}" right now. Try the Feed or Markets section, or rephrase your question.`;
  }

  const top = articles[0];
  const more = articles.length - 1;
  const moreText = more > 0 ? `\n\n${more} more related article${more > 1 ? "s" : ""} shown below.` : "";

  switch (intent) {
    case "market-query":
      return `**Market Update:** ${top.title}\n\n${top.summary}\n\n*Source: ${top.source}*${moreText}`;
    case "news-query":
      return `**From ET:** ${top.title}\n\n${top.summary}${moreText}`;
    case "money-help":
      return `**Financial Guidance:** ${top.title}\n\n${top.summary}\n\n*For informational purposes only. Consult a certified advisor before making decisions.*`;
    case "story-deepdive":
      return `**Story Brief:** ${top.title}\n\n${top.summary}${moreText}`;
    default:
      return `**${top.title}**\n\n${top.summary}\n\n*Source: ${top.source}*`;
  }
}

// ─── Profile summary (used at onboarding completion) ─────────────────────────

const PROFILE_FALLBACKS: Record<string, string> = {
  investor: "You are an active investor tracking markets and financial signals. You want data-backed insights and actionable next steps.",
  student: "You are a business student building your knowledge of markets, policy, and finance. You want clear explanations and structured learning.",
  founder: "You are a startup founder tracking funding trends, competitor signals, and business intelligence from ET.",
  professional: "You are a business professional who needs concise daily intelligence to stay ahead in your domain.",
  general: "You are an engaged reader who wants to stay informed on business news and discover what ET has to offer.",
};

export async function generateProfileSummary(profile: {
  userType: string;
  interests: string[];
  goals: string[];
}): Promise<string> {
  const fallback = PROFILE_FALLBACKS[profile.userType] ?? PROFILE_FALLBACKS.general;
  if (!hasOllamaKey()) return fallback;

  // Cache profile summaries for 10 minutes
  const cacheKey = `profile|${profile.userType}|${profile.interests.sort().join(",")}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const ollama = getOllama();
    if (!ollama) return fallback;

    const { text } = await generateText({
      model: ollama("qwen3-coder-next:cloud"),
      prompt: `Write a crisp 2-sentence profile for an Economic Times user:
- Type: ${profile.userType}
- Interests: ${profile.interests.join(", ")}
- Goals: ${profile.goals.join(", ")}

Start with "You are..." — make it specific and intelligent. No marketing language.`,
    });

    const summary = text?.trim() ?? fallback;
    setCache(cacheKey, summary, 10 * 60 * 1000);
    return summary;
  } catch (error) {
    console.error("[Orchestrator] Ollama profile error:", error);
    return fallback;
  }
}


