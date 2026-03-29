"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { motion } from "framer-motion";
import { LineChart, BarChart3, PieChart, TrendingUp, Info, Loader2, Bookmark, ArrowRight, Zap, Target } from "lucide-react";
import { MarketChart } from "@/components/charts/market-chart";
import { PortfolioDonut } from "@/components/charts/portfolio-donut";
import { PredictionSparkline } from "@/components/charts/prediction-sparkline";
import { SectorRelevance } from "@/components/charts/sector-relevance";

const SIGNALS = [
  { id: "s1", title: "Institutional FII Inflow", value: "+₹2,400Cr", trend: "up", desc: "Highest single-day inflow in 3 weeks" },
  { id: "s2", title: "Nifty PCR Ratio", value: "1.12", trend: "neutral", desc: "Suggests a slightly bullish bias for next expiry" },
  { id: "s3", title: "Global Market Bias", value: "BULLISH", trend: "up", desc: "S&P 500 hitting all-time high momentum" },
];

const SAVED_BRIEFINGS = [
  { id: "b1", title: "Budget 2026: Direct Tax Implications", date: "Mar 20, 2026", type: "Policy" },
  { id: "b2", title: "AI in Pharma: The Next Decade", date: "Mar 15, 2026", type: "Tech" },
];

export default function InsightsPage() {
  const { profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-10 pb-20">
      <header className="mb-10">
        <h1 className="font-editorial text-4xl text-foreground tracking-tight">Market Intelligence</h1>
        <p className="mt-1 text-sm text-muted-foreground font-medium">
          Real-time institutional-grade signals and performance data for the Indian market.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Section 1: Top Signals & Live Charts */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                <TrendingUp size={14} />
                Live Market Momentum
              </h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <MarketChart title="Nifty 50 Index" symbol="^NSEI" color="#10b981" />
              <MarketChart title="BSE Sensex" symbol="^BSESN" color="#3b82f6" />
            </div>

            <div className="grid gap-4 sm:grid-cols-1 mb-8">
              {SIGNALS.map((signal, i) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-white/5 bg-[oklch(0.09_0_0)] p-5 flex items-center justify-between group hover:border-white/15 transition-all"
                >
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground mb-1 font-bold tracking-widest uppercase flex items-center gap-1.5">
                       {signal.title} 
                       {signal.trend === 'up' && <span className="text-green-500 bg-green-500/10 px-1 py-0.5 rounded text-[8px]">MOMENTUM</span>}
                    </div>
                    <div className="text-xl font-bold text-white tracking-tighter">{signal.value}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                      <Zap size={10} className="text-amber-500/60" />
                      {signal.desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <PredictionSparkline trend={signal.trend as any} />
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${signal.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-muted-foreground'}`}>
                      <TrendingUp size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section 2: Sector Relevance & Investing Areas */}
          <section>
            <div className="mb-6 flex items-center justify-between border-t border-white/5 pt-12">
              <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                <Target size={14} />
                Sector Investment Relevance (India)
              </h2>
              <div className="text-[10px] bg-white/5 px-2 py-1 rounded text-muted-foreground">
                Updated Real-time
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Automated analysis of NSE sectoral indices to identify areas of strength ("Invest") vs areas of weakness ("Avoid").
            </p>

            <SectorRelevance />
          </section>

          {/* Section 3: Allocation Strategy */}
          <section className="pt-12 border-t border-white/5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                <PieChart size={14} />
                Strategic Portfolio Allocation
              </h2>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[oklch(0.12_0_0)] p-10">
              <PortfolioDonut 
                riskLevel={profile?.riskLevel} 
                interests={profile?.interests as any[]}
              />
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  Optimized for <span className="text-white font-bold">{profile?.riskLevel || "Moderate"}</span> profiles with specific exposure to <span className="text-white font-bold">{profile?.interests?.join(", ") || "General Markets"}</span>.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar (1 col) */}
        <div className="space-y-6">
          <section className="rounded-xl border border-white/5 bg-[oklch(0.09_0_0)] p-5">
            <h3 className="mb-6 font-bold text-xs tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <Bookmark size={14} />
              Saved Intelligence
            </h3>
            <div className="space-y-4">
              {SAVED_BRIEFINGS.map((brief) => (
                <div key={brief.id} className="group cursor-pointer rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10 hover:translate-x-1">
                  <div className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 mb-1">{brief.type}</div>
                  <div className="text-sm font-bold text-white group-hover:underline">{brief.title}</div>
                  <div className="mt-1.5 text-[11px] text-muted-foreground/60">{brief.date}</div>
                </div>
              ))}
            </div>
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-3 text-xs font-bold text-muted-foreground transition-all hover:bg-white/5 hover:text-white">
              Archive <ArrowRight size={12} />
            </button>
          </section>

          <div className="rounded-xl bg-gradient-to-br from-[oklch(0.2_0_0)] to-[oklch(0.07_0_0)] p-6 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="mb-2 text-sm font-bold text-white tracking-tight">ET Prime Markets</h4>
              <p className="mb-6 text-xs leading-relaxed text-muted-foreground font-medium">
                Unlock institutional-grade equity signals, deep pre-market briefings, and dark-pool tracking.
              </p>
              <button className="w-full rounded-md bg-white py-2.5 text-xs font-black text-black transition-transform hover:scale-[0.98]">
                UPGRADE NOW
              </button>
            </div>
            {/* Glossy overlay */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
          </div>

          <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
             <div className="flex items-start gap-3">
               <Info size={16} className="text-amber-500 mt-1 shrink-0" />
               <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                 Market data is provided by Yahoo Finance and is up to 15 minutes delayed for BSE/NSE. Past performance does not guarantee future results.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
