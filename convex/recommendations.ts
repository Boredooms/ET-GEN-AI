import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Financial Product Recommendations Engine
 * Multi-dimensional matching algorithm with AI-powered scoring
 */

// ============================================================================
// CONTENT RECOMMENDATIONS (existing)
// ============================================================================

export const getForUser = query({
  args: {
    deviceId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db
        .query("recommendations")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .order("desc")
        .take(10);
    }
    if (args.deviceId) {
      return await ctx.db
        .query("recommendations")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .order("desc")
        .take(10);
    }
    return [];
  },
});

export const addRecommendation = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    contentId: v.string(),
    title: v.string(),
    summary: v.string(),
    source: v.string(),
    topic: v.string(),
    url: v.optional(v.string()),
    publishedAt: v.string(),
    reason: v.string(),
    score: v.number(),
    actionType: v.string(),
    ctaLabel: v.string(),
    ctaHref: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("recommendations", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// ============================================================================
// FINANCIAL PRODUCT RECOMMENDATIONS (new)
// ============================================================================

/**
 * Get personalized product recommendations for a user
 * Uses multi-dimensional scoring algorithm
 */
export const getProductRecommendations = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("creditCard"),
      v.literal("loan"),
      v.literal("insurance"),
      v.literal("investment"),
      v.literal("savings")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    // Get existing recommendations
    let recommendations;
    if (args.userId) {
      recommendations = await ctx.db
        .query("serviceRecommendations")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    } else if (args.deviceId) {
      recommendations = await ctx.db
        .query("serviceRecommendations")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .order("desc")
         .collect();
     } else {
       return [];
     }

     // TODO: Filter by category if specified (would require fetching products)
     // Currently category filter is not supported in schema

     // Sort by score and recency
     recommendations.sort((a, b) => {
       // Prioritize by score first
       if (b.matchScore !== a.matchScore) {
         return b.matchScore - a.matchScore;
       }
       // Then by creation time
       return b._creationTime - a._creationTime;
     });

    // Populate product details
    const recommendationsWithProducts = await Promise.all(
      recommendations.slice(0, limit).map(async (rec) => {
        const product = await ctx.db.get(rec.productId);
        return {
          ...rec,
          product,
        };
      })
    );

    return recommendationsWithProducts;
  },
});

/**
 * Generate product recommendations using AI matching algorithm
 */
export const generateProductRecommendations = mutation({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    forceRefresh: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.deviceId) {
      throw new Error("Either userId or deviceId required");
    }

    // Get financial profile
    let financialProfile;
    if (args.userId) {
      financialProfile = await ctx.db
        .query("financialProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();
    } else if (args.deviceId) {
      financialProfile = await ctx.db
        .query("financialProfiles")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .first();
    }

    if (!financialProfile) {
      throw new Error("Financial profile not found. Please complete onboarding first.");
    }

    // Get all active products
    const allProducts = await ctx.db
      .query("financialProducts")
      .filter(q => q.eq(q.field("isActive"), true))
      .collect();

    // Calculate match scores for each product
    const scoredProducts = allProducts.map(product => {
      const matchDetails = calculateProductMatch(financialProfile, product);
      return {
        product,
        ...matchDetails,
      };
    });

    // Sort by match score
    scoredProducts.sort((a, b) => b.matchScore - a.matchScore);

    // Take top products per category
    const topProducts: typeof scoredProducts = [];
    const categoryCounts: Record<string, number> = {};

    for (const scored of scoredProducts) {
      const category = scored.product.category;
      if (!categoryCounts[category]) categoryCounts[category] = 0;
      
      // Take top 5 per category, but at least 70% match score
      if (categoryCounts[category] < 5 && scored.matchScore >= 70) {
        topProducts.push(scored);
        categoryCounts[category]++;
      }
    }

    // Delete old recommendations if force refresh
    if (args.forceRefresh) {
      const oldRecs = args.userId
        ? await ctx.db
            .query("serviceRecommendations")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect()
        : await ctx.db
            .query("serviceRecommendations")
            .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId!))
            .collect();
      
      await Promise.all(oldRecs.map(rec => ctx.db.delete(rec._id)));
    }

    // Insert new recommendations
    const insertedIds = await Promise.all(
      topProducts.map(scored =>
        ctx.db.insert("serviceRecommendations", {
          userId: args.userId,
          deviceId: args.deviceId,
          productId: scored.product._id,
          reason: scored.reasons ? scored.reasons[0] : "Recommended for you",
          matchScore: scored.matchScore,
          eligibilityScore: scored.eligibilityScore,
          triggeredBy: "matching_algorithm",
          priority: scored.matchScore >= 90 ? "high" : scored.matchScore >= 75 ? "medium" : "low",
          status: "pending",
          createdAt: Date.now(),
        })
      )
    );

    return {
      message: "Recommendations generated successfully",
      count: insertedIds.length,
      categoryCounts,
    };
  },
});

