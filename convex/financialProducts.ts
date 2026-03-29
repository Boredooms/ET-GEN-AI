import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Financial Products Management
 * Handles product catalog for credit cards, loans, insurance, and investments
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all financial products with optional filtering
 */
export const listProducts = query({
  args: {
    category: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let products;
    
    if (args.category) {
      products = await ctx.db
        .query("financialProducts")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    } else {
      products = await ctx.db
        .query("financialProducts")
        .collect();
    }
    
    if (args.isActive !== undefined) {
      products = products.filter(p => p.isActive === args.isActive);
    }
    
    // Sort by rank
    products.sort((a, b) => a.rank - b.rank);
    
    return products;
  },
});

/**
 * Get a single product by ID
 */
export const getProduct = query({
  args: { productId: v.id("financialProducts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

/**
 * Get products by category
 */
export const getProductsByCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("financialProducts")
      .withIndex("by_category", q => q.eq("category", args.category))
      .filter(q => q.eq(q.field("isActive"), true))
      .collect();
  },
});

/**
 * Search products by name or description
 */
export const searchProducts = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allProducts = await ctx.db.query("financialProducts").collect();
    const term = args.searchTerm.toLowerCase();
    
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.partnerName.toLowerCase().includes(term) ||
      p.bestFor.some(tag => tag.toLowerCase().includes(term))
    );
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Seed initial financial products (run once)
 */
