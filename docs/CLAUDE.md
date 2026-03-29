# CLAUDE.md — Execution Playbook for GENZET AI

This document is the operating manual for building the project like a senior product engineer: clean, deliberate, reviewable, and production-minded. It is written to prevent generic AI output, weak UX, and disconnected implementation decisions.

## 1) Mission

Build a premium, website-first AI concierge for Economic Times that helps users understand ET, discover the right content and products, and take useful actions through a polished, trustworthy experience.

The product must feel like an editorial intelligence layer, not a chatbot wrapper.

## 2) Build Philosophy

### Non-negotiable principles
- Build for real users, not demo smoke.
- Every screen must have a purpose.
- Every agent action must be explainable.
- Every interaction must preserve trust.
- Every page must look intentionally designed.
- Every feature must connect to a business outcome.

### What to avoid
- Generic AI chat bubbles on a blank page.
- Random gradients, neon glows, and “futuristic” clutter.
- Over-animated UI with no information hierarchy.
- Copy-paste dashboard templates with no editorial feel.
- A website that looks like it was generated in one shot.
- Hidden complexity with no traceability.
- A system that answers, but never helps the user move forward.

## 3) Product Definition

The product is a concierge experience for ET users that:
- Understands who the user is.
- Learns what they care about.
- Routes them to the right ET content, learning, services, and offers.
- Keeps the interaction conversational, visual, and high trust.
- Can show summaries, timelines, recommendations, and actions in one flow.

The product should feel like:
- a premium newsroom,
- a personal finance guide,
- and a guided discovery system,
all in one.

## 4) Design Direction

### Visual identity
The website should feel:
- editorial,
- premium,
- calm,
- authoritative,
- and modern.

### UI tone
- Clean layouts.
- Strong typography.
- Clear spacing.
- Minimal but rich surfaces.
- Real content density.
- No flashy AI gimmicks.

### Page composition rules
- Start with one clear hero intent.
- Use one primary call to action per page.
- Place supporting actions below, not beside everything.
- Prefer scannable sections with real content.
- Use cards only when they add structure.
- Make charts, timelines, and modules feel native to the page.
- Keep conversational UI embedded inside a broader product experience.

### Typography rules
- Headlines must feel editorial.
- Body text must be highly readable.
- Labels should be precise, not marketing-heavy.
- Numbers, signals, and metrics should stand out.

### Color rules
- Use a restrained base palette.
- Reserve accent color for action and insight.
- Avoid rainbow dashboards.
- Avoid random color coding unless it communicates meaning.

## 5) Website Experience Strategy

The website should not behave like a single chatbot page. It should behave like a complete product.

### Required pages

#### A. Landing page
Purpose:
- Explain the value of the product quickly.
- Show what users can do.
- Establish trust.

Content:
- A strong value proposition.
- A sample concierge interaction.
- A few high-value use cases.
- A preview of insights and actions.
- A clear “Start” action.

#### B. Onboarding page
Purpose:
- Learn user type and intent.
- Build a useful profile in under 3 minutes.

Flow:
- User role selection.
- Interest selection.
- Language preference.
- Goal selection.
- Risk appetite or reading depth.
- Consent and data preferences.

The onboarding must feel fast and intelligent, not like a survey.

#### C. Concierge chat page
Purpose:
- Main interaction surface.

Required elements:
- Streaming assistant responses.
- Suggested follow-up prompts.
- Rich answer blocks.
- Story cards.
- Action buttons.
- Source references.
- History of the session.

The chat should be visually integrated with the product, not isolated from it.

#### D. Insights page
Purpose:
- Convert conversation into structured intelligence.

Content:
- Watchlist / topic map.
- Saved stories.
- Recommended content.
- Suggested actions.
- User-specific summaries.

#### E. Story / briefing page
Purpose:
- Turn one topic into an explorable briefing.

Content:
- Summary at top.
- Timeline below.
- Key players.
- What changed.
- What to watch next.
- Follow-up questions.

#### F. Profile and preferences page
Purpose:
- Let users control personalization.

Content:
- Interest edits.
- Language preferences.
- Notification settings.
- Privacy settings.
- Reading depth.
- Content type preference.

#### G. Admin / review page
Purpose:
- Let the team inspect what the system is doing.

Content:
- Conversation logs.
- Recommendation logs.
- Model outputs.
- Human override tools.
- Feedback loop.
- Error tracking.

## 6) Routing Strategy

Use route design that matches how the product actually works.

### Suggested route map
- `/` → landing
- `/start` → onboarding
- `/c/[sessionId]` → live concierge conversation
- `/insights` → user intelligence dashboard
- `/story/[slug]` → interactive story briefing
- `/profile` → preferences and personalization controls
- `/saved` → saved content and actions
- `/admin` → review and monitoring
- `/api/*` → route handlers for orchestration and tool calls

### Routing rules
- Keep onboarding separate from the main experience.
- Keep story pages shareable.
- Keep admin routes protected.
- Keep API routes thin and purpose-built.
- Keep conversation state synchronized across the app.

## 7) Agent Operating Model

