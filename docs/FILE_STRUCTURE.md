# FILE_STRUCTURE.md
# GENZET AI — Production-Grade Repo Structure

> Goal: make the project feel like a real, senior-built product repo — clean, scalable, deployable, and easy to extend.

This structure is designed for the current Next.js app that already contains:

- `src/app`
- `src/components`
- `src/config`
- `src/hooks`
- `src/lib`
- `src/types`
- `src/utils`
- `docs/`

The idea is to keep the existing frontend clean while adding a proper backend, agent layer, data pipelines, and deployment-ready boundaries.

---

## 1) High-Level Architecture

The repo should be organized into 5 clear zones:

1. **Frontend/UI**
   - pages, layouts, components, motion, design system
2. **Backend/API**
   - route handlers, server actions, auth, agent endpoints
3. **AI/Agent Layer**
   - orchestration, tools, prompts, workflows, RAG
4. **Data Layer**
   - schemas, DB access, embeddings, ingestion, queues
5. **Ops/Docs**
   - environment, deployment, prompts, architecture, contribution rules

This keeps the product from becoming an "AI-generated spaghetti repo".

---

## 2) Recommended Final Folder Structure

```txt
.
├── .next/
├── docs/
│   ├── .copilot-instructions.md
│   ├── AGENTS.md
│   ├── Architecture.md
│   ├── CLAUDE.md
│   ├── Design.md
│   ├── Idea.md
│   ├── Implementation_Plan.md
│   ├── PROJECT STRUCTURE.md
│   ├── Technicals.md
│   └── FILE_STRUCTURE.md
├── public/
│   ├── images/
│   ├── icons/
│   ├── videos/
│   ├── illustrations/
│   └── assets/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── callback/page.tsx
│   │   ├── (app)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── concierge/page.tsx
│   │   │   ├── feed/page.tsx
│   │   │   ├── insights/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── health/route.ts
│   │   │   ├── chat/route.ts
│   │   │   ├── agent/route.ts
│   │   │   ├── ingest/route.ts
│   │   │   ├── search/route.ts
│   │   │   ├── profile/route.ts
│   │   │   ├── feedback/route.ts
│   │   │   └── webhooks/route.ts
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── sections/
│   │   ├── cards/
│   │   ├── charts/
│   │   ├── forms/
│   │   ├── chat/
│   │   ├── motion/
│   │   ├── concierge/
│   │   └── shared/
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── routes.ts
│   │   ├── constants.ts
│   │   ├── navigation.ts
│   │   ├── pricing.ts
│   │   └── feature-flags.ts
│   │
│   ├── hooks/
│   │   ├── use-chat.ts
│   │   ├── use-debounce.ts
│   │   ├── use-mobile.ts
│   │   ├── use-theme.ts
│   │   ├── use-user-profile.ts
│   │   └── use-streaming-response.ts
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── orchestrator.ts
│   │   │   ├── prompts.ts
│   │   │   ├── tools.ts
│   │   │   ├── schemas.ts
│   │   │   ├── memory.ts
│   │   │   └── safety.ts
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── migrations/
│   │   ├── rag/
│   │   │   ├── chunking.ts
│   │   │   ├── embeddings.ts
│   │   │   ├── retrieval.ts
│   │   │   ├── ranking.ts
│   │   │   └── citations.ts
│   │   ├── services/
│   │   │   ├── et-content.ts
│   │   │   ├── market-data.ts
│   │   │   ├── notifications.ts
│   │   │   └── analytics.ts
│   │   ├── utils/
│   │   │   ├── format.ts
│   │   │   ├── dates.ts
│   │   │   ├── text.ts
│   │   │   └── logger.ts
│   │   └── validators/
│   │       ├── profile.ts
│   │       ├── chat.ts
│   │       └── actions.ts
│   │
│   ├── types/
│   │   ├── chat.ts
│   │   ├── profile.ts
│   │   ├── agent.ts
│   │   ├── content.ts
│   │   ├── market.ts
│   │   └── api.ts
│   │
│   └── utils/
│       ├── cn.ts
│       ├── error.ts
│       ├── security.ts
│       ├── response.ts
│       └── analytics.ts
│
├── backend/
│   ├── README.md
│   ├── agents/
│   │   ├── concierge-agent.ts
│   │   ├── profile-agent.ts
│   │   ├── content-agent.ts
│   │   ├── market-agent.ts
│   │   ├── recommendation-agent.ts
│   │   └── action-agent.ts
│   ├── workflows/
│   │   ├── onboarding.workflow.ts
│   │   ├── daily-brief.workflow.ts
│   │   ├── search.workflow.ts
│   │   └── cross-sell.workflow.ts
│   ├── ingestion/
│   │   ├── fetch-et-content.ts
│   │   ├── parse-articles.ts
│   │   ├── generate-embeddings.ts
│   │   └── index-content.ts
│   ├── jobs/
│   │   ├── scheduled-sync.ts
│   │   ├── trending-refresh.ts
│   │   └── cleanup.ts
│   ├── integrations/
│   │   ├── gemini.ts
│   │   ├── convex.ts
│   │   ├── supabase.ts
│   │   ├── openrouter.ts
│   │   └── webhook-client.ts
│   └── scripts/
│       ├── seed.ts
│       ├── migrate.ts
│       └── test-agent.ts
│
├── convex/
│   ├── _generated/
│   ├── schema.ts
│   ├── users.ts
│   ├── sessions.ts
│   ├── conversations.ts
│   ├── profiles.ts
│   ├── content.ts
│   ├── recommendations.ts
│   ├── feedback.ts
│   └── search.ts
│
├── prompts/
│   ├── system/
│   ├── agents/
│   ├── tools/
│   ├── safety/
│   └── examples/
│
├── scripts/
│   ├── build-index.ts
│   ├── sync-content.ts
│   ├── generate-sitemap.ts
│   └── check-env.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
│
├── .env.example
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prettier.config.mjs
├── tsconfig.json
└── README.md
```

