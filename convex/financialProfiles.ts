import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// CREATE OR UPDATE FINANCIAL PROFILE
export const upsertFinancialProfile = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    data: v.object({
      monthlyIncome: v.optional(v.number()),
      incomeSource: v.optional(v.array(v.string())),
      monthlyExpenses: v.optional(v.number()),
      hasInvestments: v.optional(v.boolean()),
      investmentTypes: v.optional(v.array(v.string())),
      portfolioValue: v.optional(v.number()),
      riskAppetite: v.optional(v.string()),
      hasHealthInsurance: v.optional(v.boolean()),
      hasLifeInsurance: v.optional(v.boolean()),
      hasVehicleInsurance: v.optional(v.boolean()),
      hasHomeLoan: v.optional(v.boolean()),
      hasPersonalLoan: v.optional(v.boolean()),
      hasCarLoan: v.optional(v.boolean()),
      totalDebt: v.optional(v.number()),
      creditScore: v.optional(v.number()),
      hasCreditCard: v.optional(v.boolean()),
      creditCardCount: v.optional(v.number()),
      goals: v.optional(v.array(v.object({
        type: v.string(),
        targetAmount: v.number(),
        timeHorizon: v.number(),
        priority: v.string(),
        currentProgress: v.number(),
      }))),
    }),
  },
  handler: async (ctx, args) => {
    const { userId, deviceId, data } = args;

    // Find existing profile
    let profile;
    if (userId) {
      profile = await ctx.db
        .query("financialProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
    } else if (deviceId) {
      profile = await ctx.db
        .query("financialProfiles")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
        .first();
    }

    const now = Date.now();

    // Calculate derived values
    const savingsRate = data.monthlyIncome && data.monthlyExpenses
      ? ((data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome) * 100
      : undefined;

    const netWorth = (data.portfolioValue || 0) - (data.totalDebt || 0);

    // Calculate health score
    const healthScore = calculateHealthScore({
      savingsRate: savingsRate || 0,
      totalDebt: data.totalDebt || 0,
      monthlyIncome: data.monthlyIncome || 0,
      hasInvestments: data.hasInvestments || false,
      portfolioValue: data.portfolioValue || 0,
      hasHealthInsurance: data.hasHealthInsurance || false,
      hasLifeInsurance: data.hasLifeInsurance || false,
      hasVehicleInsurance: data.hasVehicleInsurance || false,
      monthlyExpenses: data.monthlyExpenses || 0,
    });

    // Detect gaps
    const gaps = detectFinancialGaps({
      hasHealthInsurance: data.hasHealthInsurance || false,
      hasLifeInsurance: data.hasLifeInsurance || false,
      monthlyIncome: data.monthlyIncome || 0,
      savingsRate: savingsRate || 0,
      hasInvestments: data.hasInvestments || false,
      totalDebt: data.totalDebt || 0,
      portfolioValue: data.portfolioValue || 0,
      monthlyExpenses: data.monthlyExpenses || 0,
      creditScore: data.creditScore || 0,
      hasCreditCard: data.hasCreditCard || false,
    });

    // Calculate completeness
    const completeness = calculateCompleteness(data);

    const profileData = {
      userId,
      deviceId,
      monthlyIncome: data.monthlyIncome,
      incomeSource: data.incomeSource || [],
      monthlyExpenses: data.monthlyExpenses,
      savingsRate,
      totalAssets: data.portfolioValue,
      totalLiabilities: data.totalDebt,
      netWorth,
      hasInvestments: data.hasInvestments || false,
      investmentTypes: data.investmentTypes || [],
      portfolioValue: data.portfolioValue,
      riskAppetite: data.riskAppetite || "moderate",
      hasHealthInsurance: data.hasHealthInsurance || false,
      hasLifeInsurance: data.hasLifeInsurance || false,
      hasVehicleInsurance: data.hasVehicleInsurance || false,
      insuranceCoverage: undefined,
      hasHomeLoan: data.hasHomeLoan || false,
      hasPersonalLoan: data.hasPersonalLoan || false,
      hasCarLoan: data.hasCarLoan || false,
      totalDebt: data.totalDebt,
      creditScore: data.creditScore,
      hasCreditCard: data.hasCreditCard || false,
      creditCardCount: data.creditCardCount || 0,
      goals: data.goals || [],
      healthScore,
      gaps,
      completeness,
      lastUpdated: now,
      createdAt: profile?.createdAt || now,
    };

    if (profile) {
      await ctx.db.patch(profile._id, profileData);
      return profile._id;
    } else {
      return await ctx.db.insert("financialProfiles", profileData);
    }
  },
});

