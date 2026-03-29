# AGENT.md — GENZET AI BUILD AGENT OPERATING MANUAL

This file defines how the coding agent should plan, build, review, and ship this project like a senior engineer.

---

## 1) Mission

Build **GENZET AI** as a polished, production-style Economic Times concierge product:
- premium website experience
- intelligent multi-step agent workflows
- grounded answers with citations
- clean business-first UI
- deployable MVP with a clear demo path

The goal is not to make a flashy AI demo. The goal is to make a product that feels real, useful, and shippable.

---

## 2) Non-Negotiable Principles

### Build like a product team, not a prompt toy
- Every feature must solve a real user problem.
- Every page must have a clear purpose.
- Every agent action must be explainable.
- Every UI element must improve decision-making or conversion.

### Do not generate generic AI slop
Avoid:
- random gradient-heavy layouts
- excessive animations
- noisy icon walls
- text-heavy empty screens
- fake dashboards with no logic
- over-designed chatbot bubbles that look like prototypes

### Favor clarity over novelty
- Use restrained design.
- Use strong hierarchy.
- Use business-like spacing.
- Make every screen feel like an ET-grade consumer product.

---

## 3) Product Definition

### Core product
A web-based AI concierge for Economic Times that:
- understands who the user is
- recommends the right ET content and services
- helps with money, markets, news, learning, and ET ecosystem discovery
- guides the user from question → insight → action

### Winning user promise
“Tell us what you care about, and we will show you the right business intelligence and the right next action.”

---

## 4) Build Strategy

### First build the experience
Before code:
- define the user journeys
- define the page routes
- define the conversation states
- define the actions the agent can take
- define the business outcomes

### Then build the intelligence layer
- retrieval
- memory
- tool calling
- structured outputs
- safe action execution

### Then polish the interface
- make the experience look premium
- make the product easy to understand in 5 seconds
- make the demo obvious to judges

---

## 5) Required Website Structure

The agent should build and maintain these routes:

### Public routes
- `/` — landing page
- `/how-it-works` — product explanation
- `/demo` — guided interactive demo
- `/explore` — content discovery surface
- `/pricing` — monetization / premium positioning
- `/privacy` — trust and safety

### Authenticated routes
- `/onboarding` — smart profiling
- `/assistant` — main concierge chat
- `/dashboard` — user summary and recommendations
- `/insights` — saved insights, watchlists, and reports
- `/profile` — user preferences and history
- `/settings` — language, notifications, privacy

### Internal/admin routes
- `/admin/content` — ingestion and content review
- `/admin/metrics` — engagement and conversion analytics
- `/admin/audit` — agent decision logs
- `/admin/prompts` — prompt/version management

---

## 6) Design Rules

### The UI must feel premium
- business-first, not toy-like
- strong typography
- consistent spacing
- limited color palette
- subtle borders, subtle depth
- clean cards, not crowded tiles

### The UI should look like a real ET product
Use:
- structured sections
- editorial layouts
- recommendation panels
- insight cards
- market-style modules
- clean conversation shell

### Page composition rules
Each screen must have:
- one main action
- one supporting narrative
- one clear next step

### Avoid
- random widgets everywhere
- too many buttons
- dark/light inconsistency
- noisy AI-generated art
- vague placeholder content

---

## 7) Agent Behavior Rules

### The assistant must behave like a concierge
It should:
- ask short profiling questions
- remember context
- recommend with confidence
- explain why something is recommended
- suggest next best actions
- never overwhelm the user

### The assistant must not hallucinate
If it does not know:
- it should retrieve
- it should say it is unsure
- it should not invent facts

### The assistant must be action-aware
It should be able to:
- fetch relevant articles
- summarize news
- compare options
- create personalized paths
- trigger safe actions only after confirmation

---

## 8) MCP / Tooling Approach

Use MCP-style thinking for everything:
- each tool does one job
- each agent gets a narrow purpose
- each action is explicit and auditable

### Recommended tool categories
- content retrieval
- user profile memory
- recommendations
- calculations
- citations
- logging
- publishing/actions

### Tool discipline
Before adding any tool:
- define the input schema
- define the output schema
- define the failure behavior
- define when it should be called
- define what data it can and cannot touch

### Tool quality bar
A tool is valid only if it:
- produces predictable output
- is easy to test
- improves user value
- can be logged and explained

---

## 9) Coding Standards

### Code must be readable
- use meaningful names
- keep files small
- separate concerns
- avoid deep nesting
- avoid magic constants

### Prefer explicit over clever
- explicit routing
- explicit state handling
- explicit validation
- explicit error paths

### Reusable patterns
- shared UI components
- shared prompts
- shared schemas
- shared agent utilities
- shared logging helpers

### No dead code
Remove:
- unused components
- unused styles
- stale experiments
- duplicate logic

---

## 10) Data and Memory Rules

### Data types
The system may store:
- user profile data
- conversation memory
- saved recommendations
- article metadata
- audit logs
- metrics
- content embeddings

### Memory behavior
- short-term memory for current conversation
- long-term memory for recurring preferences
- no sensitive data without consent
- no hidden memory surprises

### Retrieval behavior
- retrieve before answering
- cite the source where possible
- prefer grounded answers over fluent guesses

---

## 11) Content and RAG Rules

### Content ingestion
The system should ingest:
- ET articles
- editorial explainers
- market updates
- event listings
- premium product pages
- service catalogs

### Retrieval policy
When the user asks a question:
1. classify intent
2. fetch relevant sources
3. rank by relevance and freshness
4. summarize with context
5. show citations or source hints

### Ranking rules
Prioritize:
- recency for news
- relevance for profile-based recommendations
- trust for finance-related queries
- explainability for decision-making tasks

---

## 12) UX Rules for Chat + Web

### Chat should not feel like a dead-end
Every response should do at least one of these:
- answer
- recommend
- compare
- guide
- act

### Good chat output patterns
- concise answer
- short reasoning
- follow-up suggestions
- inline cards
- action buttons
- source labels

### Good web patterns
- landing page with strong value proposition
- profile-driven dashboard
- editorial recommendation cards
- explorable insights
- action-oriented CTAs

---

## 13) Development Workflow

### For every feature
1. understand the user need
2. write the route and state flow
3. define the agent/tool behavior
4. build the UI skeleton
5. connect data
6. test end-to-end
7. refine design
8. log the result

### Before merge
Check:
- no broken routes
- no fake data leaks into production screens
- no unhandled errors
- no layout regressions
- no unreadable mobile views
- no missing loading states

---

## 14) Demo Quality Rules

The final demo must show:
- a real user enters
- the assistant profiles them
- the system retrieves relevant info
- the agent recommends something useful
- the user takes a next step
- the business value is visible

The demo should feel like:
“this could ship next quarter.”

---

## 15) Safety and Trust Rules

### For finance-related flows
- avoid direct regulated advice language
- keep recommendations explainable
- show assumptions
- provide citations or source context
- allow user confirmation before action

### For trust
- show why a recommendation was made
- keep audit logs
- make privacy controls visible
- keep user control obvious

---

## 16) Definition of Done

A feature is only done when:
- it works end to end
- it looks polished
- it is explainable
- it is testable
- it supports the product story
- it helps the business case

---

## 17) Final Rule

Build the product so that a judge, investor, or editor can understand it instantly:
- what it does
- why it matters
- how it works
- why it is better
- why it can ship

If a screen, tool, or flow does not help with that story, remove it.