The system should work like a controlled decision engine.

### Agent roles
- Supervisor agent: decides what happens next.
- Profile agent: updates user understanding.
- Retrieval agent: finds relevant ET content.
- Recommendation agent: suggests content and actions.
- Action agent: executes approved user actions.
- Explanation agent: converts technical results into simple language.
- Guardrail agent: checks for policy, trust, and compliance issues.

### Behavior rules
- Every agent response must be grounded in the data available.
- The assistant should ask a short clarifying question when confidence is low.
- Do not over-respond.
- Do not hallucinate certainty.
- When a recommendation is made, explain why it fits the user.
- When an action is suggested, show the consequence clearly.

### State model
The system should always know:
- who the user is,
- what they want,
- what content has already been shown,
- what action is pending,
- and what guardrails apply.

### Memory rules
Store:
- explicit preferences,
- session context,
- saved items,
- and high-signal interaction history.

Do not store unnecessary personal data.

## 8) MCP Usage Strategy

Use MCP servers only where they improve real execution.

### Good MCP uses
- Design source retrieval from Figma.
- Product docs from Google Drive.
- Task or issue context from GitHub.
- Research notes from docs.
- Internal specification lookup.
- Content references for review.

### How to use MCPs well
- Use them to fetch truth, not to replace judgment.
- Use them to reduce copy-paste work.
- Use them to keep implementation aligned with design and docs.
- Use them to inspect product context before coding.
- Use them to keep the build traceable.

### Rules for MCP-driven work
- Never assume design details if a design source exists.
- Never build without checking the latest product notes.
- Never let the agent invent structures that are already defined in docs.
- If there is a design file, use it as the source of truth.
- If there is a task file, follow it before improvising.

## 9) Senior Dev Workflow

### Before writing code
- Read the problem statement.
- Confirm the user journey.
- Define the minimum lovable flow.
- Sketch the page hierarchy.
- Identify the data needed.
- Decide the review checkpoints.

### While writing code
- Build one page or flow at a time.
- Keep components small and reusable.
- Separate display from business logic.
- Keep tool calls behind clean interfaces.
- Keep API responses structured.
- Keep state transitions explicit.

### After writing code
- Run through the product flow manually.
- Check empty states.
- Check loading states.
- Check failure states.
- Check mobile layout.
- Check copy for clarity.
- Check visual rhythm.
- Check whether the feature actually helps the user.

### Review standard
Every merged piece of work must answer:
- What user problem does this solve?
- Why does this page exist?
- What happens if the data is missing?
- What happens if the agent is unsure?
- What is the business value?

## 10) UI Build Rules

### The product must look handcrafted
Use:
- deliberate spacing,
- clear hierarchy,
- subtle motion,
- meaningful icons,
- and content-led layouts.

### The product must not look like AI slop
Avoid:
- generic templates with no personality,
- random “glassmorphism” overload,
- too many shadows,
- too many badges,
- repeated layout patterns,
- and noisy gradients.

### Preferred design patterns
- Editorial hero sections.
- Insight cards with real structure.
- Side rails for context.
- Sticky action panels.
- Conversational modules embedded into the page.
- Timeline and briefing layouts.
- Full-width content blocks for important insights.

### Interaction patterns
- Use progressive disclosure.
- Reveal complexity after the user shows intent.
- Let users click into detail rather than forcing it all at once.
- Make every AI suggestion optionally inspectable.
- Show “why this was recommended” in a friendly way.

## 11) Data and Action Discipline

### Data
Only collect data that helps the product do one of these:
- personalize,
- explain,
- recommend,
- or execute.

### Actions
Never execute a sensitive action without:
- confirmation,
- visible context,
- and clear user intent.

### Traceability
Every meaningful suggestion should log:
- input,
- retrieval source,
- reasoning summary,
- and the final action.

## 12) Content and UX Quality Bar

Before shipping any page, verify:
- Can a first-time user understand it in 10 seconds?
- Does the layout feel premium?
- Is the CTA obvious?
- Is the language human?
- Does the page reduce confusion?
- Does the AI add value beyond a normal interface?

If any answer is no, refine before shipping.

## 13) Delivery Phases

### Phase 1 — Foundation
- Landing
- Onboarding
- Conversation shell
- Basic profile storage
- First content retrieval flow

### Phase 2 — Intelligence
- Personalized recommendations
- Story briefings
- Saved items
- Feedback loop
- Better action routing

### Phase 3 — Trust and polish
- Admin review
- Guardrails
- Source display
- Better typography
- Better motion
- Better empty states
- Better mobile behavior

### Phase 4 — Production readiness
- Monitoring
- Error recovery
- Performance tuning
- Accessibility
- Role-based controls
- Analytics

## 14) Definition of Done

A feature is done only when:
- it works end to end,
- it looks intentional,
- it handles missing data,
- it handles failure,
- it is explainable,
- and it contributes to the business goal.

## 15) Final Product Standard

The final product should feel like a premium ET-native intelligence layer that makes the user say:

“This is how I want to discover business news and financial guidance now.”

That is the standard.
