"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2, Star, ExternalLink, Calculator } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as Id<"financialProducts">;
  
  const [showEMI, setShowEMI] = useState(false);
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(24);

  const product = useQuery(
    api.financialProducts.getProduct,
    productId ? { productId } : "skip"
  );

  const isLoading = product === undefined;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Product Not Found</h2>
        <p className="mb-4 text-muted-foreground">The product you're looking for doesn't exist.</p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-semibold text-background"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    creditCard: "oklch(0.6 0.15 270)",
    loan: "oklch(0.6 0.15 220)",
    insurance: "oklch(0.6 0.15 142)",
    investment: "oklch(0.65 0.15 85)",
    savings: "oklch(0.6 0.15 180)",
  };

  const categoryColor = categoryColors[product.category] || "oklch(0.5 0 0)";

  // EMI Calculation
  const calculateEMI = () => {
    if (!product.interestRate) return null;
    const monthlyRate = product.interestRate / (12 * 100);
    const emi = monthlyRate === 0 
      ? loanAmount / tenure
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
        (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - loanAmount;
    return { emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest) };
  };

  const emiData = calculateEMI();

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              {product.isFeatured && (
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              )}
              <span 
                className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                style={{ 
                  backgroundColor: `color-mix(in oklch, ${categoryColor} 15%, transparent)`,
                  color: categoryColor 
                }}
              >
                {product.subCategory}
              </span>
            </div>
            <h1 className="mb-2 font-editorial text-3xl text-foreground">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.partnerName}</p>
          </div>

          {/* Description */}
          <div className="mb-8 rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
            <p className="text-foreground">{product.description}</p>
          </div>

          {/* Key Features */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Key Features</h2>
            <div className="space-y-3">
              {product.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-4">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Benefits</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {product.benefits.map((benefit: string, idx: number) => (
                <div key={idx} className="rounded-lg border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-4">
                  <p className="text-sm text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Eligibility */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Eligibility Criteria</h2>
            <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {product.minIncome !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">Minimum Income</div>
                    <div className="mt-1 text-lg font-semibold text-foreground">
                      ₹{(product.minIncome / 100000).toFixed(1)}L/year
                    </div>
                  </div>
                )}
                {product.minCreditScore !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">Minimum Credit Score</div>
                    <div className="mt-1 text-lg font-semibold text-foreground">{product.minCreditScore}</div>
                  </div>
                )}
                {product.ageMin !== undefined && (
                  <div>
                    <div className="text-xs text-muted-foreground">Age Range</div>
                    <div className="mt-1 text-lg font-semibold text-foreground">
                      {product.ageMin} - {product.ageMax || "65"} years
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* EMI Calculator (for loans) */}
          {product.category === "loan" && product.interestRate && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">EMI Calculator</h2>
                <button
                  onClick={() => setShowEMI(!showEMI)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Calculator className="h-4 w-4" />
                  {showEMI ? "Hide" : "Show"} Calculator
                </button>
              </div>
              {showEMI && (
                <div className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-muted-foreground">
                        Loan Amount: ₹{(loanAmount / 100000).toFixed(1)}L
                      </label>
                      <input
                        type="range"
                        min="50000"
                        max="5000000"
                        step="50000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-muted-foreground">
                        Tenure: {tenure} months ({(tenure / 12).toFixed(1)} years)
                      </label>
                      <input
                        type="range"
                        min="6"
                        max="60"
                        step="6"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  {emiData && (
                    <div className="grid gap-4 border-t border-[oklch(1_0_0_/_8%)] pt-4 sm:grid-cols-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Monthly EMI</div>
                        <div className="mt-1 text-2xl font-bold text-foreground">
                          ₹{emiData.emi.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Total Payment</div>
                        <div className="mt-1 text-xl font-semibold text-foreground">
                          ₹{emiData.totalPayment.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Total Interest</div>
                        <div className="mt-1 text-xl font-semibold text-foreground">
                          ₹{emiData.totalInterest.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Best For Tags */}
          {product.bestFor && product.bestFor.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Best For</h2>
              <div className="flex flex-wrap gap-2">
                {product.bestFor.map((tag: string, idx: number) => (
                  <span 
                    key={idx}
                    className="rounded-full px-4 py-2 text-sm font-medium"
                    style={{ 
                      backgroundColor: `color-mix(in oklch, ${categoryColor} 15%, transparent)`,
                      color: categoryColor 
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar - CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Product Highlights</h3>
            
            {/* Financial Details */}
            <div className="mb-6 space-y-3">
              {product.interestRate !== undefined && (
                <div className="flex items-center justify-between rounded-lg bg-[oklch(0.12_0_0)] p-3">
                  <span className="text-sm text-muted-foreground">Interest Rate</span>
                  <span className="text-lg font-bold text-foreground">{product.interestRate}%</span>
                </div>
              )}
              {product.annualFee !== undefined && (
                <div className="flex items-center justify-between rounded-lg bg-[oklch(0.12_0_0)] p-3">
                  <span className="text-sm text-muted-foreground">Annual Fee</span>
                  <span className="text-lg font-bold text-foreground">
                    {product.annualFee === 0 ? "FREE" : `₹${product.annualFee}`}
                  </span>
                </div>
              )}
              {product.processingFee !== undefined && (
                <div className="flex items-center justify-between rounded-lg bg-[oklch(0.12_0_0)] p-3">
                  <span className="text-sm text-muted-foreground">Processing Fee</span>
                  <span className="text-lg font-bold text-foreground">{product.processingFee}%</span>
                </div>
              )}
              {product.returns && (
                <div className="flex items-center justify-between rounded-lg bg-[oklch(0.12_0_0)] p-3">
                  <span className="text-sm text-muted-foreground">Expected Returns</span>
                  <span className="text-lg font-bold text-foreground">{product.returns}</span>
                </div>
              )}
              {product.coverageAmount !== undefined && (
                <div className="flex items-center justify-between rounded-lg bg-[oklch(0.12_0_0)] p-3">
                  <span className="text-sm text-muted-foreground">Coverage</span>
                  <span className="text-lg font-bold text-foreground">
                    ₹{(product.coverageAmount / 100000).toFixed(0)}L
                  </span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              {product.applicationUrl && (
                <a
                  href={product.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-background transition-all hover:opacity-90"
                  style={{ backgroundColor: categoryColor }}
                >
                  {product.ctaLabel}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <Link
                href="/concierge"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[oklch(1_0_0_/_10%)] py-3 font-medium text-foreground transition-colors hover:bg-[oklch(0.12_0_0)]"
              >
                Ask Concierge
              </Link>
            </div>

            {/* Provider Info */}
            <div className="mt-6 border-t border-[oklch(1_0_0_/_8%)] pt-6">
              <div className="text-xs text-muted-foreground">Provided by</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{product.partnerName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