// GET FINANCIAL PROFILE
export const getFinancialProfile = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, deviceId } = args;

    if (userId) {
      return await ctx.db
        .query("financialProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
    } else if (deviceId) {
      return await ctx.db
        .query("financialProfiles")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
        .first();
    }

    return null;
  },
});

// CALCULATE FINANCIAL HEALTH SCORE
function calculateHealthScore(profile: {
  savingsRate: number;
  totalDebt: number;
  monthlyIncome: number;
  hasInvestments: boolean;
  portfolioValue: number;
  hasHealthInsurance: boolean;
  hasLifeInsurance: boolean;
  hasVehicleInsurance: boolean;
  monthlyExpenses: number;
}): number {
  let score = 0;

  // 1. Savings Rate (20 points)
  if (profile.savingsRate >= 30) score += 20;
  else if (profile.savingsRate >= 20) score += 15;
  else if (profile.savingsRate >= 10) score += 10;
  else if (profile.savingsRate > 0) score += 5;

  // 2. Debt Management (20 points)
  if (profile.monthlyIncome > 0) {
    const debtToIncome = profile.totalDebt / (profile.monthlyIncome * 12);
    if (debtToIncome === 0) score += 20;
    else if (debtToIncome < 0.2) score += 18;
    else if (debtToIncome < 0.4) score += 15;
    else if (debtToIncome < 0.6) score += 10;
    else score += 5;
  }

  // 3. Investment Portfolio (20 points)
  if (profile.hasInvestments && profile.portfolioValue > profile.monthlyIncome * 6) {
    score += 20;
  } else if (profile.hasInvestments && profile.portfolioValue > 0) {
    score += 12;
  } else if (profile.hasInvestments) {
    score += 5;
  }

  // 4. Insurance Coverage (20 points)
  let insuranceScore = 0;
  if (profile.hasHealthInsurance) insuranceScore += 7;
  if (profile.hasLifeInsurance) insuranceScore += 7;
  if (profile.hasVehicleInsurance) insuranceScore += 6;
  score += insuranceScore;

  // 5. Emergency Fund (20 points)
  if (profile.monthlyExpenses > 0) {
    const emergencyFundMonths = profile.portfolioValue / profile.monthlyExpenses;
    if (emergencyFundMonths >= 6) score += 20;
    else if (emergencyFundMonths >= 3) score += 15;
    else if (emergencyFundMonths >= 1) score += 10;
    else if (emergencyFundMonths > 0) score += 5;
  }

  return Math.min(Math.round(score), 100);
}

// DETECT FINANCIAL GAPS
function detectFinancialGaps(profile: {
  hasHealthInsurance: boolean;
  hasLifeInsurance: boolean;
  monthlyIncome: number;
  savingsRate: number;
  hasInvestments: boolean;
  totalDebt: number;
  portfolioValue: number;
  monthlyExpenses: number;
  creditScore: number;
  hasCreditCard: boolean;
}): string[] {
  const gaps: string[] = [];

  if (!profile.hasHealthInsurance) {
    gaps.push("no-health-insurance");
  }

  if (!profile.hasLifeInsurance && profile.monthlyIncome > 30000) {
    gaps.push("no-life-insurance");
  }

  if (profile.savingsRate < 10) {
    gaps.push("low-savings-rate");
  }

  if (!profile.hasInvestments) {
    gaps.push("no-investments");
  }

  if (profile.monthlyExpenses > 0) {
    const emergencyFundMonths = profile.portfolioValue / profile.monthlyExpenses;
    if (emergencyFundMonths < 3) {
      gaps.push("insufficient-emergency-fund");
    }
  }

  if (profile.monthlyIncome > 0) {
    const debtToIncome = profile.totalDebt / (profile.monthlyIncome * 12);
    if (debtToIncome > 0.4) {
      gaps.push("high-debt-burden");
    }
  }

  if (!profile.hasCreditCard && profile.creditScore > 700) {
    gaps.push("missing-credit-building-opportunity");
  }

  return gaps;
}

// CALCULATE PROFILE COMPLETENESS
function calculateCompleteness(data: any): number {
  const fields = [
    'monthlyIncome',
    'monthlyExpenses',
    'hasInvestments',
    'riskAppetite',
    'hasHealthInsurance',
    'hasLifeInsurance',
    'creditScore',
    'hasCreditCard',
  ];

  let filledFields = 0;
  fields.forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      filledFields++;
    }
  });

  return Math.round((filledFields / fields.length) * 100);
}
