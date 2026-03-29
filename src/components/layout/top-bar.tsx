"use client";

import { Search, Bell, Menu } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[oklch(1_0_0_/_6%)] bg-[oklch(0.09_0_0)] px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search intelligence..."
            className="h-9 w-full rounded-md border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] pl-10 pr-4 text-xs transition-colors focus:border-[oklch(1_0_0_/_20%)] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-md border border-[oklch(1_0_0_/_10%)] p-2 text-muted-foreground transition-colors hover:bg-[oklch(0.12_0_0)] hover:text-foreground">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-foreground" />
        </button>
        
        <div className="h-8 w-[1px] bg-[oklch(1_0_0_/_6%)]" />
        
        <div className="flex items-center gap-3">
           <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-foreground/10 border border-foreground/20 text-[10px] font-black text-foreground">
            AI
          </div>
          <span className="text-xs font-semibold text-foreground">Free Tier</span>
        </div>
      </div>
    </header>
  );
}
