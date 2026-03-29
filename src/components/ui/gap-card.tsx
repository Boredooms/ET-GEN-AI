"use client";

import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

interface GapCardProps {
  gap: string;
  onAction?: () => void;
}

const GAP_INFO: Record<string, { 
  title: string; 
  description: string; 
  severity: "high" | "medium" | "low";
  actionLabel: string;
}> = {
  noInsurance: {
    title: "No Insurance Coverage",
    description: "You don't have any insurance. Protect yourself and your family from unexpected events.",
    severity: "high",
    actionLabel: "Get Insured",
  },
  underInsured: {
    title: "Insufficient Insurance",
    description: "Your current insurance coverage may not be adequate for your needs.",
    severity: "medium",
    actionLabel: "Increase Coverage",
  },
  highDebtRatio: {
    title: "High Debt Burden",
    description: "Your debt-to-income ratio is high. Consider debt consolidation or repayment strategies.",
    severity: "high",
    actionLabel: "Reduce Debt",
  },
  lowSavingsRate: {
    title: "Low Savings Rate",
    description: "You're saving less than recommended. Try to save at least 20% of your income.",
    severity: "medium",
    actionLabel: "Increase Savings",
  },
  noEmergencyFund: {
    title: "No Emergency Fund",
    description: "Build an emergency fund covering 6 months of expenses for financial security.",
    severity: "high",
    actionLabel: "Start Saving",
  },
  noInvestments: {
    title: "No Investments",
    description: "You haven't started investing. Begin your wealth-building journey today.",
    severity: "medium",
    actionLabel: "Start Investing",
  },
  noRetirementPlan: {
    title: "No Retirement Planning",
    description: "Secure your future with systematic retirement planning and investments.",
    severity: "low",
    actionLabel: "Plan Retirement",
  },
};

export function GapCard({ gap, onAction }: GapCardProps) {
  const info = GAP_INFO[gap];
  if (!info) return null;

  const severityColors = {
    high: {
      bg: "oklch(0.5 0.15 25 / 10%)",
      border: "oklch(0.6 0.15 25 / 30%)",
      text: "oklch(0.75 0.15 25)",
      icon: XCircle,
    },
    medium: {
      bg: "oklch(0.75 0.15 85 / 10%)",
      border: "oklch(0.75 0.15 85 / 30%)",
      text: "oklch(0.8 0.15 85)",
      icon: AlertTriangle,
    },
    low: {
      bg: "oklch(0.6 0.15 220 / 10%)",
      border: "oklch(0.6 0.15 220 / 30%)",
      text: "oklch(0.7 0.15 220)",
      icon: Info,
    },
  };

  const config = severityColors[info.severity];
  const Icon = config.icon;

  return (
    <div 
      className="rounded-xl border p-4"
      style={{ 
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      <div className="mb-3 flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0" style={{ color: config.text }} />
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{info.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{info.description}</p>
        </div>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] py-2 text-sm font-medium text-foreground transition-colors hover:bg-[oklch(0.15_0_0)]"
        >
          {info.actionLabel}
        </button>
      )}
    </div>
  );
}
