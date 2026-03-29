import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderColor: {
        border: "var(--border)",
      },
      outlineColor: {
        ring: "var(--ring)",
      },
      backgroundColor: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        input: "var(--input)",
      },
      textColor: {
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;

