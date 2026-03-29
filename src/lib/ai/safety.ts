// AI Safety — Guardrails and compliance helpers

const FINANCIAL_DISCLAIMER =
  "This is for informational purposes only and should not be construed as financial advice. Please consult a certified financial advisor before making investment decisions.";

const BANNED_PHRASES = [
  "you should buy",
  "you should sell",
  "guaranteed returns",
  "risk-free",
  "100% safe",
  "sure to profit",
];

/**
 * Check if a response contains unsafe financial claims
 */
export function hasSensitiveFinancialContent(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_PHRASES.some((phrase) => lower.includes(phrase));
}

/**
 * Append safety disclaimer when financial content is detected
 */
export function applyFinancialGuardrail(text: string): string {
  if (hasSensitiveFinancialContent(text)) {
    return `${text}\n\n*${FINANCIAL_DISCLAIMER}*`;
  }
  return text;
}

/**
 * Check if query is about regulated financial products
 */
export function isFinancialQuery(query: string): boolean {
  const financialKeywords = [
    "invest",
    "stock",
    "buy",
    "sell",
    "portfolio",
    "mutual fund",
    "equity",
    "nifty",
    "sensex",
    "tax",
    "returns",
    "profit",
    "loss",
  ];
  const lower = query.toLowerCase();
  return financialKeywords.some((kw) => lower.includes(kw));
}

/**
 * Sanitize user input — strip script tags, trim
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 2000); // cap at 2000 chars
}

/**
 * Rate limit tracker (in-memory, per IP for edge)
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxRequests = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (record.count >= maxRequests) {
    return false; // rate limited
  }

  record.count++;
  return true; // allowed
}
