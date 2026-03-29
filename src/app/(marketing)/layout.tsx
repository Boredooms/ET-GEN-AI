import { MARKETING_NAV } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Marketing Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[oklch(1_0_0_/_6%)]" style={{ background: "oklch(0.07 0 0 / 85%)", backdropFilter: "blur(12px)" }}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground">
              <span className="text-xs font-black text-background">G</span>
            </div>
            <span className="font-semibold tracking-tight text-foreground">GENZET AI</span>
            <span className="hidden rounded-sm border border-[oklch(1_0_0_/_15%)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:block">
              Beta
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {MARKETING_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href={ROUTES.ONBOARDING}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content with nav offset */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[oklch(1_0_0_/_6%)] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground">
                  <span className="text-[10px] font-black text-background">G</span>
                </div>
                <span className="text-sm font-semibold">GENZET AI</span>
              </div>
              <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
                A personal business concierge developed for the **Economic Times (ET) Gen AI Hackathon**. 
                Transforming how readers engage with business intelligence.
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href={ROUTES.PRIVACY} className="hover:text-foreground transition-colors">Privacy</Link>
              <span>© 2026 GENZET AI</span>
              <span className="et-badge">ET Gen AI Hackathon &apos;26 Submission</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
