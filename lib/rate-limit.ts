import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
  skipIf?: (req: NextRequest) => boolean;
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = getClientIdentifier,
    skipIf,
    message = "Too many requests, please try again later.",
  } = config;

  return async (req: NextRequest): Promise<NextResponse | null> => {
    if (skipIf && skipIf(req)) {
      return null;
    }

    const key = keyGenerator(req);
    const now = Date.now();
    const resetTime = now + windowMs;

    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      entry = {
        count: 1,
        resetTime,
      };
      rateLimitStore.set(key, entry);
      return null;
    }

    if (entry.count >= maxRequests) {
      return NextResponse.json(
        {
          error: message,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": entry.resetTime.toString(),
            "Retry-After": Math.ceil((entry.resetTime - now) / 1000).toString(),
          },
        }
      );
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    return null;
  };
}

export const rateLimitConfigs = {
  auth: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: "Too many authentication attempts, please try again later.",
  },

  api: {
    windowMs: 60 * 1000,
    maxRequests: 60,
    message: "Too many API requests, please slow down.",
  },

  webhook: {
    windowMs: 60 * 1000,
    maxRequests: 100,
    message: "Webhook rate limit exceeded.",
  },

  general: {
    windowMs: 60 * 1000,
    maxRequests: 100,
    message: "Too many requests, please try again later.",
  },
} as const;

export function withRateLimit<T extends unknown[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    const rateLimitResult = await rateLimit(config)(req);

    if (rateLimitResult) {
      return rateLimitResult;
    }

    return handler(req, ...args);
  };
}
