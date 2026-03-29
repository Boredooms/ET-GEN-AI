"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ProductCard } from "@/components/ui/product-card";
import { Loader2, Search, Filter, SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Products", color: "oklch(0.5 0 0)" },
  { id: "creditCard", label: "Credit Cards", color: "oklch(0.6 0.15 270)" },
  { id: "loan", label: "Loans", color: "oklch(0.6 0.15 220)" },
  { id: "insurance", label: "Insurance", color: "oklch(0.6 0.15 142)" },
  { id: "investment", label: "Investments", color: "oklch(0.65 0.15 85)" },
  { id: "savings", label: "Savings", color: "oklch(0.6 0.15 180)" },
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const allProducts = useQuery(
    api.financialProducts.listProducts,
    { isActive: true }
  );

  const searchResults = useQuery(
    api.financialProducts.searchProducts,
    searchQuery.length >= 3 ? { searchTerm: searchQuery } : "skip"
  );

  const isLoading = allProducts === undefined;

  // Filter products
  const filteredProducts = (() => {
    if (searchQuery.length >= 3 && searchResults) {
      return searchResults;
    }
    
    if (!allProducts) return [];

    if (selectedCategory === "all") {
      return allProducts;
    }

    return allProducts.filter((p: any) => p.category === selectedCategory);
  })();

  // Group by category for display
  const productsByCategory = filteredProducts.reduce((acc: any, product: any) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-editorial text-3xl text-foreground">Services Marketplace</h1>
        <p className="text-muted-foreground">
          Discover financial products curated for you. Compare, analyze, and apply with confidence.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, providers, features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.09_0_0)] pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[oklch(1_0_0_/_20%)] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex h-11 items-center gap-2 rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.09_0_0)] px-4 text-sm font-medium text-foreground transition-colors hover:bg-[oklch(0.12_0_0)]"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? "text-background"
                : "border border-[oklch(1_0_0_/_10%)] text-foreground hover:bg-[oklch(0.12_0_0)]"
            }`}
            style={
              selectedCategory === category.id
                ? { backgroundColor: category.color }
                : {}
            }
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">No products found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? "Try adjusting your search terms" : "No products in this category"}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(productsByCategory).map(([category, products]: [string, any]) => {
            const categoryInfo = CATEGORIES.find((c) => c.id === category);
            if (!categoryInfo || category === "all") return null;

            return (
              <section key={category}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-foreground">{categoryInfo.label}</h2>
                  <span className="rounded-full bg-[oklch(0.15_0_0)] px-2 py-0.5 text-xs text-muted-foreground">
                    {products.length} {products.length === 1 ? "product" : "products"}
                  </span>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Featured Products Footer */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="mt-12 rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-gradient-to-br from-[oklch(0.15_0_0)] to-[oklch(0.09_0_0)] p-8 text-center">
          <h3 className="mb-2 text-xl font-bold text-foreground">Need personalized recommendations?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Chat with our AI concierge to get product matches based on your financial profile.
          </p>
          <a
            href="/concierge"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-semibold text-background transition-opacity hover:opacity-90"
          >
            Talk to Concierge
          </a>
        </div>
      )}
    </div>
  );
}
