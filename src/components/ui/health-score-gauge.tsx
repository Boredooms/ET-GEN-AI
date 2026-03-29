"use client";

interface HealthScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function HealthScoreGauge({ score, size = "md" }: HealthScoreGaugeProps) {
  const radius = size === "sm" ? 40 : size === "md" ? 60 : 80;
  const strokeWidth = size === "sm" ? 6 : size === "md" ? 8 : 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Color based on score
  let color = "oklch(0.5 0.15 142)"; // Red
  if (score >= 70) color = "oklch(0.7 0.15 142)"; // Green
  else if (score >= 50) color = "oklch(0.75 0.15 85)"; // Yellow

  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.15 0 0)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div 
          className={`font-bold text-foreground ${
            size === "sm" ? "text-lg" : size === "md" ? "text-3xl" : "text-5xl"
          }`}
        >
          {score}
        </div>
        <div 
          className={`text-muted-foreground ${
            size === "sm" ? "text-[10px]" : size === "md" ? "text-xs" : "text-sm"
          }`}
        >
          /100
        </div>
      </div>
    </div>
  );
}
