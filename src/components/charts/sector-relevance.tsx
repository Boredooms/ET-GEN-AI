"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const SECTORS = [
  { name: "Nifty IT", symbol: "^CNXIT", desc: "Tech & Services" },
  { name: "Nifty Bank", symbol: "^NSEBANK", desc: "Private Banking" },
  { name: "Nifty PSU Bank", symbol: "^CNXPSUBANK", desc: "State Banks" },
  { name: "Nifty Auto", symbol: "^CNXAUTO", desc: "Automotive" },
  { name: "Nifty FMCG", symbol: "^CNXFMCG", desc: "Consumer Goods" },
  { name: "Nifty Metal", symbol: "^CNXMETAL", desc: "Commodities" },
];

export function SectorRelevance() {
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSectors() {
      try {
        const results = await Promise.all(
          SECTORS.map(async (s) => {
            const res = await fetch(`/api/market?symbol=${s.symbol}`);
            const data = await res.json();
            return { ...s, ...data };
          })
        );
        setSectorData(results);
      } catch (err) {
        console.error("Sector fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSectors();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-white/5 border border-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sectorData.map((sector, i) => {
        const isBullish = sector.changePercent > 0.5;
        const isBearish = sector.changePercent < -0.5;
        const status = isBullish ? "INVEST" : isBearish ? "AVOID" : "NEUTRAL";
        
        return (
          <motion.div
            key={sector.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-xl border border-white/5 bg-[oklch(0.09_0_0)] p-4 transition-all hover:border-white/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{sector.name}</h4>
                <p className="text-[11px] text-muted-foreground/60">{sector.desc}</p>
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black tracking-tighter ${
                status === "INVEST" ? "bg-green-500/10 text-green-400" : 
                status === "AVOID" ? "bg-red-500/10 text-red-400" : "bg-white/5 text-muted-foreground"
              }`}>
                {status}
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-lg font-bold text-white tracking-tighter">
                  {sector.price?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <div className={`mt-0.5 flex items-center gap-1 text-[10px] font-bold ${sector.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {sector.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(sector.changePercent).toFixed(2)}%
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                 {status === "INVEST" ? (
                   <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-medium">
                     <CheckCircle2 size={12} /> High Momentum
                   </div>
                 ) : status === "AVOID" ? (
                   <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-medium">
                     <AlertCircle size={12} /> Selling Pressure
                   </div>
                 ) : (
                   <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                     <Minus size={12} /> Consolidating
                   </div>
                 )}
              </div>
            </div>

            {/* Subtle background glow for Bullish sectors */}
            {status === "INVEST" && (
              <div className="absolute -right-4 -top-4 h-12 w-12 bg-green-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
