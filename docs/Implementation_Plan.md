# GENZET AI — Implementation Plan

## 1) What we are building

GENZET AI is an AI concierge for Economic Times that helps a user understand ET’s ecosystem in one conversation and then routes them to the right content, tools, and offers.

The product should feel like a premium, guided intelligence experience — not a generic chatbot.

Primary outcomes:
- Faster onboarding into ET products
- Better discovery of articles, videos, events, and premium offerings
- Higher engagement and conversion
- A live, demo-friendly product that looks polished and intentional

---

## 2) Product principles

1. Build for clarity before complexity.
2. Every screen must answer one question.
3. Every AI action must be visible, explainable, and reversible.
4. The interface should feel editorial, calm, and high-trust.
5. Use motion only where it improves understanding or delight.
6. Avoid “AI-slop” UI patterns like random blobs, overused gradients, and noisy cards.
7. Use structured workflows, not free-form chaos.

---

## 3) Final product shape

The website should be organized around 5 major experiences:

### A. Public landing experience
Purpose:
- Explain the product in one glance
- Drive users into the concierge flow

Key sections:
- Hero with a strong value proposition
- Product story
- “How it works” walkthrough
- Demo scenarios
- ET business value
- CTA into onboarding

### B. Onboarding experience
Purpose:
- Understand the user in under 3 minutes

Key steps:
- User type selection
- Topic preference selection
- Financial goals selection
- Language preference
- Consent and personalization approval

### C. Concierge chat experience
Purpose:
- Let the user ask anything and get routed intelligently

Key capabilities:
- Ask questions in natural language
- Get article recommendations
- See explainers
- Get personalized actions
- Move from insight to action

### D. Intelligence dashboard
Purpose:
- Show what the system knows and why it recommends things

Key panels:
- Profile summary
- Interest map
- Content relevance
- Suggested ET services
- Recommended next actions

### E. Admin / demo control panel
Purpose:
- Allow the team to switch personas, mock data, and demo flows

Key tools:
- Persona switcher
- Dataset selector
- Response inspector
- Agent trace viewer
- Feature flag toggles

---

## 4) Core page map

Use Next.js App Router and structure the app as route-first, not component-first.

### Public routes
- `/` → Landing page
- `/about` → Product explanation
- `/demo` → Interactive live demo entry
- `/pricing` → Optional monetization page
- `/privacy` → Privacy and consent
- `/terms` → Terms and disclaimer

### Product routes
- `/onboarding` → 3-step AI profiling flow
- `/chat` → Main concierge interface
- `/dashboard` → User intelligence dashboard
- `/insights` → Market/news intelligence view
- `/library` → Articles, explainers, and videos
- `/recommendations` → Suggested content and offers

### Admin routes
- `/admin` → Internal control panel
- `/admin/personas`
- `/admin/traces`
- `/admin/content`
- `/admin/settings`

### API / action routes
- `/api/chat`
- `/api/onboard`
- `/api/recommend`
- `/api/feedback`
- `/api/insights`
- `/api/actions`
- `/api/webhook/*`

---

## 5) Recommended UX flow

### Flow 1: First-time user
1. User lands on homepage.
2. CTA opens onboarding.
3. User answers 4–5 smart questions.
4. System creates a profile.
5. User is redirected into the concierge chat.
6. The chat opens with 3 tailored recommendations.
7. User can click one recommendation or ask follow-up questions.

### Flow 2: Returning user
1. User lands on homepage.
2. System recognizes returning profile.
3. The page shows personalized hero content.
4. Clicking “Continue” opens the concierge with memory intact.
5. The system resumes from the last topic.

### Flow 3: Demo mode
1. Admin selects persona.
2. System loads a canned but realistic dataset.
3. A demo walkthrough automatically shows:
   - profile capture
   - content retrieval
   - explanation
   - recommendation
   - action

---

## 6) Design direction

The design should feel like:
- premium editorial product
- modern finance intelligence tool
- high-trust assistant
- minimal but powerful

### Visual rules
- Use white / off-white base backgrounds
- Use dark text and one strong accent color
- Keep cards airy, with soft borders and subtle shadows
- Use large typography for hero sections
- Avoid cluttered dashboards
- Use motion only for:
  - page entry
  - card reveal
  - typing states
  - transition between states
  - layout shifts

### Motion style
Use Motion for React for:
- page transitions
- onboarding step transitions
- hover states
- chat streaming cues
- dashboard card entrances
- shared element transitions

Motion should feel:
- smooth
- intentional
- subtle
- editorial

Do not use excessive parallax, spinning gradients, or noisy effects.

---

## 7) Recommended stack by layer

### Frontend
Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Motion for React
- lucide-react icons
- TanStack Query only where needed for client state/data sync
- Zod for schema validation

Why:
- App Router gives structured routing and nested layouts.
- shadcn/ui gives editable components instead of boxed-in UI.
- Motion gives polished interface animations.
- Zod keeps forms and actions strongly typed.

