// Agent types

export type AgentName =
  | "supervisor"
  | "profile"
  | "news"
  | "market"
  | "recommendation"
  | "action"
  | "safety";

export type AgentStatus = "idle" | "running" | "complete" | "error";

export type IntentCategory =
  | "onboarding"
  | "news-query"
  | "market-query"
  | "money-help"
  | "et-product-discovery"
  | "story-deepdive"
  | "general";

export interface AgentStep {
  id: string;
  agent: AgentName;
  input: string;
  output: string;
  toolsUsed: string[];
  confidence: number;
  status: AgentStatus;
  durationMs: number;
  createdAt: string;
}

export interface AgentTrace {
  id: string;
  sessionId: string;
  userId?: string;
  userQuery: string;
  intent: IntentCategory;
  steps: AgentStep[];
  finalResponse: string;
  totalDurationMs: number;
  createdAt: string;
}

export interface AgentState {
  sessionId: string;
  userId?: string;
  userQuery: string;
  intent?: IntentCategory;
  userProfile?: Record<string, unknown>;
  retrievedContent: unknown[];
  currentAgent?: AgentName;
  steps: AgentStep[];
  finalResponse?: string;
  error?: string;
}
