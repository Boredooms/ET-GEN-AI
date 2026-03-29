// Navigation configuration

import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
  badge?: string;
}

export const APP_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", description: "Your intelligence hub" },
  { label: "Concierge", href: "/concierge", icon: "MessageSquare", description: "AI chat assistant" },
  { label: "Feed", href: "/feed", icon: "Rss", description: "Personalized news" },
  { label: "Insights", href: "/insights", icon: "Sparkles", description: "Saved discoveries" },
];

export const APP_NAV_SECONDARY: NavItem[] = [
  { label: "Profile", href: "/profile", icon: "User" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

export const MARKETING_NAV = [
  { label: "About", href: "/about" },
  { label: "Demo", href: "/demo" },
  { label: "Pricing", href: "/pricing" },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin", icon: "BarChart3" },
  { label: "Content", href: "/admin/content", icon: "FileText" },
  { label: "Traces", href: "/admin/traces", icon: "GitBranch" },
  { label: "Personas", href: "/admin/personas", icon: "Users" },
];
