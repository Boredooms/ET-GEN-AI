# GENZET AI — Architecture.md

## 1) Product Thesis

GENZET AI is an **AI Concierge for Economic Times (ET)** that turns a reader’s first visit into a guided, personalized, high-conversion experience. The product is not a simple chatbot. It is a **multi-agent decision layer** that understands who the user is, what they care about, and what ET can do for them — then routes them to the most relevant news, insights, premium products, events, and financial services.

The core hackathon value is simple:

**ET has a large ecosystem, but most users only experience a small part of it. GENZET AI makes ET feel like a personal business assistant.**

This directly matches the hackathon problem statement: build an AI concierge that understands a user in one conversation and becomes their guide to everything ET offers. The PDF also expects full workflow automation, measurable impact, and a working demo with clear architecture. 

---

## 2) Why this idea is the strongest

This idea is the best balance of:

- **Business relevance** — it can increase ET Prime signups, event registrations, lead generation, content depth, and retention.
- **Demonstrable AI depth** — it needs memory, tool use, retrieval, ranking, recommendations, and workflow execution.
- **Demo value** — judges can see a complete journey from onboarding to personalized recommendations to a conversion action.
- **Deployability** — it can be built as a website-first product with real pages and a clean architecture.
- **Scalability** — the same core engine can later power ET Markets, ET Prime, ET Wealth, events, and partner services.

---

## 3) The user experience, end to end

### 3.1 First-time visitor journey

1. User lands on ET.
2. A concierge entry point appears: **“Ask ET anything”**.
3. The assistant asks a short 3-minute profiling conversation:
   - What do you care about?
   - Are you a student, investor, founder, or working professional?
   - What is your goal right now: learn, invest, save tax, track markets, or explore ET products?
4. The system stores a profile.
5. The assistant instantly produces:
   - Personalized news feed
   - Relevant story briefs
   - Suggested ET tools
   - Relevant events or premium offers
6. User clicks into one recommended path.
7. The system continues adapting based on user behavior.

### 3.2 Returning visitor journey

1. User returns to ET.
2. The assistant recalls the user’s profile and history.
3. It opens with a sharper prompt:
   - “You were tracking market volatility and startup funding last time. Want today’s briefing?”
4. It recommends updated content, actions, and offers.
5. The user can continue in chat, open story pages, save items, or trigger a conversion flow.

### 3.3 Conversion journey

The system should not stop at “answering.” It should drive one of the following outcomes:

- open a relevant ET Prime article
- save an article to a user collection
- register for a masterclass
- enroll in an event
- subscribe to a newsletter
- explore a partner financial product
- start a personalized briefing or video summary

That is the business win.

---

## 4) Information architecture: what pages the website should have

This is a website-first product, so the pages matter as much as the AI.

### 4.1 Public pages

#### `/`
Homepage
- ET branding with concierge CTA
- hero section explaining the AI concierge
- quick entry buttons such as:
  - “Brief me”
  - “Explore markets”
  - “Plan my money”
  - “Find ET offerings”
- trending topics
- top story cards
- trust and disclaimer area

#### `/try`
Instant demo entry page
- no-login interactive demo
- one short profiling flow
- used for judges and first-time visitors
- shows the product in under 2 minutes

#### `/stories`
Personalized story feed
- ranked stories
- story clusters
- “Why this is shown to you” explanation
- follow-up questions inside cards

#### `/story/[slug]`
Interactive story deep-dive
- article content
- summary
- timeline
- key entities
- follow-up Q&A
- related ET coverage
- recommended actions

#### `/markets`
Market intelligence dashboard
- index summaries
- sector moves
- top signals
- filings / results / deal highlights
- AI explanation panel

#### `/money`
Personal finance / guidance zone
- user goals
- tax awareness
- savings roadmap
- risk profile summary
- product suggestions

#### `/events`
ET events and masterclasses
- personalized event recommendations
- filtering by interest and profile
- registration flow

#### `/offers`
ET ecosystem offers
- Prime
- newsletters
- partner services
- contextual offers with “why this matters” explanation

#### `/profile`
User profile and preference center
- user persona
- goals
- saved topics
- language
- notification settings
- privacy and consent

---

## 5) Core internal pages for the product team

#### `/admin`
Internal admin console
- view onboarding funnels
- inspect assistant decisions
- review content and ranking signals
- see which offers are converting

