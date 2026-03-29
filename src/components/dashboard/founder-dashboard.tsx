"use client";

import { ArrowRight, Rocket, DollarSign, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

interface FounderDashboardProps {
  financialProfile: any;
  recommendations: any[];
}

export function FounderDashboard({ financialProfile, recommendations }: FounderDashboardProps) {
  const totalAssets = financialProfile?.totalAssets || 0;
  const totalLiabilities = financialProfile?.totalLiabilities || 0;
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6">
      {/* Founder-Specific Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Business Assets</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₹{(totalAssets / 100000).toFixed(1)}L
          </div>
          <div className="mt-1 text-xs text-green-500">
            +15% this quarter
          </div>
        </div>

        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Net Worth</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₹{(netWorth / 100000).toFixed(1)}L
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            after liabilities
          </div>
        </div>

        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Cash Flow</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₹{((financialProfile?.monthlyIncome || 0) / 1000).toFixed(0)}K
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            monthly revenue
          </div>
        </div>
      </div>

      {/* Funding Opportunities */}
      <section className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Funding & Growth</h3>
          <Link href="/marketplace?category=loans" className="text-xs text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0_0)] p-4">
            <Rocket className="h-5 w-5 text-purple-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Business Loans</h4>
              <p className="text-sm text-muted-foreground">
                Access capital for expansion with competitive rates starting at 8.5% p.a.
              </p>
              <Link href="/marketplace?category=loans" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline">
                Explore Loans
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0_0)] p-4">
            <Users className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Investor Network</h4>
              <p className="text-sm text-muted-foreground">
                Connect with angel investors and VCs looking for promising startups.
              </p>
              <Link href="/concierge" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline">
                Get Introduced
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Business Financial Products */}
      <section className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recommended for Your Business</h3>
          <Link href="/marketplace" className="text-xs text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="grid gap-4">
          {recommendations
            ?.filter((rec: any) => rec.product?.category === "loans" || rec.product?.category === "credit_cards")
            .slice(0, 2)
            .map((rec: any) => (
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
