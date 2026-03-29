"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Shield, Zap, TrendingUp } from "lucide-react";

interface PortfolioDonutProps {
  riskLevel?: string;
  interests?: string[];
}

const COLORS = [
  "oklch(0.65_0.15_150)", // Emerald (Equities)
  "oklch(0.55_0.15_260)", // Indigo (Fixed Income)
  "oklch(0.75_0.15_80)",  // Amber (Alternatives)
  "oklch(0.85_0.05_200)", // Cyan/Sky (Cash)
];

const ICONS = {
  "Aggressive": <Zap className="text-orange-400" size={16} />,
  "Moderate": <Target className="text-blue-400" size={16} />,
  "Conservative": <Shield className="text-emerald-400" size={16} />,
};

export function PortfolioDonut({ riskLevel = "Moderate", interests = [] }: PortfolioDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = useMemo(() => {
    let allocation = [
      { name: "Equities", value: 50, desc: "High Growth" },
      { name: "Fixed Income", value: 35, desc: "Stable Returns" },
      { name: "Alternatives", value: 10, desc: "Hedge/Diversified" },
      { name: "Cash", value: 5, desc: "Liquidity" },
    ];

    if (riskLevel === "Aggressive") {
      allocation = [
        { name: "Equities", value: 75, desc: "Aggressive Growth" },
        { name: "Fixed Income", value: 10, desc: "Minimum Stability" },
        { name: "Alternatives", value: 10, desc: "High Risk/Reward" },
        { name: "Cash", value: 5, desc: "Ready to Invest" },
      ];
    } else if (riskLevel === "Conservative") {
      allocation = [
        { name: "Equities", value: 20, desc: "Defensive Growth" },
        { name: "Fixed Income", value: 65, desc: "Capital Protection" },
        { name: "Alternatives", value: 5, desc: "Low Volatility" },
        { name: "Cash", value: 10, desc: "Safe Haven" },
      ];
    }
    return allocation;
  }, [riskLevel]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="relative flex min-h-[380px] w-full flex-col p-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl">
      {/* Decorative glow behind the chart */}
      <div className="absolute left-1/2 top-[40%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px]" />
      
      <div className="relative h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={8}
              dataKey="value"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.5))" }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-300"
                  style={{
                    opacity: activeIndex === null || activeIndex === index ? 1 : 0.4,
                    filter: activeIndex === index ? "brightness(1.2) drop-shadow(0 0 12px currentColor)" : "none",
                    cursor: "pointer"
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-white/10 bg-[oklch(0.1_0_0)] p-3 shadow-2xl backdrop-blur-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">{item.name}</span>
                      </div>
                      <div className="mt-1 text-lg font-black text-white">{item.value}%</div>
                      <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Central Glass Node */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-inner backdrop-blur-2xl">
          <div className="flex flex-col items-center gap-1">
            {ICONS[riskLevel as keyof typeof ICONS] || <Target className="text-blue-400" size={16} />}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Profile</span>
            <span className="text-xs font-black text-white uppercase tracking-tighter">{riskLevel}</span>
          </div>
        </div>
      </div>

      {/* Premium Legend Grid */}
      <div className="mt-auto grid grid-cols-2 gap-3">
        {data.map((item, i) => (
          <motion.div 
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`group relative flex items-center justify-between rounded-xl border p-3 transition-all ${
              activeIndex === i ? 'border-white/20 bg-white/5' : 'border-white/5 bg-transparent'
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="flex items-center gap-3">
              <div 
                className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]" 
                style={{ color: COLORS[i % COLORS.length], backgroundColor: 'currentColor' }} 
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.name}</span>
                <span className="text-[10px] text-muted-foreground/50">{item.desc}</span>
              </div>
            </div>
            <div className="text-sm font-black text-white tracking-tighter">{item.value}%</div>
            
            {/* Shimmer effect on hover */}
            {activeIndex === i && (
              <motion.div 
                layoutId="shimmer"
                className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-orange-500/10 py-2 px-3">
        <TrendingUp size={12} className="text-orange-400" />
        <span className="text-[10px] font-bold text-orange-400/80 tracking-tight">AI Optimised for your {interests[0] || "Growth"} goals</span>
      </div>
    </div>
  );
}
