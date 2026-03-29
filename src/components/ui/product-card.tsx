"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    partnerName: string;
    description: string;
    category: string;
    subCategory: string;
    features?: string[];
    bestFor?: string[];
    isFeatured: boolean;
    ctaLabel: string;
    applicationUrl?: string;
    interestRate?: number;
    annualFee?: number;
    returns?: string;
  };
  matchScore?: number;
  showMatchScore?: boolean;
  compact?: boolean;
}

export function ProductCard({ product, matchScore, showMatchScore = false, compact = false }: ProductCardProps) {
  const categoryColors: Record<string, string> = {
    creditCard: "oklch(0.6 0.15 270)", // Purple
    loan: "oklch(0.6 0.15 220)", // Blue
    insurance: "oklch(0.6 0.15 142)", // Green
    investment: "oklch(0.65 0.15 85)", // Yellow
    savings: "oklch(0.6 0.15 180)", // Cyan
  };

  const categoryColor = categoryColors[product.category] || "oklch(0.5 0 0)";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-5 transition-all hover:border-[oklch(1_0_0_/_15%)] hover:bg-[oklch(0.11_0_0)]">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            {product.isFeatured && (
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            )}
            <span 
              className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
              style={{ 
                backgroundColor: `color-mix(in oklch, ${categoryColor} 15%, transparent)`,
                color: categoryColor 
              }}
            >
              {product.subCategory}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.partnerName}</p>
        </div>
        {showMatchScore && matchScore !== undefined && (
          <div className="ml-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2" 
               style={{ borderColor: categoryColor }}>
            <div className="text-center">
              <div className="text-sm font-bold text-foreground">{matchScore}</div>
              <div className="text-[8px] text-muted-foreground">MATCH</div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className={`text-sm text-muted-foreground ${compact ? "line-clamp-2" : "line-clamp-3"} mb-4`}>
        {product.description}
      </p>

      {/* Key Features */}
      {!compact && product.features && product.features.length > 0 && (
        <div className="mb-4 space-y-1">
          {product.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full" 
                    style={{ backgroundColor: categoryColor }} />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Financial Highlights */}
      <div className="mb-4 flex flex-wrap gap-3">
        {product.interestRate !== undefined && (
          <div className="rounded-lg bg-[oklch(0.12_0_0)] px-3 py-1.5">
            <div className="text-[10px] text-muted-foreground">Interest Rate</div>
            <div className="text-sm font-semibold text-foreground">{product.interestRate}%</div>
          </div>
        )}
        {product.annualFee !== undefined && (
          <div className="rounded-lg bg-[oklch(0.12_0_0)] px-3 py-1.5">
            <div className="text-[10px] text-muted-foreground">Annual Fee</div>
            <div className="text-sm font-semibold text-foreground">
              {product.annualFee === 0 ? "FREE" : `₹${product.annualFee}`}
            </div>
          </div>
        )}
        {product.returns && (
          <div className="rounded-lg bg-[oklch(0.12_0_0)] px-3 py-1.5">
            <div className="text-[10px] text-muted-foreground">Expected Returns</div>
            <div className="text-sm font-semibold text-foreground">{product.returns}</div>
          </div>
        )}
      </div>

      {/* Tags */}
      {product.bestFor && product.bestFor.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {product.bestFor.slice(0, 4).map((tag, idx) => (
            <span 
              key={idx}
              className="rounded-full bg-[oklch(0.15_0_0)] px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-2">
        <Link
          href={`/marketplace/${product._id}`}
          className="flex-1 rounded-lg border border-[oklch(1_0_0_/_10%)] py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-[oklch(0.15_0_0)]"
        >
          View Details
        </Link>
        {product.applicationUrl && (
          <a
            href={product.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-background transition-all"
            style={{ backgroundColor: categoryColor }}
          >
            {product.ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
          </a>
        )}
      </div>
    </div>
  );
}