/**
 * Calculate product match score using multi-dimensional algorithm
 * 
 * Scoring Breakdown:
 * - Eligibility: 30% (meets basic criteria?)
 * - Goal Alignment: 25% (matches user goals?)
 * - Gap Filling: 20% (addresses financial gaps?)
 * - Behavioral Intent: 15% (user showed interest?)
 * - Peer Similarity: 10% (similar users liked it?)
 */
function calculateProductMatch(
  profile: Doc<"financialProfiles">,
  product: Doc<"financialProducts">
): {
  matchScore: number;
  eligibilityScore: number;
  reasons: string[];
  gapsFilled: string[];
  estimatedValue: string;
} {
  let totalScore = 0;
  const reasons: string[] = [];
  const gapsFilled: string[] = [];

  // ===== 1. ELIGIBILITY SCORE (30 points) =====
  let eligibilityScore = 0;

  // Age check (skip if profile doesn't have age data)
  // Eligibility based on income and credit score instead

  // Income check
  if (profile.monthlyIncome && product.minIncome) {
    if (profile.monthlyIncome >= product.minIncome) {
      eligibilityScore += 10;
      reasons.push(`Your income (₹${(profile.monthlyIncome / 100000).toFixed(1)}L) meets requirements`);
    } else {
      const shortfall = product.minIncome - profile.monthlyIncome;
      reasons.push(`Income shortfall: ₹${(shortfall / 100000).toFixed(1)}L below requirement`);
    }
  }

  // Credit score check (for credit products)
  if (product.category === "creditCard" || product.category === "loan") {
    if (profile.creditScore && product.minCreditScore) {
      if (profile.creditScore >= product.minCreditScore) {
        eligibilityScore += 10;
        reasons.push(`Excellent credit score (${profile.creditScore})`);
      } else {
        const gap = product.minCreditScore - profile.creditScore;
        reasons.push(`Credit score ${gap} points below requirement`);
      }
    }
  } else {
    // No credit score needed
    eligibilityScore += 10;
  }

  totalScore += eligibilityScore;

  // ===== 2. GOAL ALIGNMENT (25 points) =====
  let goalScore = 0;
  
  if (profile.goals && profile.goals.length > 0) {
    const goalKeywords = {
      creditCard: ["shopping", "reward", "cashback", "travel", "lifestyle"],
      loan: ["home", "education", "business", "debt", "emergency"],
      insurance: ["protection", "health", "life", "family", "security"],
      investment: ["wealth", "retirement", "saving", "growth", "passive-income"],
      savings: ["emergency", "saving", "high-interest", "liquidity"],
    };

    const relevantKeywords = goalKeywords[(product.category as keyof typeof goalKeywords)] || [];
    const goalMatches = profile.goals.filter((goal: any) =>
      relevantKeywords.some(kw => (goal.type || "").toLowerCase().includes(kw))
    );

    if (goalMatches.length > 0) {
      goalScore = Math.min(25, goalMatches.length * 10);
      reasons.push(`Aligns with ${goalMatches.length} of your financial goals`);
    }

    // Category-specific goal matching
    if (product.category === "investment" || product.category === "savings") {
      const hasWealthGoal = profile.goals.some(g => 
        g.type.toLowerCase().includes("wealth") ||
        g.type.toLowerCase().includes("invest") ||
        g.type.toLowerCase().includes("retire")
      );
      if (hasWealthGoal) {
        goalScore += 5;
      }
    }
  }

  totalScore += goalScore;

  // ===== 3. GAP FILLING (20 points) =====
  let gapScore = 0;
  const gaps = profile.gaps || [];

  const gapProductMap: Record<string, string[]> = {
    noInsurance: ["insurance"],
    underInsured: ["insurance"],
    highDebtRatio: ["loan", "creditCard"],
    lowSavingsRate: ["savings", "investment"],
    noEmergencyFund: ["savings"],
    noInvestments: ["investment"],
    noRetirementPlan: ["investment"],
  };

  for (const gap of gaps) {
    const relevantCategories = gapProductMap[gap] || [];
    if (relevantCategories.includes(product.category)) {
      gapScore += 10;
      gapsFilled.push(gap);
      
      // Add specific reasons
      if (gap === "noInsurance" && product.category === "insurance") {
        reasons.push("Fills critical insurance gap");
      } else if (gap === "noEmergencyFund" && product.category === "savings") {
        reasons.push("Helps build emergency fund");
      } else if (gap === "noInvestments" && product.category === "investment") {
        reasons.push("Start your investment journey");
      } else if (gap === "highDebtRatio") {
        reasons.push("Can help consolidate and reduce debt");
      }
    }
  }

  gapScore = Math.min(20, gapScore); // Cap at 20
  totalScore += gapScore;

  // ===== 4. BEHAVIORAL INTENT (15 points) =====
  // This would require behavioral events data
  // For now, use simplified heuristics
  let behaviorScore = 10; // Default baseline
  
  // Name/feature-based interest matching
  const productNameLower = product.name.toLowerCase();
  if ((productNameLower.includes("tax") || productNameLower.includes("savings")) && profile.monthlyIncome && profile.monthlyIncome > 500000) {
    behaviorScore += 5;
    reasons.push("Tax-saving opportunity for your income bracket");
  }

  totalScore += behaviorScore;

  // ===== 5. PEER SIMILARITY (10 points) =====
  // This would require collaborative filtering
  // For now, use product popularity heuristics
  let peerScore = 8; // Default baseline
  
  // Popular products - based on rank/featured status
  if (product.isFeatured || product.rank <= 5) {
    peerScore += 2;
  }

  totalScore += peerScore;

  // ===== ESTIMATED VALUE =====
  let estimatedValue = "Personalized benefits";
  
  if (product.category === "creditCard" && profile.monthlyExpenses) {
    // Estimate cashback value (assume 2% average)
    const monthlyValue = profile.monthlyExpenses * 0.02;
    estimatedValue = `~₹${Math.round(monthlyValue)}/month cashback`;
  } else if (product.category === "savings" && product.interestRate) {
    const savingsAmount = profile.portfolioValue || profile.totalAssets || 100000;
    const yearlyInterest = savingsAmount * (product.interestRate / 100);
    estimatedValue = `~₹${Math.round(yearlyInterest / 12)}/month interest`;
  } else if (product.category === "investment" && product.returns) {
    const sipAmount = 5000; // Default SIP
    // Parse returns string like "12-15%" to get average
    const returnsMatch = product.returns.match(/(\d+)-(\d+)/);
    const avgReturn = returnsMatch ? (parseInt(returnsMatch[1]) + parseInt(returnsMatch[2])) / 2 : 12;
    estimatedValue = `${avgReturn}% expected returns`;
  } else if (product.category === "loan" && product.interestRate) {
    estimatedValue = `${product.interestRate}% interest rate`;
  } else if (product.category === "insurance" && product.annualFee) {
    // Use annual fee as proxy for premium range
    const estimatedMonthly = product.annualFee / 12;
    estimatedValue = `~₹${Math.round(estimatedMonthly)}/month`;
  }

  // Normalize to 0-100 scale
  const matchScore = Math.min(100, Math.round(totalScore));

  // Add summary reason
  if (matchScore >= 90) {
    reasons.unshift("⭐ Excellent match for your financial profile");
  } else if (matchScore >= 75) {
    reasons.unshift("✓ Good match for your needs");
  }

  return {
    matchScore,
    eligibilityScore,
    reasons,
    gapsFilled,
    estimatedValue,
  };
}

