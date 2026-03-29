"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { useFinancialProfile } from "@/hooks/use-financial-profile";
import { ArrowRight, Zap, Loader2, TrendingUp, Wallet, Target, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HealthScoreGauge } from "@/components/ui/health-score-gauge";
import { GapCard } from "@/components/ui/gap-card";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSession } from "@/lib/auth-client";
import { InvestorDashboard } from "@/components/dashboard/investor-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { FounderDashboard } from "@/components/dashboard/founder-dashboard";
import { ProfessionalDashboard } from "@/components/dashboard/professional-dashboard";
import ProviderConnectionCard from "@/components/dashboard/ProviderConnectionCard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { profile, convexUserId, isLoading: profileLoading } = useUserProfile();
  const { profile: financialProfile, isLoading: financialLoading } = useFinancialProfile(
    convexUserId as any,
    typeof window !== "undefined" ? localStorage.getItem("deviceId") || undefined : undefined
  );
  const router = useRouter();

  const recommendations = useQuery(
    api.recommendations.getProductRecommendations,
    convexUserId 
      ? { userId: convexUserId as any, limit: 3 }
      : typeof window !== "undefined" && localStorage.getItem("deviceId")
      ? { deviceId: localStorage.getItem("deviceId")!, limit: 3 }
      : "skip"
  );

  useEffect(() => {
    if (!profileLoading && !profile) {
      // router.push(ROUTES.ONBOARDING);
    }
  }, [profile, profileLoading, router]);

  const isLoading = profileLoading || financialLoading;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const userTypeLabel = profile?.userType 
    ? profile.userType.charAt(0).toUpperCase() + profile.userType.slice(1) 
    : "Investor";

  const userName = session?.user?.name || userTypeLabel;

  const hasFinancialProfile = !!financialProfile;
  const healthScore = financialProfile?.healthScore || 0;
  const gaps = financialProfile?.gaps || [];
  const completeness = financialProfile?.completeness || 0;

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-10">
      {/* Welcome Section */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-editorial text-3xl text-foreground">
            Good Morning, {userName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasFinancialProfile
              ? `Your financial health score is ${healthScore}/100. ${
                  healthScore >= 70 ? "Excellent progress!" : healthScore >= 50 ? "You're on track!" : "Let's improve together."
                }`
              : "Complete your financial profile to get personalized recommendations."
            }
          </p>
        </div>
        <Link
          href={ROUTES.CONCIERGE}
          className="group inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          <Zap className="h-4 w-4 fill-background" />
          Ask Concierge
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Provider Connection Section - Always show if user is logged in */}
      {convexUserId && (
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Connect Your Accounts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ProviderConnectionCard
              providerId="zerodha"
              providerName="Zerodha"
              description="Connect your Zerodha account to sync portfolio data"
              userId={convexUserId as string}
            />
            <ProviderConnectionCard
              providerId="upstox"
              providerName="Upstox"
              description="Real-time portfolio tracking and analysis"
              userId={convexUserId as string}
              comingSoon
            />
          </div>
        </div>
      )}

      {!hasFinancialProfile ? (
        /* Onboarding CTA */
        <div className="mb-10 rounded-2xl border border-[oklch(1_0_0_/_10%)] bg-gradient-to-br from-[oklch(0.15_0_0)] to-[oklch(0.09_0_0)] p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
          <h2 className="mb-2 text-2xl font-bold text-foreground">Complete Your Financial Profile</h2>
          <p className="mb-6 text-muted-foreground">
            Get personalized product recommendations, financial health insights, and AI-powered advice.
          </p>
          <Link
            href="/financial-setup"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-semibold text-background transition-opacity hover:opacity-90"
          >
            Start Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content Area (2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Financial Health Score */}
            <section className="rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">Financial Health Score</h2>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="flex-shrink-0">
                  <HealthScoreGauge score={healthScore} size="lg" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Savings Rate</span>
                      <span className="font-medium text-foreground">
                        {financialProfile.savingsRate !== undefined && financialProfile.savingsRate >= 0
                          ? `${Math.min(100, (financialProfile.savingsRate * 100)).toFixed(1)}%`
                          : "0.0%"}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[oklch(0.15_0_0)]">
                      <div 
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, (financialProfile.savingsRate || 0) * 100))}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Debt Ratio</span>
                      <span className="font-medium text-foreground">
                        {financialProfile.totalDebt && financialProfile.monthlyIncome
                          ? `${Math.min(100, ((financialProfile.totalDebt / (financialProfile.monthlyIncome * 12)) * 100)).toFixed(1)}%`
                          : "0.0%"}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[oklch(0.15_0_0)]">
                      <div 
                        className="h-full rounded-full bg-red-500 transition-all"
                        style={{ 
                          width: `${Math.min(100, Math.max(0, ((financialProfile.totalDebt || 0) / ((financialProfile.monthlyIncome || 1) * 12)) * 100))}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Profile Completeness</span>
                      <span className="font-medium text-foreground">{Math.min(100, completeness)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[oklch(0.15_0_0)]">
                      <div 
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${Math.min(100, completeness)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Role-Based Dashboard Content */}
            {profile?.userType === "investor" && (
              <InvestorDashboard 
                financialProfile={financialProfile} 
                recommendations={recommendations || []} 
              />
            )}

            {profile?.userType === "student" && (
              <StudentDashboard 
                financialProfile={financialProfile} 
                recommendations={recommendations || []} 
              />
            )}

            {profile?.userType === "founder" && (
              <FounderDashboard 
                financialProfile={financialProfile} 
                recommendations={recommendations || []} 
              />
            )}

            {profile?.userType === "professional" && (
              <ProfessionalDashboard 
                financialProfile={financialProfile} 
                recommendations={recommendations || []} 
              />
            )}

            {/* Default dashboard for general or undefined userType */}
            {(!profile?.userType || profile.userType === "general") && (
              <>
                {/* Financial Gaps */}
                {gaps.length > 0 && (
                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-foreground">Areas to Improve</h2>
                      <span className="text-xs text-muted-foreground">{gaps.length} gaps identified</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {gaps.slice(0, 4).map((gap) => (
                        <GapCard 
                          key={gap} 
                          gap={gap}
                          onAction={() => router.push("/marketplace")}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Recommended Products */}
                {recommendations && recommendations.length > 0 && (
                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-foreground">Recommended for You</h2>
                      <Link 
                        href="/marketplace"
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid gap-4">
                      {recommendations.slice(0, 2).map((rec: any) => (
                        <div 
                          key={rec._id}
                          className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5 transition-all hover:border-[oklch(1_0_0_/_15%)]"
                        >
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{rec.product?.name}</h3>
                              <p className="text-xs text-muted-foreground">{rec.product?.partnerName}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                              <span className="text-sm font-bold text-green-500">{rec.matchScore}</span>
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
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <section className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
              <h3 className="mb-4 font-semibold text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/marketplace"
                  className="flex items-center justify-between rounded-lg border border-[oklch(1_0_0_/_8%)] p-3 transition-colors hover:bg-[oklch(0.12_0_0)]"
                >
                  <span className="text-sm text-foreground">Browse Products</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/applications"
                  className="flex items-center justify-between rounded-lg border border-[oklch(1_0_0_/_8%)] p-3 transition-colors hover:bg-[oklch(0.12_0_0)]"
                >
                  <span className="text-sm text-foreground">My Applications</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/concierge"
                  className="flex items-center justify-between rounded-lg border border-[oklch(1_0_0_/_8%)] p-3 transition-colors hover:bg-[oklch(0.12_0_0)]"
                >
                  <span className="text-sm text-foreground">Get Financial Advice</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </section>

            {/* Investment Breakdown */}
            {financialProfile.hasInvestments && (
              <section className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
                <h3 className="mb-4 font-semibold text-foreground">Portfolio Mix</h3>
                <div className="space-y-3">
                  {financialProfile.investmentTypes?.map((type: string, idx: number) => (
                    <div key={idx}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{type.replace(/_/g, " ")}</span>
                        <span className="font-medium text-foreground">
                          {Math.round(100 / (financialProfile.investmentTypes?.length || 1))}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[oklch(0.15_0_0)]">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${100 / (financialProfile.investmentTypes?.length || 1)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Financial Goals */}
            {financialProfile.goals && financialProfile.goals.length > 0 && (
              <section className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5">
                <h3 className="mb-4 font-semibold text-foreground">Your Goals</h3>
                <div className="space-y-4">
                  {financialProfile.goals.slice(0, 3).map((goal: any, idx: number) => (
                    <div key={idx}>
                      <div className="mb-2 flex items-start justify-between">
                        <span className="text-sm text-foreground capitalize">{goal.type.replace(/_/g, " ")}</span>
                        <span className="text-xs text-muted-foreground">{goal.priority}</span>
                      </div>
                      <div className="mb-1 h-2 overflow-hidden rounded-full bg-[oklch(0.15_0_0)]">
                        <div 
                          className="h-full rounded-full bg-green-500 transition-all"
                          style={{ width: `${goal.currentProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>₹{(goal.targetAmount / 100000).toFixed(1)}L target</span>
                        <span>{goal.timeHorizon}y</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
