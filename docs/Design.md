# DESIGN.md — GENZET AI

> A monochrome, cinematic, premium design system for a serious Economic Times AI product.
> Goal: look like a high-end product studio built this, not an AI-generated template.

---

## 1) Design intent

This product must feel:

- calm, sharp, and intelligent
- editorial, not gimmicky
- premium, not noisy
- motion-rich, but never distracting
- dark, minimal, monochrome, and highly legible

The design should communicate one message immediately:

**“This is a decision intelligence product for ET users.”**

This project is built for the ET AI Concierge problem statement from the hackathon brief, where the product must understand a user in one conversation and guide them across the ET ecosystem. The interface should therefore feel like a concierge, an analyst, and an editor working together.

---

## 2) Core visual language

### Color system

Use a monochrome system first.

Primary palette:
- Background: near-black / charcoal
- Surface 1: dark graphite
- Surface 2: slightly lighter graphite
- Border: muted gray
- Text primary: off-white
- Text secondary: soft gray
- Accent: white only, used sparingly

Rules:
- No rainbow UI.
- No bright gradients everywhere.
- No saturated primary buttons unless absolutely necessary.
- Use one accent color only, and keep it restrained.
- Charts and data viz should stay monochrome unless a highlight is required.

Recommended palette direction:
- #050505
- #0B0B0B
- #121212
- #1A1A1A
- #262626
- #EAEAEA
- #A3A3A3
- #6B6B6B

### Typography

Use a strong editorial sans-serif stack with clear hierarchy.

Suggested approach:
- Headings: bold, wide, confident
- Body: neutral, readable, compact
- Numbers: tabular figures for finance and metrics

Rules:
- Keep headings short.
- Avoid oversized marketing copy.
- Avoid playful fonts.
- Use generous line-height for long explanations.
- Use clear hierarchy between headline, subtext, metadata, and action labels.

### Shape language

- Mostly square or softly rounded cards
- No excessive pill overload
- Use 14px to 24px radius selectively
- Use thin borders, subtle shadow, and inner glow only where useful
- Prefer structured grids over floating blobs

### Layout language

The interface should use:
- strong grid alignment
- large whitespace between sections
- editorial spacing
- card-based groupings
- clear content zones

Every page should feel like a carefully composed magazine spread mixed with a terminal-grade product dashboard.

---

## 3) Product personality in UI

The UI should act like a professional concierge:

- calm tone
- concise responses
- intelligent follow-ups
- never verbose unless user asks
- never flashy
- never “chatbot-y”

The interface copy should read like:
- “Here is the market angle.”
- “This is the most relevant ET path.”
- “You can drill deeper here.”
- “I found a better route for this user.”

Not like:
- “Sure! I’d be happy to help!”
- “Here are 10 amazing things!”
- “Let’s explore together!!!”

---

## 4) Pages and route plan

Use a route-first product structure.

### Public routes

#### `/`
Landing page.
Purpose:
- introduce the product in 10 seconds
- show the brand tone
- drive to onboarding

Sections:
- hero
- live product preview
- three value pillars
- featured use cases
- credibility strip
- CTA

#### `/about`
Explain what the product does.
Purpose:
- human-friendly explanation
- business value
- why ET needs this

#### `/demo`
Interactive demo surface.
Purpose:
- show the concierge in action
- simulate personas
- demonstrate live decision flow

#### `/pricing`
Optional, if the product is shown as a future ET business feature.
Purpose:
- show monetization logic
- premium concierge or ET Prime bundle ideas

### Authenticated routes

#### `/onboarding`
The most important first-run route.
Purpose:
- collect user type
- collect goals
- collect preferences
- start personalization

Flow:
1. welcome screen
2. one-question-at-a-time profiling
3. preference confirmation
4. show generated user profile
5. route to personalized dashboard

#### `/app`
Authenticated shell route.

Nested routes:

##### `/app/dashboard`
Main home after login.
Shows:
- user profile summary
- recommended ET paths
- current market/news intelligence
- next best actions

##### `/app/chat`
The concierge chat workspace.
Shows:
- conversation thread
- tools / actions panel
- source cards
- recommended next steps

##### `/app/briefings`
Deep briefing page.
Shows:
- one topic
- one timeline
- key players
- source links
- follow-up questions

##### `/app/markets`
Market intelligence workspace.
Shows:
- watchlist
- signals
- filings summary
- story arcs
- “why this matters” cards

##### `/app/library`
Saved articles, reports, and generated summaries.

