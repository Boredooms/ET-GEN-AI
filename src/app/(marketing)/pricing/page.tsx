"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { 
  Check, 
  ArrowRight, 
  Zap, 
  Building2, 
  Crown,
  Shield,
  Clock,
  TrendingUp,
  Sparkles,
  Users,
  Lock,
  HelpCircle
} from "lucide-react";
import { useState } from "react";

const PRICING_TIERS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for exploring ET intelligence",
    icon: Sparkles,
    features: [
      "Basic market data (15-min delay)",
      "5 AI concierge queries per day",
      "Personalized news feed",
      "Investment DNA profile",
      "Access to ET content library",
      "Mobile & web access",
    ],
    cta: "Get Started",
    ctaLink: ROUTES.ONBOARDING,
    highlighted: false,
    badge: null,
  },
  {
    name: "ET Prime Integration",
    price: "₹299",
    period: "per month",
    description: "Unlock premium ET ecosystem features",
    icon: Crown,
    features: [
      "Everything in Free",
      "Real-time market data",
      "Unlimited AI concierge queries",
      "Advanced portfolio analytics",
      "ET Prime content access",
      "Sector-specific insights",
      "Priority signal alerts",
      "Weekly intelligence reports",
      "Masterclass recommendations",
    ],
    cta: "Start Free Trial",
    ctaLink: ROUTES.ONBOARDING,
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Professional",
    price: "₹999",
    period: "per month",
    description: "For serious investors and traders",
    icon: TrendingUp,
    features: [
      "Everything in ET Prime",
      "Real-time API access",
      "Custom watchlists (unlimited)",
      "Advanced technical indicators",
      "Portfolio sync (Zerodha, Upstox)",
      "Expert analyst insights",
      "Custom AI models",
      "1-on-1 onboarding session",
      "Priority support",
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
    highlighted: false,
    badge: null,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For institutions and teams",
    icon: Building2,
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Team collaboration tools",
      "Custom integrations",
      "White-label options",
      "SLA guarantees",
      "Advanced security & compliance",
      "Custom reporting dashboards",
      "Unlimited seats",
    ],
    cta: "Talk to Us",
    ctaLink: "/contact",
    highlighted: false,
    badge: null,
  },
];