### Backend / data layer
Use:
- Convex for realtime database, queries, mutations, and auth-friendly state
- PostgreSQL or Supabase only for specific relational/analytical needs if required
- Object storage for uploaded PDFs, assets, and documents
- A vector store for retrieval if the content corpus becomes large

Why:
- Convex is excellent for live state, profile sync, and interaction logs.
- Realtime updates are important for chat, onboarding, and dashboards.
- A separate vector index is useful for news/article retrieval.

### AI orchestration
Use:
- LangGraph for multi-step agent flow
- LangChain tools where useful
- Gemini API for model calls, tool calling, and structured outputs

Why:
- LangGraph is better than a single opaque prompt chain when the workflow has steps.
- Gemini structured outputs and function calling are useful for reliable routing.
- Tools should be explicit and auditable.

### Observability
Use:
- request logging
- agent trace logging
- error boundary logging
- event analytics
- simple admin trace viewer

---

## 8) What to install

### Base project
```bash
pnpm create next-app@latest genzet-ai   --typescript   --eslint   --tailwind   --app   --src-dir   --import-alias "@/*"
```

### UI system
```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card dialog drawer sheet tabs input textarea badge avatar dropdown-menu separator toast skeleton table command select switch tooltip progress
```

### Animations
```bash
pnpm add motion
```

### AI and schema tools
```bash
pnpm add zod
pnpm add @google/genai
pnpm add langgraph langchain
```

### Data and state
```bash
pnpm add convex
pnpm add @tanstack/react-query
```

### Utilities
```bash
pnpm add clsx tailwind-merge lucide-react sonner date-fns
pnpm add react-hook-form @hookform/resolvers
```

### Optional
```bash
pnpm add framer-motion
```

Use Motion for React if you want the current Motion API style. Avoid adding both Motion and Framer Motion unless you explicitly need compatibility work.

---

## 9) Folder structure

The project should stay clean and predictable.

```txt
genzet-ai/
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/
│  │  │  ├─ page.tsx
│  │  │  ├─ about/page.tsx
│  │  │  ├─ demo/page.tsx
│  │  │  ├─ pricing/page.tsx
│  │  │  ├─ privacy/page.tsx
│  │  │  └─ terms/page.tsx
│  │  ├─ (app)/
│  │  │  ├─ onboarding/page.tsx
│  │  │  ├─ chat/page.tsx
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ insights/page.tsx
│  │  │  ├─ library/page.tsx
│  │  │  └─ recommendations/page.tsx
│  │  ├─ (admin)/
│  │  │  ├─ admin/page.tsx
│  │  │  ├─ admin/personas/page.tsx
│  │  │  ├─ admin/traces/page.tsx
│  │  │  ├─ admin/content/page.tsx
│  │  │  └─ admin/settings/page.tsx
│  │  ├─ api/
│  │  │  ├─ chat/route.ts
│  │  │  ├─ onboard/route.ts
│  │  │  ├─ recommend/route.ts
│  │  │  ├─ feedback/route.ts
│  │  │  ├─ insights/route.ts
│  │  │  └─ actions/route.ts
│  │  ├─ layout.tsx
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ ui/
│  │  ├─ layout/
│  │  ├─ onboarding/
│  │  ├─ chat/
│  │  ├─ dashboard/
│  │  ├─ recommendations/
│  │  ├─ insights/
│  │  ├─ marketing/
│  │  └─ admin/
│  ├─ lib/
│  │  ├─ ai/
│  │  ├─ agents/
│  │  ├─ convex/
│  │  ├─ schemas/
│  │  ├─ utils/
│  │  ├─ constants/
│  │  └─ content/
│  ├─ hooks/
│  ├─ store/
│  ├─ types/
│  └─ styles/
├─ convex/
├─ public/
├─ docs/
├─ prompts/
├─ scripts/
└─ README.md
```

---

## 10) What each folder does

### `src/app`
All routes and layouts live here. Keep routing logical and nested.

### `src/components/ui`
Raw shadcn/ui components. Do not heavily modify them globally. Compose from them.

### `src/components/chat`
Chat bubble UI, message list, input bar, typing indicators, tool-call chips, source cards.

### `src/components/onboarding`
Profile wizard, user type cards, interest chips, step transitions, consent screen.

### `src/components/dashboard`
Profile summary, interest map, action cards, recommendation insights.

### `src/components/recommendations`
Suggested articles, ET services, premium offers, event cards.

### `src/lib/ai`
All prompt builders, model wrappers, tool definitions, structured output helpers.

### `src/lib/agents`
Agent state machine, orchestration logic, step definitions, routing policies.

### `src/lib/schemas`
Zod schemas for user profile, chat message, content item, recommendation, action event.

### `src/lib/content`
Content ingestion helpers, ranking rules, metadata normalization.

### `convex`
Convex schema, queries, mutations, auth logic, realtime state.

### `docs`
Architecture notes, product reasoning, demo scripts, evaluation rubric.

### `prompts`
System prompts, agent prompts, tone prompts, guardrail prompts.

