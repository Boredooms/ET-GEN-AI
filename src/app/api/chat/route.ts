import { streamText, convertToModelMessages } from 'ai';
import { createOllama } from 'ai-sdk-ollama';
import { z } from 'zod';
import { searchContent } from '@/lib/services/et-content';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { checkRateLimit } from '@/lib/ai/safety';
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { env } from "@/config/env";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize Ollama
const ollama = createOllama({
  baseURL: env.OLLAMA_BASE_URL,
  headers: {
    Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
  },
});

const convex = process.env.NEXT_PUBLIC_CONVEX_URL 
  ? new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL) 
  : null;

// Helper function to generate financial advice based on profile
function generateFinancialAdvice(profile: any): string[] {
  const advice: string[] = [];

  // Health score advice
  if (profile.healthScore < 40) {
    advice.push("⚠️ Your financial health needs immediate attention. Focus on building emergency savings and reducing debt.");
  } else if (profile.healthScore < 70) {
    advice.push("📈 You're on the right track! Focus on increasing investments and improving insurance coverage.");
  } else {
    advice.push("✅ Excellent financial health! Continue optimizing your portfolio and exploring wealth growth opportunities.");
  }

  // Gap-specific advice
  if (profile.gaps?.includes('noEmergencyFund')) {
    advice.push("🏦 Build an emergency fund covering 6 months of expenses. Start with a high-interest savings account.");
  }
  if (profile.gaps?.includes('noInsurance')) {
    advice.push("🛡️ Get life and health insurance immediately. It's the foundation of financial security.");
  }
  if (profile.gaps?.includes('noInvestments')) {
    advice.push("💰 Start investing with a small SIP of ₹500-1000/month in diversified mutual funds.");
  }
  if (profile.gaps?.includes('highDebtRatio')) {
    advice.push("💳 Your debt is high. Consider debt consolidation or focus on paying off high-interest loans first.");
  }
  if (profile.gaps?.includes('lowSavingsRate')) {
    advice.push("💵 Try to save at least 20% of your income. Automate savings on salary day.");
  }

  return advice;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  if (!checkRateLimit(ip, 30, 60000)) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  const { messages, userProfile, conversationId } = await req.json();

  // Save the user message
  if (convex && conversationId && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      const content = typeof lastMessage.content === 'string' 
        ? lastMessage.content 
        : Array.isArray(lastMessage.content) 
          ? lastMessage.content.find((c: any) => c.type === 'text')?.text || ""
          : "";
      
      try {
        await convex.mutation(api.messages.addMessage, {
          conversationId,
          role: "user",
          content,
          status: "complete",
        });
      } catch (e) {
        console.error("Failed to save user msg:", e);
      }
    }
  }

  const profileCtx = userProfile
    ? `\nUser Profile Snapshot:\n- Type: ${userProfile.userType}\n- Interests: ${userProfile.interests?.join(", ")}\n`
    : "";

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: ollama('qwen3-coder-next:cloud'),
    system: SYSTEM_PROMPT + profileCtx + "\n\nYou are an AI financial concierge with advanced tools to analyze financial health, recommend products, check eligibility, compare options, calculate EMIs, and track goal progress. Use these tools proactively to provide personalized financial guidance.",
    messages: modelMessages,
    // @ts-expect-error - maxSteps is supported in AI SDK v6 at runtime but may have type conflicts with specific providers
    maxSteps: 5,
    tools: {
      searchContent: {
        description: 'Search the Economic Times for recent news, market signals, companies, or specific stories.',
        inputSchema: z.object({
          query: z.string().describe('The search query or keywords'),
        }),
        execute: async ({ query }: { query: string }) => {
          const results = searchContent(query, 3);
          return results.map(r => ({ ...r, id: `sid_${Math.random().toString(36).slice(2, 9)}` }));
        },
      },
      logAction: {
        description: 'Call this when the user expresses an intent to save an article, subscribe to ET Prime, or register for an event.',
        inputSchema: z.object({
          action: z.enum(["save", "subscribe", "register"]),
          details: z.string().describe('Details of what is being saved or subscribed to.'),
        }),
        execute: async (params: { action: "save"|"subscribe"|"register", details: string }) => {
          const { action, details } = params;
          console.log(`[ACTION] ${action}: ${details}`);
          return { success: true, message: `Action ${action} recorded for ${details}` };
        },
      },
      analyzeFinancialHealth: {
        description: 'Analyze user\'s financial health score, identify gaps, and provide actionable advice. Use this when user asks about their financial status or needs improvement suggestions.',
        inputSchema: z.object({
          userId: z.string().optional().describe('User ID if authenticated'),
          deviceId: z.string().optional().describe('Device ID for anonymous users'),
        }),
        execute: async ({ userId, deviceId }: { userId?: string; deviceId?: string }) => {
          if (!convex) return { error: "Database not available" };
          
          try {
            const profile = userId 
              ? await convex.query(api.financialProfiles.getFinancialProfile, { userId: userId as any })
              : await convex.query(api.financialProfiles.getFinancialProfile, { deviceId });

            if (!profile) {
              return { 
                error: "No financial profile found. Please complete your financial profile first.",
                suggestion: "I can help you set up your financial profile. What's your current monthly income?"
              };
            }

            return {
              healthScore: profile.healthScore,
              scoreBreakdown: {
                savingsRate: profile.monthlyIncome ? ((profile.savingsRate || 0) * 100).toFixed(1) + '%' : 'N/A',
                debtRatio: profile.monthlyIncome ? ((profile.totalLiabilities || 0) / profile.monthlyIncome * 100).toFixed(1) + '%' : 'N/A',
                investmentRate: profile.monthlyIncome ? ((profile.portfolioValue || 0) / profile.monthlyIncome * 100).toFixed(1) + '%' : 'N/A',
                hasInsurance: (profile.hasHealthInsurance && profile.hasLifeInsurance) ? 'Yes' : 'Partial',
                emergencyFundMonths: profile.monthlyExpenses ? (((profile.monthlyIncome || 0) - (profile.monthlyExpenses || 0)) / profile.monthlyExpenses).toFixed(1) + ' months' : 'N/A',
              },
              gaps: profile.gaps || [],
              completeness: profile.completeness,
              advice: generateFinancialAdvice(profile),
            };
          } catch (error) {
            return { error: "Failed to analyze financial health", details: String(error) };
          }
        },
      },
      recommendProducts: {
        description: 'Get personalized financial product recommendations (credit cards, loans, insurance, investments) based on user\'s financial profile and goals.',
        inputSchema: z.object({
          userId: z.string().optional(),
          deviceId: z.string().optional(),
          category: z.enum(['creditCard', 'loan', 'insurance', 'investment', 'savings']).optional().describe('Filter by specific product category'),
          limit: z.number().optional().default(5).describe('Number of recommendations to return'),
        }),
        execute: async ({ userId, deviceId, category, limit = 5 }) => {
          if (!convex) return { error: "Database not available" };
          
          try {
            // Generate fresh recommendations
            await convex.mutation(api.recommendations.generateProductRecommendations, {
              userId: userId as any,
              deviceId,
              forceRefresh: false,
            });

            // Get recommendations
            const recommendations = await convex.query(api.recommendations.getProductRecommendations, {
              userId: userId as any,
              deviceId,
              category: category as any,
              limit,
            });

            return {
              count: recommendations.length,
              recommendations: recommendations.map((rec: any) => ({
                productName: rec.product?.name,
                provider: rec.product?.provider,
                category: rec.category,
                matchScore: rec.matchScore,
                eligibilityScore: rec.eligibilityScore,
                reasons: rec.reasons,
                gapsFilled: rec.gapsFilled,
                estimatedValue: rec.estimatedValue,
                features: rec.product?.features?.slice(0, 3), // Top 3 features
                applicationUrl: rec.product?.applicationUrl,
              })),
            };
          } catch (error) {
            return { error: "Failed to generate recommendations", details: String(error) };
          }
        },
      },
      checkEligibility: {
        description: 'Check if user is eligible for a specific financial product and get detailed eligibility breakdown.',
        inputSchema: z.object({
          userId: z.string().optional(),
          deviceId: z.string().optional(),
          productId: z.string().describe('The ID of the product to check eligibility for'),
        }),
        execute: async ({ userId, deviceId, productId }) => {
          if (!convex) return { error: "Database not available" };
          
          try {
            const eligibility = await convex.query(api.recommendations.checkProductEligibility, {
              userId: userId as any,
              deviceId,
              productId: productId as any,
            });

            return {
              productName: eligibility.product.name,
              isEligible: eligibility.isEligible,
              matchScore: eligibility.matchScore,
              eligibilityScore: eligibility.eligibilityScore,
              reasons: eligibility.reasons,
              gapsFilled: eligibility.gapsFilled,
              estimatedValue: eligibility.estimatedValue,
            };
          } catch (error) {
            return { error: "Failed to check eligibility", details: String(error) };
          }
        },
      },
      compareProducts: {
        description: 'Compare multiple financial products side-by-side with personalized scoring for each.',
        inputSchema: z.object({
          userId: z.string().optional(),
          deviceId: z.string().optional(),
          productIds: z.array(z.string()).describe('Array of product IDs to compare (max 5)'),
        }),
        execute: async ({ userId, deviceId, productIds }) => {
          if (!convex) return { error: "Database not available" };
          
          if (productIds.length > 5) {
            return { error: "Maximum 5 products can be compared at once" };
          }

          try {
            const comparison = await convex.query(api.recommendations.compareProducts, {
              userId: userId as any,
              deviceId,
              productIds: productIds as any,
            });

            return {
              productsCompared: comparison.length,
              comparison: comparison.map((item: any) => ({
                productName: item.product.name,
                provider: item.product.provider,
                category: item.product.category,
                matchScore: item.matchScore,
                eligibilityScore: item.eligibilityScore,
                reasons: item.reasons,
                keyFeatures: item.product.features?.slice(0, 3),
                estimatedValue: item.estimatedValue,
              })),
              recommendation: comparison.length > 0 
                ? `Based on your profile, ${comparison[0].product.name} has the highest match score (${comparison[0].matchScore}/100)`
                : null,
            };
          } catch (error) {
            return { error: "Failed to compare products", details: String(error) };
          }
        },
      },
      calculateLoanEMI: {
        description: 'Calculate monthly EMI (Equated Monthly Installment) for loans with detailed breakdown of principal and interest.',
        inputSchema: z.object({
          loanAmount: z.number().describe('Loan amount in rupees'),
          interestRate: z.number().describe('Annual interest rate in percentage'),
          tenureMonths: z.number().describe('Loan tenure in months'),
        }),
        execute: async ({ loanAmount, interestRate, tenureMonths }) => {
          // EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
          const monthlyRate = interestRate / (12 * 100);
          const emi = monthlyRate === 0 
            ? loanAmount / tenureMonths
            : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);

          const totalPayment = emi * tenureMonths;
          const totalInterest = totalPayment - loanAmount;

          return {
            monthlyEMI: Math.round(emi),
            totalPayment: Math.round(totalPayment),
            totalInterest: Math.round(totalInterest),
            principalAmount: loanAmount,
            interestRate: interestRate,
            tenureMonths: tenureMonths,
            tenureYears: (tenureMonths / 12).toFixed(1),
            breakdown: `For a loan of ₹${loanAmount.toLocaleString('en-IN')} at ${interestRate}% for ${tenureMonths} months, your monthly EMI will be ₹${Math.round(emi).toLocaleString('en-IN')}. Total interest: ₹${Math.round(totalInterest).toLocaleString('en-IN')}.`,
          };
        },
      },
      trackGoalProgress: {
        description: 'Track progress towards financial goals and provide recommendations to accelerate achievement.',
        inputSchema: z.object({
          userId: z.string().optional(),
          deviceId: z.string().optional(),
        }),
        execute: async ({ userId, deviceId }) => {
          if (!convex) return { error: "Database not available" };
          
          try {
            const profile = userId 
              ? await convex.query(api.financialProfiles.getFinancialProfile, { userId: userId as any })
              : await convex.query(api.financialProfiles.getFinancialProfile, { deviceId });

            if (!profile?.goals || profile.goals.length === 0) {
              return { 
                error: "No financial goals found",
                suggestion: "Let's set some financial goals! What are you saving for? (e.g., emergency fund, home, retirement, child education)"
              };
            }

            const goalsWithProgress = profile.goals.map((goal: any) => {
              const progress = goal.targetAmount 
                ? ((goal.currentAmount || 0) / goal.targetAmount * 100).toFixed(1)
                : 0;
              
              const remaining = (goal.targetAmount || 0) - (goal.currentAmount || 0);
              const monthsToTarget = goal.targetDate 
                ? Math.max(0, Math.floor((new Date(goal.targetDate).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)))
                : null;
              
              const monthlySavingsNeeded = monthsToTarget && monthsToTarget > 0
                ? Math.round(remaining / monthsToTarget)
                : null;

              return {
                description: goal.description,
                targetAmount: goal.targetAmount,
                currentAmount: goal.currentAmount || 0,
                progress: `${progress}%`,
                remaining: remaining,
                targetDate: goal.targetDate,
                monthsToTarget,
                monthlySavingsNeeded,
                status: parseFloat(progress as string) >= 100 ? 'Achieved' : 
                        parseFloat(progress as string) >= 75 ? 'On Track' : 
                        parseFloat(progress as string) >= 25 ? 'In Progress' : 'Just Started',
              };
            });

            return {
              totalGoals: goalsWithProgress.length,
              goals: goalsWithProgress,
            };
          } catch (error) {
            return { error: "Failed to track goal progress", details: String(error) };
          }
        },
      },
    },
    onFinish: async ({ text, toolResults }) => {
      if (convex && conversationId) {
        try {
          const sources = toolResults
            ?.filter(tr => tr.toolName === "searchContent")
            .flatMap(tr => ((tr as any).output as any[]).map((r: any) => ({
              id: r.id || String(Math.random()),
              title: r.title,
              excerpt: r.summary,
              topic: r.topic || "News",
              source: r.source || "ET"
            })));

          const actions = toolResults
            ?.filter(tr => tr.toolName === "logAction")
            .map(tr => ({
              id: String(Math.random()),
              label: ((tr as any).output as any).message || "Action Confirmed",
              type: ((tr as any).args as any).action || "save"
            }));

          await convex.mutation(api.messages.addMessage, {
            conversationId,
            role: "assistant",
            content: text || "",
            status: "complete",
            sources: sources?.length ? sources : undefined,
            actions: actions?.length ? actions : undefined,
          });
        } catch (e) {
          console.error("Failed to save assistant msg:", e);
        }
      }
    }

  });

  // AI SDK v6: Use the text stream response with proper format for useChat hook
  // This properly handles tool invocations and text streaming
  return result.toUIMessageStreamResponse();
}