#### `/admin/content`
Content ingestion and curation dashboard
- connect ET sources
- approve content sources
- fix metadata
- monitor stale articles

#### `/admin/experiments`
A/B tests
- onboarding prompt variants
- recommendation ranking variants
- CTA variants
- conversion impact

#### `/admin/audit`
Agent audit trail
- every tool call
- every recommendation
- every action
- who approved what and when

---

## 6) Recommended route structure

A clean route structure makes the app easy to scale and easy to demo.

### Public app routes

- `/`
- `/try`
- `/stories`
- `/story/[slug]`
- `/markets`
- `/money`
- `/events`
- `/offers`
- `/profile`

### API routes

- `/api/chat`
- `/api/onboard`
- `/api/profile`
- `/api/retrieve`
- `/api/recommend`
- `/api/story/[slug]`
- `/api/market/signals`
- `/api/money/plan`
- `/api/offers`
- `/api/events`
- `/api/audit`
- `/api/feedback`

### Admin routes

- `/admin`
- `/admin/content`
- `/admin/experiments`
- `/admin/audit`

This route style fits the Next.js App Router model, where routes are organized by folders and handled through route handlers in the `app` directory. Next.js route handlers are built for custom request handlers using the standard Web Request and Response APIs, which is a strong fit for chat and tool-driven workflows. citeturn905438search5turn905438search3

---

## 7) System architecture: end-to-end

### 7.1 High-level flow

```text
User
  ↓
Next.js Web App
  ↓
API Route / Route Handler
  ↓
Supervisor Agent
  ↓
Specialized Agents + Tools
  ↓
Retrieval Layer / Databases / Market Data
  ↓
Ranked Response + UI Cards + Actions
```

### 7.2 Main layers

#### A. Presentation layer
The frontend is responsible for:
- onboarding
- chat
- story cards
- market cards
- recommendation cards
- conversion buttons
- profile management
- admin views

#### B. Orchestration layer
This is the brain:
- interprets user intent
- chooses which agent should work
- decides when to retrieve data
- decides when to ask follow-up questions
- decides when to recommend ET content or offers
- logs every step

LangGraph is a strong fit here because it is designed for controllable, stateful, multi-step agent workflows with long-term memory and human-in-the-loop support. citeturn642709search5turn642709search8

#### C. Knowledge and retrieval layer
This layer holds:
- ET articles
- story metadata
- topic tags
- entity graphs
- user history
- offer catalog
- event catalog
- market data snapshots

For retrieval, pgvector on Postgres or Supabase is a practical choice because it supports embeddings and vector similarity search in the database itself. citeturn905438search4

#### D. Action layer
This layer performs:
- save article
- subscribe
- register for event
- start newsletter flow
- open partner lead form
- update profile
- send notifications

#### E. Observability layer
This layer tracks:
- query volume
- latency
- tool use
- conversion rate
- follow-up rate
- successful retrieval rate
- human handoff rate
- rejection / refusal rate
- action completion rate

---

## 8) Agent design

The best architecture here is **supervisor + specialist agents**, not one huge monolithic prompt.

LangChain’s tool-calling model is designed for this pattern: tools are callable functions with defined schemas, and the model decides when to invoke them. citeturn642709search3turn642709search4

### 8.1 Supervisor Agent
This is the master controller.

Responsibilities:
- understand user intent
- keep session context
- route the request
- decide which specialist agent to call
- produce the final response
- enforce safety and business rules

### 8.2 Specialist agents

#### Profile Agent
- detects user type
- captures goals
- builds preference profile
- updates memory

#### News Agent
- finds relevant ET stories
- generates summaries
- returns story clusters
- explains why the story matters

#### Story Intelligence Agent
- builds story arcs
- timeline views
- key players
- sentiment shifts
- “what to watch next”

#### Market Signal Agent
- finds financial events, filings, and notable market signals
- explains them in plain English
- returns watchlist suggestions

#### Money Mentor Agent
- helps with tax, saving, investing, and planning
- should stay within safe advisory boundaries
- always show explanation and caution

#### Offer / Conversion Agent
- maps user profile to ET products and services
- decides the best CTA
- avoids spammy suggestions

#### Audit Agent
- writes the decision trail
- stores why an answer was generated
- stores which tools were used
- stores what content was shown

---

## 9) Routing logic: how requests should move through the system

### Example intent routing

