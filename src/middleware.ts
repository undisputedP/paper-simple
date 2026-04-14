import { NextRequest, NextResponse } from "next/server";

// In-memory rate limit store (per-instance, resets on restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_API_REQUESTS = 30; // per minute per IP

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= MAX_API_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}

// Cleanup stale entries periodically
function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
let lastCleanup = 0;

export function middleware(request: NextRequest) {
  const now = Date.now();
  if (now - lastCleanup > 300_000) {
    cleanupRateLimits();
    lastCleanup = now;
  }

  const response = NextResponse.next();

  // Security headers on all responses
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Rate limiting on API routes only
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = getClientIp(request);
    const allowed = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-Content-Type-Options": "nosniff",
          },
        }
      );
    }

    // Additional rate limiting for write operations
    if (request.method === "POST") {
      const writeKey = `${ip}:write`;
      const writeEntry = rateLimitMap.get(writeKey);
      const writeLimit = 10; // 10 writes per minute

      if (!writeEntry || now > writeEntry.resetAt) {
        rateLimitMap.set(writeKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
      } else if (writeEntry.count >= writeLimit) {
        return NextResponse.json(
          { error: "Too many write requests. Please slow down." },
          { status: 429, headers: { "Retry-After": "60" } }
        );
      } else {
        writeEntry.count++;
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
