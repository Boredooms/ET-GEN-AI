# 🌌 GENZET AI: The Proper Real-Time Financial Cockpit
### *Official Submission: Economic Times (ET) Gen AI Hackathon &apos;26*

This document outlines the **"Proper Idea"** and the **"Proper Implementation"** that transforms a standard AI project into a high-fidelity, institutional-grade financial intelligence platform.

---

## 💡 The "Proper" Idea: The Business Concierge
The core vision is to move beyond "search" and into **"Guiding."**
Most financial apps show data; **GENZET AI** provides a **Cockpit**. It understands who the user is (their "Investment DNA") and navigates the massive Economic Times ecosystem on their behalf.

### Key Pillars:
1.  **Hyper-Personalization**: Using AI to build a profile that influences every chart and news feed.
2.  **Real-Time Context**: Not just static data, but live market momentum.
3.  **Actionability**: Every insight ends with a "Next Step" (Trade, Read, Subscribe).

---

## 🛠️ The "Proper" Implementation: Technical Deep-Dive

### 1. High-Fidelity Market Intelligence (Real-Time)
*   **Implementation**: We built a custom proxy (`src/app/api/market/route.ts`) that fetches live data for **Nifty 50**, **BSE Sensex**, and **Critical Sectors** (IT, Banking, Auto).
*   **The "Proper" Choice**: Instead of just showing numbers, we implemented a **Sectoral Momentum Engine**. It calculates volatility in real-time and provides a binary "Invest/Avoid" signal based on intraday performance.
*   **Fix**: Resolved the `^CNXBANK` 404 error by correctly mapping it to `^NSEBANK` for proper Nifty Bank coverage.

### 2. The AI Concierge Orchestrator
*   **Implementation**: A recursive AI loop that identifies **User Intent** (e.g., "I'm worried about my IT portfolio") and maps it to specific ET content.
*   **The "Proper" Choice**: We used **Convex Actions** for low-latency AI responses and **Vercel AI SDK** to manage the chat state.
*   **Security**: Integrated **Better Auth** with a Convex adapter to ensure financial data is encrypted and user-scoped.

### 3. "GenZet" Visual Cockpit (UX/UI)
*   **Implementation**: A custom design system built with **Tailwind CSS V4** and **oklch color spaces**.
*   **The "Proper" Choice**: 
    - **Glassmorphism**: Using transparent backgrounds and blur filters to create a "premium cockpit" feel.
    - **Interactive Portfolio Donut**: A custom Recharts implementation that maps risk sensitivity (Aggressive vs. Conservative) to visual indicators.
    - **Investment DNA**: A unique "Identity Card" for every user that visualizes their knowledge level and risk focus.

### 4. Deployment & Infrastructure
*   **Implementation**: Optimized for **Vercel** with a dedicated `vercel.json` and build-time environment variable bypasses.
*   **The "Proper" Choice**: 
    - **CONVEX_SITE_URL Fix**: Implemented a robust check in `src/lib/auth-server.ts` to prevent build crashes while ensuring production security.
    - **Next.js 16 (Turbopack)**: Leveraged the latest Next.js build engine for sub-second hot-reloads and optimized static generation.

---

## 🏆 Why this is a "Proper" Winning Entry
1.  **End-to-End Logic**: From signup (Onboarding) to Profile (Investment DNA) to Dashboard (Action).
2.  **Data Integrity**: Graceful error handling in the API ensures the dashboard NEVER crashes, even if a market feed is down.
3.  **Scalability**: Built on Convex's real-time engine, it can support thousands of concurrent users with zero infrastructure management.
4.  **ET Integration**: Deeply aligns with the Economic Times ecosystem, encouraging subscription and exploration of ET products.

---

**Built by:** Devargho Chakraborty  
**Project:** GENZET AI  
**Hackathon:** ET Gen AI Hackathon &apos;26  