const FEATURE_COMPARISON = [
  {
    category: "Core Features",
    features: [
      { name: "Investment DNA Profile", free: true, prime: true, pro: true, enterprise: true },
      { name: "Personalized News Feed", free: true, prime: true, pro: true, enterprise: true },
      { name: "AI Concierge", free: "5/day", prime: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Market Data", free: "15-min delay", prime: "Real-time", pro: "Real-time + API", enterprise: "Real-time + API" },
    ],
  },
  {
    category: "Analytics",
    features: [
      { name: "Portfolio Analytics", free: "Basic", prime: "Advanced", pro: "Advanced + Custom", enterprise: "Advanced + Custom" },
      { name: "Sector Insights", free: false, prime: true, pro: true, enterprise: true },
      { name: "Technical Indicators", free: false, prime: "Standard", pro: "Advanced", enterprise: "Advanced + Custom" },
      { name: "Custom Reports", free: false, prime: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "Support & Services",
    features: [
      { name: "Email Support", free: true, prime: true, pro: "Priority", enterprise: "24/7 Dedicated" },
      { name: "Onboarding Session", free: false, prime: false, pro: "1-on-1", enterprise: "Team" },
      { name: "Account Manager", free: false, prime: false, pro: false, enterprise: true },
      { name: "SLA", free: false, prime: false, pro: false, enterprise: true },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "How does the ET Prime integration work?",
    answer: "Our ET Prime Integration tier gives you access to premium ET content, real-time market data, and unlimited AI queries. If you're already an ET Prime subscriber, you can link your account for seamless access.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades apply at the end of your current billing cycle.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes, we offer a 14-day free trial for the ET Prime Integration and Professional tiers. No credit card required to start.",
  },
  {
    question: "How does portfolio sync work?",
    answer: "Professional and Enterprise users can securely connect their Zerodha or Upstox accounts to automatically sync portfolio data and receive personalized insights based on actual holdings.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. Enterprise customers can also opt for invoice-based billing.",
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. We use bank-grade encryption, never store your trading credentials, and are fully compliant with Indian data protection regulations. All portfolio sync happens through secure OAuth.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, oklch(0.94 0 0), transparent)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.11_0_0)] px-4 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pricing</span>
          </div>

          <h1 className="font-display mb-6 text-5xl tracking-tight text-foreground md:text-7xl">
            Intelligence for
            <br />
            <span className="gradient-text">Every Investor</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            From casual readers to professional traders, we have a plan that fits your needs. 
            Start free, upgrade when ready.
          </p>
        </motion.div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PRICING_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-xl border p-8 ${
                  tier.highlighted
                    ? "border-foreground bg-[oklch(0.15_0_0)] shadow-[0_0_40px_rgba(234,234,234,0.1)]"
                    : "border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0_0)]"
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="rounded-full border border-foreground bg-foreground px-3 py-1 text-xs font-semibold text-background">
                      {tier.badge}
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.15_0_0)]">
                  <tier.icon className="h-6 w-6 text-foreground" />
                </div>

                {/* Name */}
                <h3 className="mb-2 text-2xl font-semibold text-foreground">{tier.name}</h3>
                <p className="mb-6 text-sm text-muted-foreground">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display text-foreground">{tier.price}</span>
                    {tier.period !== "contact us" && (
                      <span className="text-sm text-muted-foreground">/{tier.period}</span>
                    )}
                  </div>
                  {tier.period === "contact us" && (
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={tier.ctaLink}
                  className={`mb-8 flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all ${
                    tier.highlighted
                      ? "bg-foreground text-background hover:opacity-90"
                      : "border border-[oklch(1_0_0_/_15%)] bg-[oklch(0.15_0_0)] text-foreground hover:border-[oklch(1_0_0_/_30%)]"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Features */}
                <div className="space-y-3">
                  {tier.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="border-t border-[oklch(1_0_0_/_6%)] py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Detailed Comparison
            </p>
            <h2 className="text-3xl font-editorial text-foreground md:text-4xl">
              Compare all features
            </h2>
          </motion.div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="mb-4 grid grid-cols-5 gap-4 rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0_0)] p-4">
                <div className="text-sm font-semibold text-foreground">Features</div>
                <div className="text-center text-sm font-semibold text-foreground">Free</div>
                <div className="text-center text-sm font-semibold text-foreground">ET Prime</div>
                <div className="text-center text-sm font-semibold text-foreground">Professional</div>
                <div className="text-center text-sm font-semibold text-foreground">Enterprise</div>
              </div>

              {/* Feature rows by category */}
              {FEATURE_COMPARISON.map((category, i) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="mb-6"
                >
                  <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {category.category}
                  </div>
                  <div className="space-y-2">
                    {category.features.map((feature, j) => (
                      <div
                        key={j}
                        className="grid grid-cols-5 gap-4 rounded-lg border border-[oklch(1_0_0_/_6%)] bg-[oklch(0.09_0_0)] p-4"
                      >
                        <div className="text-sm text-foreground">{feature.name}</div>
                        <div className="flex justify-center">
                          {typeof feature.free === "boolean" ? (
                            feature.free ? (
                              <Check className="h-4 w-4 text-foreground" />
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )
                          ) : (
                            <span className="text-xs text-muted-foreground">{feature.free}</span>
                          )}
                        </div>
                        <div className="flex justify-center">
                          {typeof feature.prime === "boolean" ? (
                            feature.prime ? (
                              <Check className="h-4 w-4 text-foreground" />
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )
                          ) : (
                            <span className="text-xs text-muted-foreground">{feature.prime}</span>
                          )}
                        </div>
                        <div className="flex justify-center">
                          {typeof feature.pro === "boolean" ? (
                            feature.pro ? (
                              <Check className="h-4 w-4 text-foreground" />
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )
                          ) : (
                            <span className="text-xs text-muted-foreground">{feature.pro}</span>
                          )}
                        </div>
                        <div className="flex justify-center">
                          {typeof feature.enterprise === "boolean" ? (
                            feature.enterprise ? (
                              <Check className="h-4 w-4 text-foreground" />
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )
                          ) : (
                            <span className="text-xs text-muted-foreground">{feature.enterprise}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-t border-[oklch(1_0_0_/_6%)] py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Bank-Grade Security",
                description: "Your data is encrypted and protected with industry-leading security standards.",
              },
              {
                icon: Lock,
                title: "Privacy First",
                description: "We never share your financial data. Full compliance with Indian data protection laws.",
              },
              {
                icon: Clock,
                title: "Cancel Anytime",
                description: "No long-term commitments. Cancel or change your plan whenever you want.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0_0)] p-6 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.15_0_0)]">
                    <item.icon className="h-6 w-6 text-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-[oklch(1_0_0_/_6%)] py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              FAQ
            </p>
            <h2 className="text-3xl font-editorial text-foreground md:text-4xl">
              Frequently asked questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0_0)]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-[oklch(0.13_0_0)]"
                >
                  <span className="pr-4 text-base font-semibold text-foreground">{item.question}</span>
                  <HelpCircle
                    className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-[oklch(1_0_0_/_6%)] px-6 py-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[oklch(1_0_0_/_6%)] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-editorial text-foreground md:text-5xl">
              Start with free. Upgrade when ready.
            </h2>
            <p className="mb-10 text-muted-foreground">
              No credit card required. Get personalized ET intelligence in minutes.
            </p>
            <Link
              href={ROUTES.ONBOARDING}
              className="group inline-flex h-12 items-center gap-3 rounded-md bg-foreground px-8 text-base font-semibold text-background transition-opacity hover:opacity-90"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