##### `/app/profile`
User identity, preferences, language, risk profile, goals.

##### `/app/settings`
System settings:
- theme
- motion intensity
- language
- notification preferences

### Admin / internal routes

#### `/admin/content`
Curate ET content sources.

#### `/admin/agents`
Inspect agent traces, tool calls, and failures.

#### `/admin/analytics`
Business metrics:
- engagement
- conversion
- retention
- top intent clusters

---

## 5) Navigation design

Primary navigation should be minimal:

- Dashboard
- Chat
- Briefings
- Markets
- Library

Secondary navigation:
- Profile
- Settings

Rules:
- Keep the navigation compact.
- On desktop, use a left sidebar.
- On mobile, use a bottom sheet or compact tab bar.
- Never overcrowd nav with 10+ items.
- The product must feel “guided,” not “exploratory chaos.”

---

## 6) Motion system

Motion is not decoration. Motion is the interface language.

### Motion philosophy

Motion should:
- guide attention
- confirm actions
- communicate state changes
- create premium feel
- support storytelling

Motion should not:
- distract from reading
- bounce too much
- look playful
- feel slow

### Motion intensity levels

#### Level 1 — micro motion
For:
- hover
- press
- focus
- tab switch
- card elevation

Examples:
- subtle scale from 1 to 1.02
- border brighten
- opacity fade
- slight shadow lift

#### Level 2 — page motion
For:
- route transitions
- panel opens
- onboarding step changes
- modal entry

Examples:
- fade + y-axis motion
- card stagger
- soft blur transition
- content reveal

#### Level 3 — storytelling motion
For:
- market briefing
- timeline playback
- chart reveals
- explainer sections
- generated video previews

Examples:
- staggered blocks
- line drawing animation
- timeline node pulse
- smooth progress transitions

### Motion rules

- Use spring-based motion for organic feel.
- Use consistent easing across the product.
- Use motion to reveal, not to spam.
- Keep duration short for UI changes.
- Keep transitions elegant and predictable.
- Respect reduced-motion preferences.

### Recommended motion zones

#### Hero motion
- slow ambient background movement
- floating data cards
- slight parallax on headline elements

#### Onboarding motion
- step-by-step reveal
- progressive disclosure
- input confirmation motion

#### Dashboard motion
- staggered cards
- sequential metric appearance
- hover elevation on insights

#### Chat motion
- assistant message enters smoothly
- source cards slide in after answer
- quick reaction animations on actions

#### Briefing motion
- timeline builds progressively
- story arc animates from top to bottom
- signal cards appear in order of importance

---

## 7) Framer Motion usage

Use Framer Motion for:
- page transitions
- component entrances
- card hover states
- modal opens/closes
- list staggering
- drawer animation
- loading skeleton transitions

Use it in:
- landing page hero
- onboarding flow
- chat panels
- dashboard cards
- briefing timelines

Motion patterns to standardize:
- fade-in with slight vertical offset
- staggerChildren for grouped content
- shared layout transitions for moving panels
- animate presence for conditional content
- hover scale for interactive cards

Use motion classes consistently:
- no random animation styles
- no unnecessary animation per component
- no looping effects unless meaningful

---

## 8) Remotion usage

Remotion should be used for generated or preview videos.

Use it for:
- “AI News Video Studio”
- market recap video
- onboarding highlight video
- auto-generated ET briefing video

Remotion workflow:
1. take structured content from the agent
2. map it to a video template
3. render a short clip
4. show preview in the app
5. allow export/share

Video style:
- monochrome
- sharp titles
- animated charts
- clean lower-thirds
- subtle motion backgrounds
- editorial pacing

The video output must look like a business broadcast, not a social meme clip.

---

## 9) Anime.js usage

Use Anime.js for:
- lightweight decorative motion
- scroll-tied accents
- small intro effects
- text or shape choreography when needed

Use it sparingly.
It should support the premium feel, not dominate the UI.

Good use cases:
- animated underline sweep
- subtle data point reveal
- ambient hero accents
- small interface polish

Do not use it for:
- core page transitions
- critical app states
- complex workflow orchestration

---

## 10) Page-by-page design blueprint

### Landing page
Should contain:
- cinematic hero
- one powerful statement
- live dashboard preview
- sample AI concierge interaction
- credibility strip
- CTA

Design cues:
- dark full-bleed background
- motion-rich but minimal
- large title
- tiny supporting text
- one strong primary button

