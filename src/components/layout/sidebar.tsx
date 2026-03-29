"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Rss, 
  BarChart3, 
  User, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShoppingBag,
  FileText
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserMenu } from "@/components/auth/user-menu";
import { useSession } from "@/lib/auth-client";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Concierge", href: ROUTES.CONCIERGE, icon: MessageSquare },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "My Applications", href: "/applications", icon: FileText },
  { label: "Feed", href: ROUTES.FEED, icon: Rss },
  { label: "Insights", href: ROUTES.INSIGHTS, icon: BarChart3 },
  { label: "Profile", href: ROUTES.PROFILE, icon: User },
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? "5rem" : "16rem" }}
      className="relative flex h-screen flex-col border-r border-[oklch(1_0_0_/_6%)] bg-[oklch(0.09_0_0)] transition-all duration-300 ease-in-out"
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-foreground">
            <span className="text-sm font-black text-background">G</span>
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-bold tracking-tight text-foreground"
            >
              GENZET AI
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[oklch(0.15_0_0)] text-foreground"
                  : "text-muted-foreground hover:bg-[oklch(0.12_0_0)] hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-3 truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="border-t border-[oklch(1_0_0_/_6%)] p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 flex w-full items-center justify-center rounded-md border border-[oklch(1_0_0_/_10%)] py-2 text-muted-foreground transition-colors hover:bg-[oklch(0.12_0_0)] hover:text-foreground md:flex"
        >
          {collapsed ? <ChevronRight size={16} /> : <div className="flex items-center gap-2 text-xs"><ChevronLeft size={14} /> Collapse</div>}
        </button>
        
        {!collapsed && <UserMenu />}
        
        {collapsed && session?.user && (
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-[oklch(0.2_0_0)] border border-[oklch(1_0_0_/_10%)] flex items-center justify-center text-[10px] font-bold text-muted-foreground">
              {session.user.name
                ? session.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : session.user.email?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