### `scripts`
Seed scripts, content ingestion scripts, demo data loaders.

---

## 11) Build order

Do this in the following order.

### Step 1: Foundation
- Create Next.js app
- Add Tailwind
- Add shadcn/ui
- Set up layout system
- Define theme, spacing, typography, motion rules

### Step 2: Core routes
- Build homepage
- Build onboarding
- Build chat
- Build dashboard
- Build admin

### Step 3: Data layer
- Set up Convex schema
- Create user profiles table
- Create conversation logs
- Create recommendation events
- Create content entities

### Step 4: AI flow
- Create agent routing
- Add structured output schema
- Add tool calling for retrieval and actions
- Add explanation generation
- Add confidence and fallback logic

### Step 5: Content pipeline
- Seed articles and ET content samples
- Tag by topic, intent, audience, and urgency
- Build retrieval and ranking

### Step 6: UI polish
- Add animations
- Add transitions
- Add loading skeletons
- Add empty states
- Add source citation cards
- Add feedback buttons

### Step 7: Demo mode
- Load persona presets
- Pre-seed conversations
- Add one-click demo playback
- Add scenario switching

### Step 8: Final hardening
- Validate forms
- Add error boundaries
- Add fallback response flows
- Add analytics events
- Test all routes end to end

---

## 12) What to animate

Use animation only where it helps clarity.

### Recommended animations
- Hero entrance
- Card reveal on scroll
- Step-by-step onboarding transitions
- Chat message fade/slide
- Typing indicator
- Recommendation card hover
- Sidebar expand/collapse
- Dashboard metric transitions
- Shared element transition from card to detail page

### Avoid
- Over-animated backgrounds
- Looping decoration for no reason
- Heavy parallax on every section
- Random floating blobs everywhere

---

## 13) Routing and interaction rules

### Landing page
- Must explain the product in under 10 seconds
- CTA should lead to onboarding or demo

### Onboarding
- Keep to 3–5 steps maximum
- Each step should collect high-value data only

### Chat page
- Should show:
  - current profile summary
  - chat history
  - source citations
  - quick action chips
- Message input should support:
  - normal text
  - prompt suggestions
  - quick commands

### Dashboard
- Must answer:
  - Who is this user?
  - What do they care about?
  - What should they do next?

### Admin
- Must allow:
  - persona switching
  - dataset loading
  - trace inspection
  - demo reset

---

## 14) Data model overview

At minimum, create these entities:

### UserProfile
- id
- name
- user_type
- interests
- goals
- language
- risk_level
- consent_status

### Conversation
- id
- user_id
- session_id
- messages
- intent
- timestamp

### ContentItem
- id
- title
- source
- summary
- topic
- audience
- tags
- url
- published_at

### Recommendation
- id
- user_id
- content_id
- reason
- score
- action_type

### AgentTrace
- id
- step_name
- input
- output
- tool_used
- confidence
- status

---

## 15) API responsibilities

### `/api/onboard`
- accepts profile inputs
- validates fields
- stores profile
- returns onboarding result

### `/api/chat`
- receives user message
- routes to agent
- returns answer, sources, and actions

### `/api/recommend`
- generates ranked suggestions
- returns cards for UI rendering

### `/api/actions`
- handles user clicks
- logs action
- triggers next step

### `/api/feedback`
- records thumbs up/down
- feeds ranking improvements

### `/api/insights`
- returns personalized story and dashboard data

---

## 16) Senior-dev execution rules

1. Never write UI before route map is final.
2. Never write agent code before schemas are final.
3. Never connect tools without logging.
4. Never ship a page without empty, loading, and error states.
5. Never rely on one prompt for every task.
6. Split tasks into small deterministic steps.
7. Every AI response must be structured enough to render in UI.
8. Every “recommendation” must include a reason.
9. Every sensitive action must ask for confirmation.
10. Every demo scenario must work offline with seeded data.

---

## 17) Demo-ready architecture priorities

For the hackathon demo, prioritize:
- a beautiful landing page
- smooth onboarding
- one strong chat flow
- a strong dashboard
- one action flow
- one admin trace view

That is enough to feel complete and impressive.

---

## 18) Final build goal

The final product should feel like:

- a polished ET premium intelligence assistant
- a guided business-news discovery engine
- a personalized decision layer for ET users
- a website that looks handcrafted, not machine-generated

---

## 19) Definition of done

The implementation is ready when:
- all routes work
- onboarding is smooth
- chat returns structured responses
- recommendations render as cards
- dashboard updates from user profile
- animations feel premium
- admin traces show agent reasoning
- the demo can be shown start to finish without manual repair

---

## 20) Next action list

1. Create the Next.js project.
2. Add shadcn/ui and Motion.
3. Build routes and layouts.
4. Set up Convex schema.
5. Wire the onboarding flow.
6. Build the chat shell.
7. Connect the agent layer.
8. Add polished animations.
9. Seed demo data.
10. Record the pitch demo.