export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if products already exist
    const existing = await ctx.db.query("financialProducts").first();
    if (existing) {
      return { message: "Products already seeded", count: 0 };
    }

    const products = [
      // Credit Cards
      {
        productId: "hdfc-platinum-cc",
        category: "creditCard",
        subCategory: "cashback",
        partnerName: "HDFC Bank",
        name: "ET Money Platinum Credit Card",
        description: "Premium cashback card with 5% on online shopping, 2% on dining, and 1% on all other spends.",
        features: ["5% cashback on online shopping", "2% cashback on dining", "1% on all other spends", "Free airport lounge access"],
        minIncome: 300000,
        minCreditScore: 700,
        ageMin: 21,
        ageMax: 65,
        interestRate: 42,
        annualFee: 500,
        benefits: ["Welcome bonus ₹500", "Zero fuel surcharge", "Insurance cover ₹2L"],
        ctaLabel: "Apply Now",
        applicationUrl: "https://etmoney.com/credit-cards/platinum",
        bestFor: ["cashback", "shopping", "dining", "travel"],
        isActive: true,
        isFeatured: true,
        rank: 1,
        createdAt: Date.now(),
      },
      {
        productId: "icici-travel-cc",
        category: "creditCard",
        subCategory: "travel",
        partnerName: "ICICI Bank",
        name: "Travel Rewards Pro Card",
        description: "Earn 4X reward points on travel bookings and 2X on all other spends.",
        features: ["4X points on travel", "2X points on all spends", "Unlimited lounge access", "Zero forex fees"],
        minIncome: 600000,
        minCreditScore: 750,
        ageMin: 23,
        ageMax: 70,
        interestRate: 39.6,
        annualFee: 1500,
        benefits: ["5000 welcome points", "Travel insurance ₹1Cr", "Concierge services"],
        ctaLabel: "Apply Now",
        applicationUrl: "https://etmoney.com/credit-cards/travel",
        bestFor: ["travel", "rewards", "lounge", "international"],
        isActive: true,
        isFeatured: true,
        rank: 2,
        createdAt: Date.now(),
      },
      {
        productId: "axis-fuel-cc",
        category: "creditCard",
        subCategory: "fuel",
        partnerName: "Axis Bank",
        name: "Fuel Saver Card",
        description: "Best-in-class 5% cashback on fuel with zero annual fee.",
        features: ["5% fuel cashback unlimited", "1% on utilities", "Lifetime free", "Digital card in 5 mins"],
        minIncome: 250000,
        minCreditScore: 650,
        ageMin: 21,
        ageMax: 65,
        interestRate: 45,
        annualFee: 0,
        benefits: ["No fuel limits", "Instant issuance", "EMI facility"],
        ctaLabel: "Get Free Card",
        applicationUrl: "https://etmoney.com/credit-cards/fuel",
        bestFor: ["fuel", "cashback", "lifetime-free", "budget-friendly"],
        isActive: true,
        isFeatured: false,
        rank: 3,
        createdAt: Date.now(),
      },
      {
        productId: "kotak-student-cc",
        category: "creditCard",
        subCategory: "student",
        partnerName: "Kotak Bank",
        name: "Student First Card",
        description: "Designed for students. Build credit history with zero annual fee and no income proof.",
        features: ["Zero annual fee", "₹1L credit limit", "2% cashback on utilities", "No income proof needed"],
        minIncome: 0,
        ageMin: 18,
        ageMax: 28,
        interestRate: 42,
        annualFee: 0,
        benefits: ["Build credit score", "Financial literacy resources", "Upgrade options"],
        ctaLabel: "Apply Now",
        applicationUrl: "https://etmoney.com/credit-cards/student",
        bestFor: ["student", "first-card", "credit-building", "youth"],
        isActive: true,
        isFeatured: false,
        rank: 4,
        createdAt: Date.now(),
      },

      // Personal Loans
      {
        productId: "bajaj-instant-loan",
        category: "loan",
        subCategory: "personal",
        partnerName: "Bajaj Finserv",
        name: "ET Instant Personal Loan",
        description: "Quick approval personal loan with minimal documentation. Get up to ₹25L at competitive rates.",
        features: ["Instant approval 30 mins", "Minimal documentation", "Flexible tenure 12-60 months", "No collateral"],
        minIncome: 300000,
        minCreditScore: 700,
        ageMin: 23,
        ageMax: 58,
        interestRate: 10.99,
        processingFee: 2.5,
        benefits: ["Same-day disbursal", "Flexible EMI", "Pre-closure allowed"],
        ctaLabel: "Check Eligibility",
        applicationUrl: "https://etmoney.com/loans/personal",
        bestFor: ["personal-loan", "instant", "salaried", "flexible"],
        isActive: true,
        isFeatured: true,
        rank: 1,
        createdAt: Date.now(),
      },
      {
        productId: "hdfc-business-loan",
        category: "loan",
        subCategory: "business",
        partnerName: "HDFC Bank",
        name: "Business Growth Loan",
        description: "Collateral-free business loans for SMEs. Fund your expansion with quick approvals.",
        features: ["Up to ₹50L collateral-free", "GST-based underwriting", "Working capital support", "Overdraft facility"],
        minIncome: 600000,
        minCreditScore: 680,
        ageMin: 25,
        ageMax: 65,
        interestRate: 12.5,
        processingFee: 2.0,
        benefits: ["Tax benefits", "Moratorium period", "Digital management"],
        ctaLabel: "Apply Now",
        applicationUrl: "https://etmoney.com/loans/business",
        bestFor: ["business", "sme", "working-capital", "self-employed"],
        isActive: true,
        isFeatured: true,
        rank: 2,
        createdAt: Date.now(),
      },
      {
        productId: "sbi-education-loan",
        category: "loan",
        subCategory: "education",
        partnerName: "SBI",
        name: "Education Loan Pro",
        description: "Fund your higher education with interest subsidies and flexible repayment.",
        features: ["Up to ₹1.5Cr", "Course + living expenses", "Moratorium period", "Interest subsidy available"],
        minIncome: 0,
        ageMin: 18,
        ageMax: 35,
        interestRate: 8.5,
        processingFee: 0,
        benefits: ["Tax benefits 80E", "No prepayment charges", "Study abroad coverage"],
        ctaLabel: "Apply Now",
        applicationUrl: "https://etmoney.com/loans/education",
        bestFor: ["education", "student", "study-abroad", "subsidy"],
        isActive: true,
        isFeatured: false,
        rank: 3,
        createdAt: Date.now(),
      },
      {
        productId: "sbi-home-loan",
        category: "loan",
        subCategory: "home",
        partnerName: "SBI",
        name: "Home Loan Special",
        description: "Lowest home loan rates starting 8.5% with tenure up to 30 years.",
        features: ["8.5% interest", "Up to 30 years tenure", "Balance transfer facility", "Top-up loan"],
        minIncome: 300000,
        minCreditScore: 700,
        ageMin: 23,
        ageMax: 62,
        interestRate: 8.5,
        processingFee: 0.5,
        benefits: ["Save ₹3.5L tax", "Pre-approved offers", "Free valuation"],
        ctaLabel: "Apply Now",
        applicationUrl: "https://etmoney.com/loans/home",
        bestFor: ["home-loan", "tax-saving", "low-interest", "long-tenure"],
        isActive: true,
        isFeatured: true,
        rank: 4,
        createdAt: Date.now(),
      },

      // Insurance
      {
        productId: "star-family-health",
        category: "insurance",
        subCategory: "health",
        partnerName: "Star Health",
        name: "Family Health Shield",
        description: "Comprehensive family floater health insurance with cashless hospitalization and maternity cover.",
        features: ["₹5L to ₹1Cr sum insured", "Cashless at 14000+ hospitals", "Maternity cover ₹50K", "Unlimited restoration"],
        ageMin: 18,
        ageMax: 65,
        coverageAmount: 1000000,
        benefits: ["10% NCB per year", "Zero deductions", "Telemedicine included"],
        ctaLabel: "Get Quote",
        applicationUrl: "https://etmoney.com/insurance/health/family",
        bestFor: ["health", "family-floater", "maternity", "cashless"],
        isActive: true,
        isFeatured: true,
        rank: 1,
        createdAt: Date.now(),
      },
      {
        productId: "hdfc-term-life",
        category: "insurance",
        subCategory: "life",
        partnerName: "HDFC Life",
        name: "Term Life Protect 1 Crore",
        description: "Pure term life insurance with ₹1Cr coverage at lowest premiums. Secure your family's future.",
        features: ["₹50L to ₹10Cr coverage", "10-40 years term", "Accidental death 100% extra", "Critical illness rider"],
        ageMin: 18,
        ageMax: 65,
        coverageAmount: 10000000,
        benefits: ["₹500/month for ₹1Cr", "98% claim settlement", "Instant issuance"],
        ctaLabel: "Get Quote",
        applicationUrl: "https://etmoney.com/insurance/term",
        bestFor: ["term-insurance", "life", "1-crore", "family-protection"],
        isActive: true,
        isFeatured: true,
        rank: 2,
        createdAt: Date.now(),
      },
      {
        productId: "digit-cyber-insurance",
        category: "insurance",
        subCategory: "cyber",
        partnerName: "Digit Insurance",
        name: "Cyber Safe Insurance",
        description: "India's first comprehensive cyber insurance covering identity theft and online fraud.",
        features: ["₹1L to ₹10L coverage", "Identity theft protection", "Phishing coverage", "24/7 helpline"],
        ageMin: 18,
        ageMax: 70,
        coverageAmount: 1000000,
        benefits: ["Legal expenses covered", "24-hour claim settlement", "Cyber safety education"],
        ctaLabel: "Get Protected",
        applicationUrl: "https://etmoney.com/insurance/cyber",
        bestFor: ["cyber", "identity-theft", "fraud-protection", "digital-safety"],
        isActive: true,
        isFeatured: false,
        rank: 3,
        createdAt: Date.now(),
      },
      {
        productId: "icici-motor-insurance",
        category: "insurance",
        subCategory: "motor",
        partnerName: "ICICI Lombard",
        name: "Motor Insurance Comprehensive",
        description: "Comprehensive car insurance with cashless repairs and zero depreciation.",
        features: ["Cashless at 7000+ garages", "Zero depreciation", "Roadside assistance", "Engine protection"],
        ageMin: 18,
        ageMax: 70,
        coverageAmount: 5000000,
        benefits: ["NCB up to 50%", "6-hour claim settlement", "Return to invoice"],
        ctaLabel: "Get Quote",
        applicationUrl: "https://etmoney.com/insurance/motor",
        bestFor: ["motor", "car", "cashless", "zero-depreciation"],
        isActive: true,
        isFeatured: false,
        rank: 4,
        createdAt: Date.now(),
      },

      // Investments
      {
        productId: "et-smart-sip",
        category: "investment",
        subCategory: "mutual-funds",
        partnerName: "ET Money Wealth",
        name: "ET Smart SIP Portfolio",
        description: "AI-curated mutual fund portfolio with auto-rebalancing. Start SIP from ₹500/month.",
        features: ["Minimum ₹500/month", "AI auto-rebalancing", "Tax-saving ELSS", "Goal-based investing"],
        ageMin: 18,
        returns: "12-15% CAGR",
        benefits: ["Zero commission", "Tax benefits 80C", "Instant redemption T+1"],
        ctaLabel: "Start SIP",
        applicationUrl: "https://etmoney.com/invest/smart-sip",
        bestFor: ["mutual-funds", "sip", "goal-based", "tax-saving"],
        isActive: true,
        isFeatured: true,
        rank: 1,
        createdAt: Date.now(),
      },
      {
        productId: "safegold-digital",
        category: "investment",
        subCategory: "gold",
        partnerName: "SafeGold",
        name: "Digital Gold Investment",
        description: "Buy 24K pure digital gold starting from ₹10. Store securely in insured vaults.",
        features: ["Start from ₹10", "24K 99.9% pure", "Brink's insured vaults", "Sell anytime", "Physical delivery available"],
        ageMin: 18,
        returns: "8-12% CAGR",
        benefits: ["Inflation hedge", "Instant liquidity", "No GST until delivery"],
        ctaLabel: "Buy Gold",
        applicationUrl: "https://etmoney.com/invest/gold",
        bestFor: ["gold", "digital-gold", "safe-haven", "inflation-hedge"],
        isActive: true,
        isFeatured: true,
        rank: 2,
        createdAt: Date.now(),
      },
      {
        productId: "bajaj-fd",
        category: "investment",
        subCategory: "fixed-deposit",
        partnerName: "Bajaj Finance",
        name: "High-Yield Fixed Deposit",
        description: "Earn up to 8.5% p.a. with CRISIL AAA-rated FDs. Flexible tenures from 12 to 60 months.",
        features: ["7.5-8.5% interest", "12-60 months tenure", "₹25K minimum", "Auto-renewal option"],
        ageMin: 18,
        interestRate: 8.5,
        returns: "7.5-8.5% p.a.",
        benefits: ["CRISIL AAA rated", "Tax benefits 80C", "Quarterly interest payout"],
        ctaLabel: "Invest Now",
        applicationUrl: "https://etmoney.com/invest/fd",
        bestFor: ["fixed-deposit", "guaranteed-returns", "safe", "tax-saving"],
        isActive: true,
        isFeatured: false,
        rank: 3,
        createdAt: Date.now(),
      },
      {
        productId: "vested-us-stocks",
        category: "investment",
        subCategory: "stocks",
        partnerName: "Vested",
        name: "US Stocks Portfolio",
        description: "Invest in top US stocks like Apple, Google, Tesla from ₹1000. Fractional shares, zero commission.",
        features: ["5000+ US stocks & ETFs", "Fractional shares from ₹1000", "Zero commission", "Real-time data"],
        ageMin: 18,
        returns: "15-20% CAGR",
        benefits: ["USD diversification", "World's best companies", "Curated portfolios"],
        ctaLabel: "Start Investing",
        applicationUrl: "https://etmoney.com/invest/us-stocks",
        bestFor: ["us-stocks", "international", "fractional-shares", "tech-stocks"],
        isActive: true,
        isFeatured: true,
        rank: 4,
        createdAt: Date.now(),
      },
      {
        productId: "pfrda-nps",
        category: "investment",
        subCategory: "retirement",
        partnerName: "PFRDA",
        name: "NPS Tier 1 Tax Saver",
        description: "Government-backed retirement savings with extra ₹50K tax deduction.",
        features: ["Extra ₹50K tax deduction", "Up to 75% equity", "Low 0.09% expense", "Auto/active choice"],
        ageMin: 18,
        ageMax: 70,
        returns: "10-14% CAGR",
        benefits: ["₹2L total tax saving", "Government co-contribution", "Partial withdrawal after 3 years"],
        ctaLabel: "Open NPS",
        applicationUrl: "https://etmoney.com/invest/nps",
        bestFor: ["nps", "retirement", "tax-saving", "government", "long-term"],
        isActive: true,
        isFeatured: false,
        rank: 5,
        createdAt: Date.now(),
      },

      // Savings Accounts
      {
        productId: "idfc-smart-savings",
        category: "savings",
        subCategory: "savings-account",
        partnerName: "IDFC FIRST Bank",
        name: "ET Smart Savings Account",
        description: "High-interest savings account with 7% p.a., zero balance, and unlimited free ATM withdrawals.",
        features: ["7% interest on entire balance", "Zero minimum balance", "Unlimited free ATM", "Free NEFT/RTGS/IMPS"],
        ageMin: 18,
        interestRate: 7.0,
        benefits: ["Highest interest in industry", "No hidden charges", "Linked FASTag and UPI"],
        ctaLabel: "Open Account",
        applicationUrl: "https://etmoney.com/banking/smart-savings",
        bestFor: ["savings-account", "high-interest", "zero-balance", "free-atm"],
        isActive: true,
        isFeatured: true,
        rank: 1,
        createdAt: Date.now(),
      },
      {
        productId: "hdfc-salary-account",
        category: "savings",
        subCategory: "salary-account",
        partnerName: "HDFC Bank",
        name: "Salary Account Pro",
        description: "Premium salary account with platinum debit card and exclusive lifestyle benefits.",
        features: ["3.5% interest", "Zero balance with salary credit", "Platinum debit card", "₹10L insurance"],
        ageMin: 18,
        interestRate: 3.5,
        benefits: ["Exclusive discounts", "Instant pre-approved loans", "Free DD and cheques"],
        ctaLabel: "Open Account",
        applicationUrl: "https://etmoney.com/banking/salary",
        bestFor: ["salary-account", "premium", "insurance", "lifestyle"],
        isActive: true,
        isFeatured: false,
        rank: 2,
        createdAt: Date.now(),
      },
    ];

    // Insert all products
    const insertedIds = await Promise.all(
      products.map(product => ctx.db.insert("financialProducts", product as any))
    );

    return {
      message: "Products seeded successfully",
      count: insertedIds.length,
      productIds: insertedIds,
    };
  },
});
