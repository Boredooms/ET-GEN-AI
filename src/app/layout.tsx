import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GENZET AI — Economic Times' Personal Business Concierge",
    template: "%s | GENZET AI",
  },
  description:
    "GENZET AI understands who you are in one conversation and guides you to the right news, learning, and financial opportunities on Economic Times.",
  keywords: ["Economic Times", "ET", "AI Concierge", "Business News", "Markets", "Finance", "GENZET"],
  authors: [{ name: "GENZET AI Team" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "GENZET AI — Economic Times' Personal Business Concierge",
    description:
      "Your personalized guide to the ET ecosystem. Discover the right news, insights, and financial intelligence.",
    siteName: "GENZET AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "GENZET AI",
    description: "Economic Times' AI Concierge for personalized business intelligence.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0B",
};

import { ConvexClientProvider } from "@/components/providers/convex-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="bg-background text-foreground antialiased min-h-screen custom-scrollbar">
        <ConvexClientProvider>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "oklch(0.11 0 0)",
                border: "1px solid oklch(1 0 0 / 10%)",
                color: "oklch(0.94 0 0)",
              },
            }}
          />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
