# Technicals.md
## GENZET AI — AI Concierge for Economic Times

This document defines the recommended technical stack, where each component should be used, and how the pieces fit together for a production-grade, judge-friendly ET AI Concierge.

---

## 1) Product Goal

GENZET AI is a website-first AI concierge for Economic Times that:
- understands a user in a short conversation,
- routes them to the right ET content, tools, subscriptions, events, and partner offers,
- gives explainable, source-grounded responses,
- and records every important action in an auditable workflow.

The stack below is optimized for:
- fast hackathon delivery,
- real-time UX,
- low-cost deployment,
- and a clean path to production scaling.

---

## 2) Core Technical Strategy

### Recommended architecture style
Use a **hybrid architecture**:

1. **Next.js** for the user-facing website and server-side routing.
2. **Convex** as the realtime operational backend.
3. **LangGraph + LangChain** for agent orchestration and tool-calling.
4. **Gemini API** for reasoning, extraction, structured outputs, and summarization.
5. **Postgres + vector search** for semantic retrieval and long-term content indexing.
6. **Object storage** for PDFs, transcripts, generated media, and article snapshots.

This gives the best balance between:
- speed of development,
- realtime collaboration,
- strong UX,
- and scalable data handling.

---

## 3) Recommended Stack by Layer

| Layer | Recommended Tool | Why it belongs here | What it should handle |
|---|---|---|---|
| Frontend | Next.js App Router | File-based routing, modern React architecture, server/client component split, route handlers | Landing pages, onboarding, chat UI, dashboards, story pages |
| UI styling | Tailwind CSS + shadcn/ui | Fast, clean, consistent UI | Cards, forms, chat bubbles, tables, settings panels |
| Realtime app backend | Convex | Realtime by default, TypeScript backend, no manual DB wiring | User profiles, chat sessions, recommendation logs, tasks, approvals |
| Auth | Convex Auth or WorkOS/AuthKit | Fast sign-in, social login, OTP/magic link | Login, account creation, profile linking |
| Agent orchestration | LangGraph | Stateful, durable agent workflows | Supervisor agent, sub-agents, retries, approvals, long-running flows |
| Tool abstraction | LangChain tools | Clean function/tool schemas for LLM actions | Search tools, database tools, scoring tools, alert tools |
| LLM | Gemini API | Low-cost, strong tool calling, structured outputs | Summaries, classification, extraction, response generation |
| Retrieval store | Postgres + pgvector | Better for semantic search and analytics than a pure app DB | Embeddings, article chunks, user-interest vectors |
| Relational data | Postgres | Strong integrity and querying for structured content | ET content metadata, entities, categories, events |
| File storage | Convex File Storage or S3 | Store raw uploads and generated artifacts | PDFs, images, audio, transcripts, export files |
| Background jobs | Convex actions / scheduled functions | Good for sync, ingestion, and async workflows | News ingestion, embedding refresh, alert generation |
| Observability | LangSmith + Convex dashboard | Trace agent behavior and data flow | Prompts, tool calls, errors, latency, evaluation |
| Hosting | Vercel for frontend, Convex cloud for backend | Fast deployment and simple ops | Production deployment of the website and backend |

---

## 4) What To Use Where

### A. Next.js App Router
Use Next.js for every screen the judge or user sees.

#### Pages to build
- `/` — landing page
- `/onboard` — 3-minute AI profiling flow
- `/chat` — main concierge chat
- `/news` — personalized newsroom
- `/briefs/[slug]` — explorable deep briefing page
- `/stories/[slug]` — story arc tracker page
- `/portfolio` — investor view and watchlist
- `/alerts` — daily alerts and recommendations
- `/events` — ET events and masterclasses
- `/settings` — preferences, consent, language, privacy
- `/admin/ingest` — content ingestion and moderation console

#### Routing logic
- Public pages should be static or lightly dynamic.
- Authenticated pages should fetch live Convex data.
- Chat should stream responses and update in real time.
- Story pages should load from content IDs and pull related citations, entities, and timeline events.