/**
 * Check eligibility for a specific product
 */
export const checkProductEligibility = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    productId: v.id("financialProducts"),
  },
  handler: async (ctx, args) => {
    // Get financial profile
    let financialProfile;
    if (args.userId) {
      financialProfile = await ctx.db
        .query("financialProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();
    } else if (args.deviceId) {
      financialProfile = await ctx.db
        .query("financialProfiles")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .first();
    }

    if (!financialProfile) {
      throw new Error("Financial profile not found");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const matchDetails = calculateProductMatch(financialProfile, product);

    return {
      isEligible: matchDetails.eligibilityScore >= 20, // At least 2/3 criteria met
      ...matchDetails,
      product,
    };
  },
});

/**
 * Compare multiple products side-by-side
 */
export const compareProducts = query({
  args: {
    userId: v.optional(v.id("users")),
    deviceId: v.optional(v.string()),
    productIds: v.array(v.id("financialProducts")),
  },
  handler: async (ctx, args) => {
    if (args.productIds.length > 5) {
      throw new Error("Maximum 5 products can be compared at once");
    }

    // Get financial profile
    let financialProfile;
    if (args.userId) {
      financialProfile = await ctx.db
        .query("financialProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();
    } else if (args.deviceId) {
      financialProfile = await ctx.db
        .query("financialProfiles")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
        .first();
    }

    if (!financialProfile) {
      throw new Error("Financial profile not found");
    }

    // Get all products and calculate match scores
    const comparisons = await Promise.all(
      args.productIds.map(async (productId) => {
        const product = await ctx.db.get(productId);
        if (!product) return null;

        const matchDetails = calculateProductMatch(financialProfile, product);
        return {
          product,
          ...matchDetails,
        };
      })
    );

    return comparisons.filter(c => c !== null);
  },
});
