# ET-GEN-AI: Financial Intelligence Cockpit

A high-fidelity, professional-grade financial intelligence platform built with **Next.js 15**, **Convex**, **Tailwind CSS v4**, and **Lucide React**.

## ✨ Features

- ✅ **Live Market Data**: Real-time tracking of Nifty 50 and Sensex via custom API proxies.
- ✅ **Sector Health Engine**: Dynamic "Invest/Avoid" signals for key Indian sectors (Banks, IT, Auto, etc.).
- ✅ **Strategic Portfolio Visuals**: Premium, glassmorphic portfolio distribution charts with risk-level indicators.
- ✅ **Personalized Insights**: AI-driven financial analysis and "Investment DNA" profiling.
- ✅ **Modern Design**: High-end dark mode aesthetic with smooth transitions and responsive layouts.
- ✅ **Secure Infrastructure**: Powered by Convex backend and Better-Auth for user management.

## 📋 Project Structure

```
src/
├── app/                      # Next.js app router
│   ├── (app)/                # Authenticated application routes
│   │   ├── insights/         # Main financial dashboard
│   │   ├── profile/          # User profile & Investment DNA
│   │   └── settings/         # App & Account configuration
│   ├── api/                  # Backend API proxies (Market data, etc.)
│   └── layout.tsx            # Root layout
├── components/
│   ├── charts/               # Advanced financial visualizations
│   ├── common/               # Reusable UI components
│   └── ui/                  # shadcn/ui components
├── config/                  # App & Environment configuration
├── hooks/                   # Custom React hooks
├── lib/                     # Core utilities & Auth setup
├── types/                   # TypeScript definitions
└── utils/                   # Business logic utilities
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Convex Account
- Zerodha/Upstox API keys (Optional for trading features)

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the platform.

### Production Build

```bash
npm run build
npm start
```

## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

```env
# Convex
CONVEX_URL=your_convex_url
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Auth
BETTER_AUTH_SECRET=your_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Market Data (Optional)
ZERODHA_API_KEY=your_key
ZERODHA_API_SECRET=your_secret
```

## 📦 Tech Stack

- [Next.js 15+](https://nextjs.org)
- [Convex](https://convex.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Better Auth](https://better-auth.com)
- [Lucide Icons](https://lucide.dev)

---

Built by **Trellis Solutions**. Elevate your financial intelligence.
