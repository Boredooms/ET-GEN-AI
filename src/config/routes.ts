// Route constants
export const ROUTES = {
  // Public
  HOME: "/",
  ABOUT: "/about",
  DEMO: "/demo",
  PRICING: "/pricing",
  PRIVACY: "/privacy",

  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",

  // App
  ONBOARDING: "/financial-setup",
  DASHBOARD: "/dashboard",
  CONCIERGE: "/concierge",
  FEED: "/feed",
  INSIGHTS: "/insights",
  PROFILE: "/profile",
  SETTINGS: "/settings",

  // Admin
  ADMIN: "/admin",
  ADMIN_CONTENT: "/admin/content",
  ADMIN_TRACES: "/admin/traces",
  ADMIN_PERSONAS: "/admin/personas",

  // API
  API: {
    HEALTH: "/api/health",
    CHAT: "/api/chat",
    ONBOARD: "/api/onboard",
    RECOMMEND: "/api/recommend",
    PROFILE: "/api/profile",
    FEEDBACK: "/api/feedback",
    INSIGHTS: "/api/insights",
    ACTIONS: "/api/actions",
  },
} as const;