#### Why this matters
The App Router is built around file-based routing and modern React features such as Server Components and nested layouts, which is ideal for a large content-heavy product.

---

### B. Convex
Use Convex for the operational heart of the product.

#### Store in Convex
- user profiles
- onboarding answers
- chat threads
- message history
- saved articles
- recommendation history
- click and conversion events
- approval states
- notifications
- audit logs
- user preferences
- personalization signals

#### Why Convex fits here
Convex is realtime by default and updates clients automatically when data changes. It also gives TypeScript-based server functions and a schema-first model for type safety.

#### When Convex is the best choice
- live chat session state
- fast updates to recommendations
- collaborative dashboards
- user-visible notifications
- action logs and approvals

#### What not to force into Convex
Do not make Convex your only semantic search system if you need heavy retrieval over lots of article chunks. Keep Convex for live app state and pair it with a vector-capable store for retrieval.

---

### C. Postgres + pgvector
Use Postgres as the “content truth” layer and pgvector as the retrieval layer.

#### Store in Postgres
- canonical article metadata
- authors
- categories
- tags
- company/entity tables
- market instruments
- event catalog
- content publish timestamps
- user-generated structured preferences if needed for reporting

#### Store in pgvector
- article embeddings
- chunk embeddings
- query embeddings
- user interest embeddings
- similar-story clusters

#### Why this is better than using only a general app DB
- stronger structured queries
- easier reporting
- better retrieval architecture
- cleaner analytics
- simpler migration path later

#### Practical recommendation
If the team wants maximum simplicity for a hackathon:
- use **Convex** for app state
- use **Supabase Postgres + pgvector** for retrieval
- keep analytics in the same Postgres database

If the team wants even faster setup:
- Convex first
- add pgvector only for the retrieval pipeline

---

### D. Gemini API
Use Gemini where the product needs intelligence, but not brittle hand-written logic.

#### Use Gemini for
- onboarding conversation summarization
- intent detection
- user profiling
- article summarization
- structured extraction from news
- recommendation explanation
- follow-up question generation
- market/news classification
- response generation with citations and JSON schemas

#### Best practice
Use Gemini in two separate modes:
1. **Function calling** for actions
2. **Structured outputs** for predictable JSON responses

This is important because:
- function calling lets the agent decide which tool to invoke,
- structured outputs make the response parsable and reliable for the UI.

#### Good prompt pattern
- ask Gemini to classify the user intent,
- ask Gemini to output a structured profile object,
- then route to the correct sub-agent,
- then generate the final response from retrieved data.

---

### E. LangGraph + LangChain
Use LangGraph for the orchestration layer and LangChain tools for the action layer.

#### LangGraph responsibilities
- supervisor agent
- state transitions
- multi-step workflows
- retry paths
- approval gates
- long-running tasks
- deterministic branches

#### LangChain responsibilities
- tool definitions
- database search tools
- content retrieval tools
- market data tools
- action tools
- summarization helpers

#### Why this combination is strong
LangGraph is designed for stateful, durable agent workflows, while LangChain gives the tool and model abstractions needed to connect the agent to real systems.

#### Recommended agent design
- **Supervisor Agent** decides the route
- **Profile Agent** identifies user type and goals
- **News Agent** retrieves ET content
- **Market Agent** fetches market facts
- **Recommendation Agent** ranks what to show
- **Action Agent** creates tasks, reminders, and offers
- **Safety Agent** checks compliance and tone

---

### F. File Storage
Use file storage for any non-tabular asset.

#### Store here
- uploaded PDFs
- article snapshots
- chart screenshots
- generated voice notes
- generated thumbnails
- exported summaries
- demo media assets

#### Recommended choice
- Convex File Storage for a hackathon-friendly setup
- S3-compatible object storage if the team wants direct production scaling

---

### G. Observability
Use observability from day one.

