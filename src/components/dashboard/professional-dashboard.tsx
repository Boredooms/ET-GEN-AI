"use client";

import { ArrowRight, Shield, PiggyBank, TrendingUp, Briefcase } from "lucide-react";
import Link from "next/link";

interface ProfessionalDashboardProps {
  financialProfile: any;
  recommendations: any[];
}

export function ProfessionalDashboard({ financialProfile, recommendations }: ProfessionalDashboardProps) {
  const monthlyIncome = financialProfile?.monthlyIncome || 0;
  const portfolioValue = financialProfile?.portfolioValue || 0;
  const totalAssets = financialProfile?.totalAssets || 0;
  const hasInsurance = financialProfile?.hasHealthInsurance && financialProfile?.hasLifeInsurance;

  return (
    <div className="space-y-6">
      {/* Professional-Specific Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span className="text-sm">Annual Income</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₹{((monthlyIncome * 12) / 100000).toFixed(1)}L
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            ₹{(monthlyIncome / 1000).toFixed(0)}K per month
          </div>
        </div>

        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Total Wealth</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₹{(totalAssets / 100000).toFixed(1)}L
          </div>
          <div className="mt-1 text-xs text-green-500">
            +8.2% YoY growth
          </div>
        </div>

        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Protection</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {hasInsurance ? "Protected" : "At Risk"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {hasInsurance ? "Comprehensive coverage" : "Needs insurance"}
          </div>
        </div>
      </div>

      {/* Wealth Management */}
      <section className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Wealth Management</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0_0)] p-4">
            <PiggyBank className="h-5 w-5 text-yellow-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Retirement Planning</h4>
              <p className="text-sm text-muted-foreground">
                Build a corpus of ₹{((monthlyIncome * 12 * 25) / 100000).toFixed(0)}L for comfortable retirement. Start investing ₹{(monthlyIncome * 0.15 / 1000).toFixed(0)}K/month.
              </p>
              <Link href="/concierge" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline">
                Create Plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0_0)] p-4">
            <Shield className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Tax Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Save up to ₹{((monthlyIncome * 12 * 0.3) / 1000).toFixed(0)}K annually with smart tax-saving investments under 80C.
              </p>
              <Link href="/marketplace?category=investments" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline">
                View Options
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Products */}
      <section className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Premium Financial Products</h3>
          <Link href="/marketplace" className="text-xs text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="grid gap-4">
          {recommendations?.slice(0, 2).map((rec: any) => (
            <div key={rec._id} className="rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0_0)] p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{rec.product?.name}</h4>
                  <p className="text-xs text-muted-foreground">{rec.product?.partnerName}</p>
                </div>
                <div className="rounded-full bg-green-500/10 px-2 py-1">
                  <span className="text-xs font-bold text-green-500">{rec.matchScore}</span>
                </div>
              </div>
              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                {rec.product?.description}
              </p>
              {rec.reasons && rec.reasons.length > 0 && (
                <div className="mb-3 space-y-1">
                  {rec.reasons.slice(0, 2).map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-green-500" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              )}
              <Link
                href={`/marketplace/${rec.product?._id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
