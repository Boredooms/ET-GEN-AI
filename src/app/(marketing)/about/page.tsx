"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { 
  ArrowRight, 
  TrendingUp, 
  Brain, 
  Target, 
  Zap, 
  Shield, 
  BarChart3,
  Newspaper,
  Users,
  Sparkles,
  Clock,
  CheckCircle2
} from "lucide-react";

// Core features for bento grid
const FEATURES = [
  {
    title: "Live Market Intelligence",
    description: "Real-time signals from Nifty 50, BSE Sensex, and critical sectors. Track IT, Banking, Auto momentum with actionable invest/avoid signals.",
    icon: TrendingUp,
    gradient: "from-blue-500/10 to-cyan-500/10",
    size: "large", // spans 2 columns
  },
  {
    title: "AI Financial Concierge",
    description: "Context-aware conversations that understand your intent, retrieve relevant ET content, and guide you to action.",
    icon: Brain,
    gradient: "from-purple-500/10 to-pink-500/10",
    size: "large",
  },
  {
    title: "Investment DNA",
    description: "Unique identity card visualizing your knowledge level, risk sensitivity, and financial focus areas.",
    icon: Target,
    gradient: "from-orange-500/10 to-red-500/10",
    size: "medium",
  },
  {
    title: "Portfolio Analytics",
    description: "Custom donut charts with risk indicators. Visualize asset allocation with glassmorphic design.",
    icon: BarChart3,
    gradient: "from-green-500/10 to-emerald-500/10",
    size: "medium",
  },
  {
    title: "Smart News Curation",
    description: "ET's editorial depth, filtered to your interests. Never read an irrelevant article again.",
    icon: Newspaper,
    gradient: "from-indigo-500/10 to-violet-500/10",
    size: "medium",
  },
  {
    title: "Real-Time Context",
    description: "Not static data—live market momentum, sectoral signals, and instant intelligence updates.",
    icon: Zap,
    gradient: "from-yellow-500/10 to-amber-500/10",
    size: "medium",
  },
];

const STATS = [
  { value: "8M+", label: "ET Readers", subtext: "Massive ecosystem reach" },
  { value: "<3s", label: "Response Time", subtext: "Lightning-fast intelligence" },
  { value: "10+", label: "ET Products", subtext: "Seamlessly integrated" },
  { value: "Real-time", label: "Market Data", subtext: "Always current" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Profile in Minutes",
    description: "Tell us your role, interests, and goals. Our AI builds your Investment DNA in under 3 minutes.",
    icon: Users,
  },
  {
    step: "02",
    title: "Get Personalized Intelligence",
    description: "Receive curated ET content, market signals, and insights tailored to your unique profile.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Take Action",
    description: "Every insight ends with a clear next step—read, save, subscribe, or explore ET offerings.",
    icon: CheckCircle2,
  },
];

const INTEGRATIONS = [
  "Economic Times",
  "ET Prime",
  "ET Markets",
  "Zerodha",
  "Upstox",
  "ET Masterclasses",
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
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
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">About GENZET AI</span>
          </div>

          <h1 className="font-display mb-6 text-5xl tracking-tight text-foreground md:text-7xl">
            The Intelligence Layer
            <br />
            <span className="gradient-text">for Economic Times</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            We built GENZET AI to solve a critical problem: ET has world-class content, but users experience 
            only a fraction of it. We transform ET from a content destination into a personalized intelligence 
            and conversion engine.
          </p>
        </motion.div>
      </section>

      {/* The Problem & Solution */}
      <section className="border-t border-[oklch(1_0_0_/_6%)] py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.15_0_0)]">
                <Shield className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="mb-4 text-3xl font-editorial text-foreground">The Problem</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  Economic Times has built a powerful ecosystem: ET Prime, ET Markets, masterclasses, 
                  corporate events, wealth summits, and high-value editorial coverage.
                </p>
                <p>
                  Yet most users experience only a small part of it. The problem isn&apos;t a lack of 
                  content—it&apos;s discovery, relevance, and action.
                </p>
                <p className="text-foreground font-medium">
                  Users need a guide, not more content.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.15_0_0)]">
                <Sparkles className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="mb-4 text-3xl font-editorial text-foreground">The Solution</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  GENZET AI acts as a personal business concierge inside the ET experience. It learns 
                  your profile, understands your immediate goal, and takes you from curiosity to clarity to action.
                </p>
                <p>
                  Through AI-powered profiling and real-time intelligence, we create a unique journey for 
                  every user—turning ET into a personalized decision-guidance layer.
                </p>
                <p className="text-foreground font-medium">
                  One conversation. Complete ET intelligence.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="border-t border-[oklch(1_0_0_/_6%)] py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Core Capabilities
            </p>
            <h2 className="text-3xl font-editorial text-foreground md:text-4xl">
              Built for serious ET users
            </h2>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`card-hover rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0_0)] p-6 ${
                  feature.size === "large" ? "md:col-span-2" : ""
                }`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-[oklch(1_0_0_/_10%)] bg-gradient-to-br ${feature.gradient}`}>
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-[oklch(1_0_0_/_6%)] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-display text-foreground mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-foreground mb-0.5">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.subtext}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-[oklch(1_0_0_/_6%)] py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              How It Works
            </p>
            <h2 className="text-3xl font-editorial text-foreground md:text-4xl">
              Three steps to personalized intelligence
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0_0)] p-8"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-6 flex h-8 items-center justify-center rounded-md border border-[oklch(1_0_0_/_15%)] bg-foreground px-3 text-xs font-black text-background">
                  {item.step}
                </div>

                <div className="mt-4 mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.15_0_0)]">
                  <item.icon className="h-7 w-7 text-foreground" />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="border-t border-[oklch(1_0_0_/_6%)] py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Ecosystem Integration
            </p>
            <h2 className="text-3xl font-editorial text-foreground md:text-4xl">
              Seamlessly connects the ET universe
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {INTEGRATIONS.map((integration, i) => (
              <motion.div
                key={integration}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.11_0_0)] px-6 py-3 text-sm font-medium text-foreground"
              >
                {integration}
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
              Ready to experience personalized ET intelligence?
            </h2>
            <p className="mb-10 text-muted-foreground">
              Join thousands of readers who&apos;ve unlocked the full potential of Economic Times.
            </p>
            <Link
              href={ROUTES.ONBOARDING}
              className="group inline-flex h-12 items-center gap-3 rounded-md bg-foreground px-8 text-base font-semibold text-background transition-opacity hover:opacity-90"
            >
              Start Your Journey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