#### Track
- prompt version
- tool calls
- latency
- failed retrievals
- hallucination checks
- click-throughs
- conversion events
- approval rejections
- user dropout points

#### Tools
- LangSmith for traces and evals
- Convex dashboard for live backend inspection
- browser console/network logs during demo

#### Why this matters
A hackathon judge sees “working system,” but a business team sees “measurable system.” Observability is how you prove both.

---

## 5) API Map

### A. Gemini API
Use it for:
- `classifyUserIntent`
- `extractUserProfile`
- `summarizeArticle`
- `generateBriefing`
- `draftRecommendationExplanation`
- `normalizeNewsEntityData`

### B. ET content ingestion API / feeds
Use it for:
- fetching articles
- fetching section metadata
- pulling author and category info
- detecting new content

### C. Market data APIs
Use them for:
- stock price snapshots
- index moves
- sector trends
- corporate filing metadata
- event-driven alerts

### D. Auth API
Use it for:
- login
- profile persistence
- user identity linking
- session validation

### E. Payment / subscription API
Use it for:
- ET Prime trial flows
- event ticket registration
- partner offer handoff

### F. Notification APIs
Use them for:
- email digests
- in-app alerts
- WhatsApp or push notifications later

---

## 6) Data Flow Design

### Ingestion flow
1. ET articles and metadata are fetched.
2. Content is cleaned and chunked.
3. Entities are extracted.
4. Embeddings are generated.
5. Chunks are stored in the retrieval layer.
6. Metadata is stored in Postgres.
7. Sync status is stored in Convex.
8. The user-facing app reads only curated, ready content.

### Runtime query flow
1. User sends a question in chat.
2. Next.js sends it to the agent layer.
3. Supervisor agent classifies the query.
4. Relevant tools are called.
5. Retrieval returns supporting content.
6. Gemini produces the final answer in structured format.
7. Convex stores the answer, action, and telemetry.
8. UI updates live.

---

## 7) Database Responsibilities

### Convex
Best for:
- chat state
- user state
- onboarding memory
- live action logs
- notifications
- approvals

### Postgres
Best for:
- canonical ET data
- analytics tables
- content relations
- user segmentation
- event records
- reporting

### pgvector
Best for:
- semantic retrieval
- recommendation similarity
- article chunk search
- user preference matching

### File storage
Best for:
- media and document artifacts
- generated outputs
- raw source files

---

## 8) Recommended Minimal Stack for the Hackathon

If the goal is speed plus polish, use this exact stack:

- **Frontend:** Next.js + Tailwind + shadcn/ui
- **Backend state:** Convex
- **Auth:** Convex Auth
- **AI orchestration:** LangGraph + LangChain tools
- **Model:** Gemini API
- **Retrieval:** Supabase Postgres + pgvector
- **Files:** Convex File Storage
- **Tracing:** LangSmith
- **Hosting:** Vercel + Convex cloud

This stack is strong because it is:
- fast to build,
- easy to demo,
- realistic for production,
- and strong enough to impress judges.

---

## 9) What To Avoid

- Do not rely on only prompt engineering without tool calls.
- Do not keep all data inside one giant prompt.
- Do not use a heavy custom backend if Convex can handle the state cleanly.
- Do not make the architecture overcomplicated.
- Do not store everything in the vector DB.
- Do not let the model answer financial questions without retrieval and guardrails.

---

## 10) Final Recommendation

### Use Convex for:
- realtime user state
- chat memory
- events
- approvals
- audit trails

### Use Postgres + pgvector for:
- content search
- semantic retrieval
- analytics
- structured ET data

### Use Gemini for:
- reasoning
- extraction
- summarization
- structured outputs
- function calling

### Use LangGraph for:
- orchestration
- control flow
- sub-agent routing
- safe multi-step execution

### Use Next.js for:
- the full website
- routing
- dashboards
- chat UI
- story pages
- onboarding and alerts

This is the cleanest path to a deployable, premium-looking, ET-grade product.

---
