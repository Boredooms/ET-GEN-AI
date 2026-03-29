"use client";

import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface PredictionSparklineProps {
  trend?: "up" | "down" | "neutral";
  data?: { v: number }[];
}

const UP_DATA = [{ v: 10 }, { v: 12 }, { v: 11 }, { v: 15 }, { v: 18 }, { v: 17 }, { v: 22 }, { v: 25 }];
const DOWN_DATA = [{ v: 25 }, { v: 22 }, { v: 24 }, { v: 18 }, { v: 15 }, { v: 16 }, { v: 12 }, { v: 10 }];
const NEUTRAL_DATA = [{ v: 15 }, { v: 16 }, { v: 14 }, { v: 17 }, { v: 15 }, { v: 16 }, { v: 14 }, { v: 15 }];

export function PredictionSparkline({ trend = "up", data }: PredictionSparklineProps) {
  const chartData = useMemo(() => {
    if (data) return data;
    if (trend === "up") return UP_DATA;
    if (trend === "down") return DOWN_DATA;
    return NEUTRAL_DATA;
  }, [trend, data]);

  const color = trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : "#6b7280";

  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${trend}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fillOpacity={1}
            fill={`url(#gradient-${trend})`}
            animationDuration={2000}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
