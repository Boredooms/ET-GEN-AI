// User profile types
export type UserType = "student" | "investor" | "founder" | "professional" | "general";

export type Interest =
  | "markets"
  | "startups"
  | "macro"
  | "personal-finance"
  | "tech"
  | "policy"
  | "banking"
  | "real-estate"
  | "commodities"
  | "global-markets";

export type Goal =
  | "learn"
  | "invest"
  | "track-markets"
  | "save-tax"
  | "explore-et"
  | "stay-informed";

export type Language = "english" | "hindi" | "both";

export type RiskLevel = "low" | "medium" | "high";

export interface UserProfile {
  id: string;
  userId?: string;
  deviceId?: string;
  name?: string;
  email?: string;
  userType: UserType;
  interests: Interest[];
  goals: Goal[];
  language: Language;
  riskLevel: RiskLevel;
  consentGiven: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingState {
  step: number;
  totalSteps: number;
  userType?: UserType;
  interests: Interest[];
  goals: Goal[];
  language: Language;
  riskLevel: RiskLevel;
  name?: string;
}
