// App constants
export const APP_NAME = "GENZET AI";
export const APP_TAGLINE = "Economic Times' Personal Business Concierge";
export const APP_DESCRIPTION =
  "GENZET AI understands who you are in one conversation and guides you to the right news, learning, and financial opportunities on Economic Times.";

export const ET_BRAND_NAME = "Economic Times";
export const ET_SHORT = "ET";

export const ONBOARDING_STEPS = 4;
export const MAX_CHAT_HISTORY = 50;
export const DEFAULT_RECOMMENDATIONS = 6;
export const MAX_SOURCES_PER_RESPONSE = 4;

export const USER_TYPES = [
  { id: "student", label: "Student", description: "Learning about business and finance", icon: "GraduationCap" },
  { id: "investor", label: "Investor", description: "Tracking markets and investments", icon: "TrendingUp" },
  { id: "founder", label: "Founder", description: "Running or building a business", icon: "Briefcase" },
  { id: "professional", label: "Professional", description: "Working in finance or business", icon: "Building2" },
  { id: "general", label: "General Reader", description: "Staying informed on business news", icon: "Newspaper" },
] as const;

export const INTEREST_OPTIONS = [
  { id: "markets", label: "Stock Markets" },
  { id: "startups", label: "Startups & VC" },
  { id: "macro", label: "Macro Economy" },
  { id: "personal-finance", label: "Personal Finance" },
  { id: "tech", label: "Technology" },
  { id: "policy", label: "Policy & Regulation" },
  { id: "banking", label: "Banking & Finance" },
  { id: "real-estate", label: "Real Estate" },
  { id: "commodities", label: "Commodities" },
  { id: "global-markets", label: "Global Markets" },
] as const;

export const GOAL_OPTIONS = [
  { id: "learn", label: "Learn & Understand" },
  { id: "invest", label: "Invest Smarter" },
  { id: "track-markets", label: "Track Markets" },
  { id: "save-tax", label: "Save Tax" },
  { id: "explore-et", label: "Explore ET Products" },
  { id: "stay-informed", label: "Stay Informed Daily" },
] as const;

export const DEMO_PERSONAS = [
  {
    id: "retail-investor",
    name: "Arjun, Retail Investor",
    description: "30-year-old tracking Nifty, wants market signals and sector analysis",
    userType: "investor",
    interests: ["markets", "macro"],
    goals: ["invest", "track-markets"],
  },
  {
    id: "startup-founder",
    name: "Priya, Startup Founder",
    description: "Founder tracking funding news, startup ecosystem, and competitor signals",
    userType: "founder",
    interests: ["startups", "tech", "policy"],
    goals: ["stay-informed", "explore-et"],
  },
  {
    id: "mba-student",
    name: "Rahul, MBA Student",
    description: "Student learning about economics, policy, and financial markets",
    userType: "student",
    interests: ["macro", "policy", "banking"],
    goals: ["learn", "stay-informed"],
  },
] as const;