### Onboarding page
Should contain:
- one question at a time
- progress indicator
- minimal text
- direct confirmations
- personalized outcome preview

Design cues:
- reduced clutter
- calm pacing
- focus ring clarity
- motion between steps

### Dashboard page
Should contain:
- profile summary
- today’s recommendations
- priority signals
- next best actions
- saved items

Design cues:
- card grid
- no long scroll overload
- clear visual ranking
- immediate relevance

### Chat page
Should contain:
- left: conversation
- right: source/actions
- top: current profile context
- bottom: quick action chips

Design cues:
- professional workspace
- clean borders
- source cards
- action confirmations

### Briefings page
Should contain:
- one story, one timeline
- summary at top
- follow-up questions
- source list
- what-to-watch-next

Design cues:
- editorial layout
- timeline-centered flow
- structured narrative
- strong visual hierarchy

### Markets page
Should contain:
- watchlist
- signals
- filings
- comparison blocks
- chart area

Design cues:
- data-heavy but clean
- monochrome charts
- emphasis on readability
- no cluttered KPI spam

---

## 11) Component system

Build a reusable component library.

### Core components
- App shell
- Sidebar
- Top bar
- Metric card
- Insight card
- Source card
- Action card
- Chat bubble
- Timeline node
- Chart panel
- Profile badge
- Quick action chip
- Modal sheet
- Drawer panel
- Empty state
- Skeleton loader

### Interaction states
Each component must support:
- default
- hover
- active
- loading
- disabled
- selected
- error
- success

### Visual standards
- borders first, shadows second
- clean icon usage
- consistent spacing
- consistent radius
- consistent animation duration

---

## 12) Loading and empty states

These matter a lot.

Loading should feel like:
- active
- intelligent
- premium

Use:
- skeleton cards
- shimmering placeholders
- progress labels
- staged content reveal

Empty states should feel:
- calm
- helpful
- no guilt language

Examples:
- “No saved briefings yet.”
- “Your personalized feed will appear here.”
- “Start a 2-minute profile to unlock recommendations.”

---

## 13) Dark mode and monochrome rules

This product should live mostly in dark mode.

Dark mode rules:
- use near-black backgrounds
- avoid pure black everywhere
- use contrast carefully
- preserve readability
- keep borders visible but subtle

Monochrome rules:
- use grayscale layers
- use one highlight at a time
- use highlight only to show hierarchy
- do not overload with color semantics

---

## 14) Design system tokens

Create design tokens for:

- background
- surface
- surface elevated
- border
- text primary
- text secondary
- text muted
- accent
- shadow
- radius
- spacing
- motion duration
- easing

Also define:
- typography scale
- chart style
- icon weight
- component elevation rules

---

## 15) Accessibility rules

Even premium design must be accessible.

Must support:
- keyboard navigation
- focus states
- reduced motion mode
- sufficient contrast
- readable font sizes
- semantic structure
- screen-reader labels

Accessibility should not feel bolted on. It should be part of the system.

---

## 16) What makes this feel non-AI-generated

Avoid these common “AI slop” patterns:

- generic gradients everywhere
- random neon highlights
- oversized hero with meaningless copy
- inconsistent shadows
- too many cards with no hierarchy
- circular widgets everywhere
- noisy motion on every element
- cluttered dashboard with no story

Instead:
- choose one strong layout principle
- repeat it consistently
- use only necessary motion
- keep copy sharp
- make data feel editorial
- make the interface feel composed

---

## 17) Recommended implementation order

### Stage 1
- design tokens
- layout shell
- homepage
- onboarding

### Stage 2
- dashboard
- chat workspace
- briefing page

### Stage 3
- market workspace
- video previews
- admin views

### Stage 4
- motion polish
- empty states
- loading states
- responsive refinement
- accessibility checks

---

## 18) Quality bar

Before shipping any page, verify:

- Is the hierarchy obvious in 3 seconds?
- Does the page feel premium in dark mode?
- Is the motion subtle and useful?
- Does the page have one clear job?
- Does the interface feel like ET-level decision intelligence?

If the answer is no, simplify it.

---

## 19) Final target feel

The finished product should feel like:

- a financial newsroom
- a private analyst desk
- a concierge system
- a premium editorial dashboard

It should not feel like:
- a random SaaS template
- a chatbot wrapper
- an AI demo
- a cluttered startup landing page

---

## 20) One-line design north star

**Make ET feel like a black-box intelligence console that speaks like an editor and acts like a concierge.**