---

## 3) What Each Major Area Does

### `src/app`
This is the website itself.

Use it for:
- landing pages
- onboarding flows
- dashboards
- chat pages
- profile pages
- settings pages
- API route handlers

Recommended route groups:
- `(marketing)` for public pages
- `(auth)` for login/signup
- `(app)` for authenticated product experience

That keeps routes clean and avoids mixing the public site with the logged-in app.

---

### `src/components`
This is where all visual building blocks live.

Use subfolders like:
- `ui/` → button, card, dialog, tabs, dropdowns
- `layout/` → header, sidebar, footer
- `sections/` → hero sections, feature blocks
- `chat/` → message bubbles, typing indicator, prompt chips
- `motion/` → animated wrappers, reveal effects, page transitions
- `concierge/` → ET-specific AI widgets
- `charts/` → trend lines, radial scores, market cards

Rule: do not put page-specific logic here. Keep it reusable.

---

### `src/lib`
This is the real engine room.

Use it for:
- AI orchestration
- RAG retrieval
- database access
- content services
- formatting utilities
- validation schemas

A strong separation here makes the project maintainable.

---

### `backend/`
This folder is for anything that should feel like a separate backend layer.

Use it for:
- long-running agent workflows
- content ingestion
- embeddings generation
- scheduled jobs
- integrations
- scripts

Even if the main app is Next.js, this folder keeps your backend logic readable and deployable.

---

### `convex/`
Use Convex for:
- realtime user state
- conversation history
- saved preferences
- recommendations
- feedback
- search metadata

This is great for a live AI product because it reduces backend boilerplate and handles sync well.

---

### `prompts/`
Never hardcode prompts deep inside components.

Store them separately for:
- system prompts
- agent prompts
- tool prompts
- safety prompts
- few-shot examples

That makes prompt iteration much easier.

---

### `tests/`
Keep quality high from day one:
- unit tests for pure functions
- integration tests for APIs
- e2e tests for critical journeys

---

## 4) Backend and Frontend Boundary

### Frontend
The frontend should only handle:
- UI rendering
- user interaction
- animation
- client state
- request submission
- display of agent results

### Backend
The backend should handle:
- authentication checks
- agent reasoning
- database writes
- ET content ingestion
- RAG retrieval
- audit logs
- API integrations
- scheduled tasks

Never let frontend code own business logic.

---

## 5) Suggested Page Map

### Public pages
- `/`
- `/about`
- `/pricing`
- `/contact`

### Auth pages
- `/login`
- `/signup`
- `/callback`

### Product pages
- `/dashboard`
- `/concierge`
- `/feed`
- `/insights`
- `/profile`
- `/settings`

### Admin / internal pages
- `/admin`
- `/admin/content`
- `/admin/analytics`
- `/admin/prompts`
- `/admin/feedback`

### API routes
- `/api/health`
- `/api/chat`
- `/api/agent`
- `/api/ingest`
- `/api/search`
- `/api/profile`
- `/api/feedback`
- `/api/webhooks`

---

## 6) Deployment-Ready Structure

### For Vercel
Best for:
- Next.js frontend
- route handlers
- server actions
- light backend logic

### For Convex
Best for:
- realtime DB
- sync
- app state
- conversation memory

### For a separate worker backend
Use this for:
- scheduled ingestion
- crawling
- embedding generation
- heavy jobs

That can later move to:
- Railway
- Render
- Cloud Run
- ECS

---

## 7) Suggested Clean Additions to the Existing Repo

Your current repo already has a good base. Add these next:

```txt
src/app/(marketing)/
src/app/(auth)/
src/app/(app)/
src/app/api/

src/components/ui/
src/components/chat/
src/components/motion/
src/components/concierge/
src/components/layout/

src/lib/ai/
src/lib/db/
src/lib/rag/
src/lib/services/
src/lib/validators/

backend/agents/
backend/workflows/
backend/ingestion/
backend/integrations/

convex/
prompts/
tests/
```

---

## 8) Naming Rules

- Use lowercase folder names
- Use singular names for modules when possible
- Keep route names short and clear
- Keep component names descriptive
- One file = one responsibility

Examples:
- `profile-agent.ts`
- `content-agent.ts`
- `use-chat.ts`
- `market-data.ts`
- `daily-brief.workflow.ts`

---

## 9) Clean Repo Rules

- No random files in root
- No prompts inside components
- No business logic in UI files
- No duplicated utilities
- No giant `index.ts` barrels unless necessary
- No “misc” folder
- No experimental junk in production folders

---

## 10) What “Good” Looks Like

A good repo should let a new dev answer these immediately:

- Where is the homepage?
- Where is chat handled?
- Where are agents defined?
- Where is RAG done?
- Where are DB writes happening?
- Where are prompts stored?
- Where are deployable APIs?
- Where are scheduled jobs?

If the repo answers these cleanly, it is production-grade.

---

## 11) Final Repo Philosophy

This project should feel like:

- a real product company repo
- easy to extend
- easy to demo
- easy to deploy
- easy to debug
- clean for judges
- clean for collaborators

Not a hacked-together AI prototype.

---

## 12) Final Recommendation

For this ET product, the best structure is:

- **Next.js App Router** for the product
- **Convex** for realtime app state and memory
- **backend/** for agent workflows and ingestion jobs
- **src/lib/** for AI, DB, and RAG logic
- **docs/** for all planning files
- **prompts/** for prompt management
- **tests/** for quality

That gives you a clean, scalable, deployable monorepo-style architecture without making the repo feel bloated.
