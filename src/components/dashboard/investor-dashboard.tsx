"use client";

import { ArrowRight, TrendingUp, DollarSign, Target, PiggyBank } from "lucide-react";
import Link from "next/link";

interface InvestorDashboardProps {
  financialProfile: any;
  recommendations: any[];
}

export function InvestorDashboard({ financialProfile, recommendations }: InvestorDashboardProps) {
  const portfolioValue = financialProfile?.portfolioValue || 0;
  const monthlyIncome = financialProfile?.monthlyIncome || 0;
  const investmentRate = portfolioValue && monthlyIncome 
    ? ((portfolioValue / (monthlyIncome * 12)) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Investor-Specific Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Portfolio Value</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₹{(portfolioValue / 100000).toFixed(1)}L
          </div>
          <div className="mt-1 text-xs text-green-500">
            +12.5% this month
          </div>
        </div>

        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Investment Rate</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {investmentRate}%
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            of annual income
          </div>
        </div>

        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4" />
            <span className="text-sm">Active Investments</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {financialProfile?.investmentTypes?.length || 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            diversified portfolio
          </div>
        </div>
      </div>

      {/* Investment Opportunities */}
      <section className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Investment Opportunities</h3>
          <Link href="/marketplace?category=investments" className="text-xs text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendations
            ?.filter((rec: any) => rec.product?.category === "investments")
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

      {/* Market Watchlist */}
      <section className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Market Insights</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-[oklch(1_0_0_/_8%)] p-3">
            <div>
              <span className="text-sm font-medium text-foreground">Nifty 50</span>
              <p className="text-xs text-muted-foreground">Index</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-foreground">21,850</div>
              <div className="text-xs text-green-500">+0.8%</div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-[oklch(1_0_0_/_8%)] p-3">
            <div>
              <span className="text-sm font-medium text-foreground">Sensex</span>
              <p className="text-xs text-muted-foreground">Index</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-foreground">72,500</div>
              <div className="text-xs text-green-500">+0.6%</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
