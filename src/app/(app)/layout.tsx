"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const isConcierge = pathname === "/concierge";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push("/login");
    }
  }, [session, sessionLoading, router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show loading while checking authentication
  if (sessionLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileOpen(false)} 
          />
          <div className="absolute left-0 top-0 bottom-0 z-50 flex shrink-0">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar (includes mobile toggle) */}
        <div className="flex flex-col">
          <div className="flex md:hidden h-14 items-center justify-between border-b border-[oklch(1_0_0_/_6%)] bg-[oklch(0.09_0_0)] px-4">
            {!isConcierge && (
              <button 
                onClick={() => setMobileOpen(true)} 
                className="text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <span className="text-sm font-bold tracking-tight">GENZET AI</span>
            <div className="w-5" />
          </div>
          {!isConcierge && (
            <div className="hidden md:block">
              <TopBar />
            </div>
          )}
        </div>

        <main className={cn(
          "flex-1 relative",
          isConcierge ? "overflow-hidden" : "overflow-y-auto custom-scrollbar"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