#### If user says:
“Explain this budget for me”
→ route to:
- News Agent
- Story Intelligence Agent
- Summary Generator

#### If user says:
“What stock-related signals should I watch today?”
→ route to:
- Market Signal Agent
- Retrieval Layer
- Ranking Engine

#### If user says:
“What ET product fits me best?”
→ route to:
- Profile Agent
- Offer Agent
- Conversion Recommendation

#### If user says:
“Help me plan my money”
→ route to:
- Profile Agent
- Money Mentor Agent
- Safe Response Guardrail

### Routing principle

The system should always follow this order:

1. detect intent
2. check profile memory
3. retrieve facts
4. call specialized agent
5. create explanation
6. attach action or CTA
7. log the decision

---

## 10) Data flow design

### 10.1 Content ingestion flow

1. ET content is ingested from CMS / feeds / curated upload.
2. Each item is cleaned and chunked.
3. Metadata is added:
   - title
   - topic
   - author
   - timestamp
   - language
   - entity tags
   - category
4. Embeddings are generated.
5. Items are stored in vector store + relational DB.
6. Content becomes searchable in the assistant.

### 10.2 User profile flow

1. User starts conversation.
2. Assistant asks onboarding questions.
3. Answers are stored as structured profile data.
4. Profile is converted into a user preference vector.
5. Future queries use both:
   - current question
   - user profile
   - previous history

### 10.3 Recommendation flow

1. User intent arrives.
2. System retrieves candidates.
3. Candidates are reranked.
4. Top result set is generated.
5. Response includes:
   - answer
   - sources
   - next action
   - CTAs

---

## 11) Best page-by-page behavior

### `/`
Homepage
- show concierge entry first
- show personalized teaser if user is known
- show “start a 3-minute onboarding”

### `/try`
Demo mode
- one flow only
- no clutter
- show the wow moment immediately

### `/stories`
- personalized grid of stories
- story clusters
- “continue story” cards
- explanation badges

### `/story/[slug]`
- article reader
- AI summary
- related questions
- timeline
- quick actions:
  - save
  - share
  - ask follow-up
  - open full ET Prime content

### `/markets`
- sector snapshots
- trending signals
- explainers
- watchlists
- today’s briefing

### `/money`
- profile-based money help
- tax reminders
- savings plan
- simple decision cards
- safe disclaimers

### `/events`
- recommended events
- user-interest match score
- register flow

### `/offers`
- product recommendations
- why this offer fits
- clear CTA
- preference-based ranking

### `/profile`
- change interests
- update persona
- language preference
- notification settings
- consent controls

---

## 12) Response design: how the assistant should answer

Every response should have this structure:

1. **Direct answer**
2. **Why this is relevant to you**
3. **Source-backed details**
4. **Suggested action**
5. **Optional follow-up question**

This makes the product feel intelligent and commercially useful at the same time.

---

## 13) Safety, compliance, and trust

Because the product touches finance and investing, it must never feel reckless.

### Guardrails
- do not present unsafe direct buy/sell commands
- keep language advisory and educational
- use source-backed responses
- show confidence only when retrieval is strong
- warn when data is outdated
- log all actions
- require confirmation before high-impact actions

### Trust features
- “Why am I seeing this?”
- “How was this recommended?”
- “Show sources”
- “Save this as a watch item”
- “Hide this topic”

---

## 14) What the judge should see in the demo

The demo should show a complete loop:

### Demo 1: new user
- lands on ET
- starts onboarding
- assistant identifies persona
- assistant recommends relevant content and ET offerings
- user clicks one recommendation

### Demo 2: returning investor
- assistant remembers preferences
- shows market signals
- surfaces a relevant article
- explains it in plain English
- proposes a relevant ET Prime action

### Demo 3: business-news reader
- user asks a complex news question
- assistant retrieves sources
- builds a story arc
- offers a timeline and a next step

That is the kind of demo that feels complete.

---

## 15) Why this architecture is strong

This architecture is strong because it combines:
- a modern website experience
- stateful agent orchestration
- retrieval-grounded answers
- personalized routing
- action execution
- auditability
- clear monetization paths

It is not “just AI.”  
It is a **business system**.

---

## 16) Final positioning statement

GENZET AI turns Economic Times from a content platform into a **decision and discovery platform**.

Instead of asking users to search for value, the platform **finds value for them**.

That is the real product.
