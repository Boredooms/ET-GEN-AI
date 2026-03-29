import { ConvexHttpClient } from "convex/browser";
import { env } from "@/config/env";

export const convex = new ConvexHttpClient(env.CONVEX_URL);
