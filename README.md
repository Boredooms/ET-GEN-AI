[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Backend-Convex-gold?logo=convex&style=flat-square)](https://convex.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_V4-blue?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Auth-Better--Auth-indigo?style=flat-square)](https://better-auth.com/)
[![Deployment-Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel&style=flat-square)](https://vercel.com/)
[![Hackathon-ET--Gen--AI](https://img.shields.io/badge/Hackathon-ET_Gen_AI-red?style=flat-square)](https://economictimes.indiatimes.com/)

**GENZET AI** is a sophisticated, real-time financial intelligence platform designed for the next generation of investors. It transforms raw market data into actionable insights through a high-fidelity "cockpit" interface, powered by advanced AI orchestration.

> [!NOTE]
> This project was developed for the **Economic Times (ET) Gen AI HACKATHON**.

---

## 🚀 Vision
To democratize institutional-grade financial intelligence, providing every investor with the same level of analytical power, real-time data, and AI-driven insights previously reserved for top-tier wealth managers.

## ✨ Core Features

### 📈 Live Market Intelligence
- **Real-time Feeds**: Live tracking of **Nifty 50** and **BSE Sensex** via optimized API proxies.
- **Sectoral Health Engine**: Dynamic "Invest/Avoid" signals for key Indian sectors (IT, Banking, Auto, etc.) based on real-time volatility and momentum.
- **AI Predictions**: Integrated machine learning layers to project potential market corrections and growth phases.

### 🛡️ Strategic Portfolio Analytics
- **Glassmorphic Visuals**: High-end, interactive "Portfolio Donut" charts with real-time risk-level indicators.
- **Investment DNA**: Deep profiling of user risk sensitivity, core objectives, and knowledge focus.
- **Asset Allocation**: AI-driven suggestions for rebalancing between Equities, Fixed Income, and Alternatives.

### 🤖 AI Financial Concierge
- **Context-Aware Insights**: Personalized financial advice based on user profile and current market conditions.
- **Natural Language Interaction**: Seamless chat interface for querying market data, news, and portfolio health.
- **Secure Processing**: Privacy-focused AI orchestration ensuring user data remains protected.

## 🛠️ Technology Stack

- **Frontend**: [Next.js 15+](https://nextjs.org) (App Router, Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) & [shadcn/ui](https://ui.shadcn.com)
- **Backend**: [Convex](https://convex.dev) (Real-time database, Auth, Actions)
- **Authentication**: [Better Auth](https://better-auth.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Charts**: [Recharts](https://recharts.org)

---

## 🏗️ Detailed Implementation & Logic
For a "Proper" deep-dive into the technical architecture and the logic behind our **Sectoral Momentum Engine**, **AI Orchestrator**, and **Investment DNA**, please refer to our **[Idea & Implementation Report](idea_implementation_report.md)**.

### Key "Proper" Implementations:
- **Live Market Health**: Dynamic `Invest/Avoid` signals for Indian markets.
- **AI Intent Mapping**: Recursive loops to connect user goals with ET products.
- **Glassmorphic Cockpit**: A premium, industrial-grade UX/UI for serious investors.

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- A [Convex](https://convex.dev) account
- (Optional) Zerodha/Upstox API keys for full portfolio sync

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Boredooms/ET-GEN-AI.git
   cd ET-GEN-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file with the following:
   ```env
   # Convex
   CONVEX_URL=your_convex_url
   NEXT_PUBLIC_CONVEX_URL=your_convex_url

   # Auth
   BETTER_AUTH_SECRET=your_32_char_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # AI & Market
   OLLAMA_API_KEY=your_key
   OLLAMA_BASE_URL=https://api.ollama.com
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

This project is optimized for deployment on the **Vercel** platform.

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the environment variables from your `.env.local` to the Vercel dashboard.
4. Update `NEXT_PUBLIC_APP_URL` to your production URL.

---

Built with 🖤 by **Devargho Chakraborty**. Elevate your financial intelligence.
