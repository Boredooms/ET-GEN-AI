"use client";

import { ArrowRight, BookOpen, DollarSign, Target, TrendingDown } from "lucide-react";
import Link from "next/link";

interface StudentDashboardProps {
  financialProfile: any;
  recommendations: any[];
}

export function StudentDashboard({ financialProfile, recommendations }: StudentDashboardProps) {
  const monthlyIncome = financialProfile?.monthlyIncome || 0;
  const monthlyExpenses = financialProfile?.monthlyExpenses || 0;
  const savings = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate = monthlyIncome > 0 ? Math.max(0, ((savings / monthlyIncome) * 100)) : 0;
  const expenseRatio = monthlyIncome > 0 ? Math.min(100, ((monthlyExpenses / monthlyIncome) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Student-Specific Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Monthly Budget</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₹{(monthlyIncome / 1000).toFixed(0)}K
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Income this month
          </div>
        </div>

        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm">Expenses</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₹{(monthlyExpenses / 1000).toFixed(0)}K
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {expenseRatio.toFixed(0)}% of income
          </div>
        </div>

        <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4" />
            <span className="text-sm">Savings Rate</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="mt-1 text-xs text-green-500">
            ₹{(savings / 1000).toFixed(1)}K saved
          </div>
        </div>
      </div>

      {/* Budgeting Tips */}
      <section className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Smart Budgeting Tips</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0_0)] p-4">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <div>
              <h4 className="font-semibold text-foreground">50-30-20 Rule</h4>
              <p className="text-sm text-muted-foreground">
                Allocate 50% to needs, 30% to wants, and 20% to savings for balanced finances.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.12_0_0)] p-4">
            <Target className="h-5 w-5 text-green-500" />
            <div>
              <h4 className="font-semibold text-foreground">Emergency Fund First</h4>
              <p className="text-sm text-muted-foreground">
                Build an emergency fund covering 3-6 months of expenses before investing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student-Friendly Products */}
      <section className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Student-Friendly Products</h3>
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
