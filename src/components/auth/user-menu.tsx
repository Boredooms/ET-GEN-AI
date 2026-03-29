"use client";

import { useSession } from "@/lib/auth-client";
import { SignOutButton } from "./sign-out-button";
import { User, Settings, CreditCard, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-[oklch(0.2_0_0)]" />
    );
  }

  if (!session?.user) {
    return null;
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session.user.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[oklch(0.12_0_0)]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.2_0_0)] text-[10px] font-bold text-muted-foreground">
          {initials}
        </div>
        <div className="flex flex-col overflow-hidden text-left">
          <span className="truncate text-xs font-semibold text-foreground">
            {session.user.name || "User"}
          </span>
          <span className="truncate text-[10px] text-muted-foreground">
            {session.user.email}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 mb-2 w-56 rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.09_0_0)] shadow-xl"
          >
            <div className="border-b border-[oklch(1_0_0_/_6%)] p-3">
              <p className="text-xs font-semibold text-foreground">
                {session.user.name || "User"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {session.user.email}
              </p>
            </div>

            <div className="p-2">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-[oklch(0.12_0_0)] hover:text-foreground"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-[oklch(0.12_0_0)] hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Link
                href="/applications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-[oklch(0.12_0_0)] hover:text-foreground"
              >
                <CreditCard className="h-4 w-4" />
                My Applications
              </Link>
              <Link
                href="/help"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-[oklch(0.12_0_0)] hover:text-foreground"
              >
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </Link>
            </div>

            <div className="border-t border-[oklch(1_0_0_/_6%)] p-2">
              <SignOutButton className="w-full justify-start text-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
