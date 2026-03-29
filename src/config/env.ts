// Environment variable access - validated at startup

export const env = {
  OLLAMA_API_KEY: process.env.OLLAMA_API_KEY ?? "",
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL ?? "https://ollama.com/api",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "dev-secret-change-in-production",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "dev-better-auth-secret",
  CONVEX_URL: process.env.CONVEX_URL ?? "",
} as const;

export function isProduction() {
  return env.NODE_ENV === "production";
}

export function hasOllamaKey() {
  return env.OLLAMA_API_KEY.length > 0;
}

