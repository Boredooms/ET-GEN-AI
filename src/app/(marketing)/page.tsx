"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { ArrowRight, TrendingUp, Newspaper, Zap, Shield } from "lucide-react";

const HERO_WORDS = ["Understand.", "Guide.", "Convert."];

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Market Intelligence",
    description: "Real-time signals, sector moves, and financial coverage — personalized to your portfolio focus.",
  },
  {
    icon: Newspaper,
    title: "Smart News Curation",
    description: "ET's editorial depth, filtered to your interests. Never read an irrelevant article again.",
  },
  {
    icon: Zap,
    title: "Action-Oriented",
    description: "Every response ends with a clear next step — read, save, subscribe, or explore ET offerings.",
  },
  {
    icon: Shield,
    title: "Trust-First Design",
    description: "Finance-grade guardrails. Every recommendation is explainable, every source is cited.",
  },
];

const DEMO_EXCHANGES = [
  { role: "user", text: "What's the best ET product for a retail investor like me?" },
  {
    role: "assistant",
    text: "Based on your profile, ET Prime Markets gives you the most leverage — deep sector analysis, corporate filing briefs, and exclusive fund manager interviews. Most investors in your bracket see 3× more decision-quality data.",
  },
  { role: "user", text: "Show me what's moving today in IT stocks." },
  {
    role: "assistant",
    text: "**IT Sector: +1.43% today.** TCS led gains after Q4 results beat estimates by 8%. The AI services narrative is gaining institutional attention. Here are the 3 most relevant stories from ET Markets →",
  },
];

const STATS = [
  { value: "8M+", label: "ET readers" },
  { value: "3 min", label: "to personalize" },
  { value: "10+", label: "ET products surfaced" },
  { value: "Real-time", label: "market signals" },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, oklch(0.94 0 0), transparent)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl"
        >
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.11_0_0)] px-4 py-1.5">
            <span className="et-badge">ET Hackathon</span>
            <span className="text-xs text-muted-foreground">AI Concierge for Economic Times</span>
          </div>

          {/* Headline */}
          <h1 className="font-display mb-6 text-5xl tracking-tight text-foreground md:text-7xl">
            Your Personal
            <br />
            <span className="gradient-text">Business Concierge</span>
            <br />
            for ET
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            GENZET AI understands who you are in one conversation and guides you to the right news,
            market intelligence, and financial opportunities across the ET ecosystem.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="group inline-flex h-12 items-center gap-2.5 rounded-md bg-foreground px-7 text-sm font-semibold text-background transition-all hover:opacity-90"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={ROUTES.DEMO}
              className="inline-flex h-12 items-center gap-2 rounded-md border border-[oklch(1_0_0_/_12%)] px-7 text-sm text-muted-foreground transition-all hover:border-[oklch(1_0_0_/_25%)] hover:text-foreground"
            >
              View Demo
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Stats Strip ─────────────────────────────────────────────── */}
      <section className="border-y border-[oklch(1_0_0_/_6%)] py-8">
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
                <div className="text-2xl font-display text-foreground">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Demo Preview ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                See it in action
              </p>
              <h2 className="mb-4 text-3xl font-editorial text-foreground md:text-4xl">
                One conversation.
                <br />
                Complete ET intelligence.
              </h2>
              <p className="mb-8 text-muted-foreground leading-relaxed">
                Tell GENZET AI what you care about. It identifies your intent, retrieves the right ET
                content, and guides you from curiosity to action in minutes.
              </p>
              <Link
                href={ROUTES.CONCIERGE}
                className="group inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Try the Concierge
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Chat preview card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0_0)] p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="h-5 w-5 rounded-sm bg-foreground flex items-center justify-center">
                  <span className="text-[8px] font-black text-background">G</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">GENZET AI Concierge</span>
                <div className="ml-auto flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground">Live</span>
                </div>
              </div>

              <div className="space-y-4">
                {DEMO_EXCHANGES.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.2 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[oklch(0.19_0_0)] text-foreground"
                          : "bg-[oklch(0.15_0_0)] text-foreground border border-[oklch(1_0_0_/_6%)]"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-[oklch(1_0_0_/_6%)]">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Why GENZET
            </p>
            <h2 className="text-3xl font-editorial text-foreground md:text-4xl">
              Built for serious ET users
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-hover rounded-xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.11_0_0)] p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.15_0_0)]">
                  <feature.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-editorial text-foreground md:text-5xl">
              Your ET journey starts with one question.
            </h2>
            <p className="mb-10 text-muted-foreground">
              Three minutes of profiling. A lifetime of personalized intelligence.
            </p>
            <Link
              href={ROUTES.ONBOARDING}
              className="group inline-flex h-13 items-center gap-3 rounded-md bg-foreground px-8 text-base font-semibold text-background transition-opacity hover:opacity-90"
            >
              Start Now — It&apos;s Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
