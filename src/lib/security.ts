/**
 * Security utilities — sanitization, validation, rate limiting
 */

// Strip HTML tags and script content from user input
export function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "data_")
    .trim();
}

// Validate that a file is actually a PDF by checking magic bytes
export async function validatePdfFile(file: File): Promise<{
  valid: boolean;
  error?: string;
}> {
  // Check MIME type
  if (file.type !== "application/pdf") {
    return { valid: false, error: "File is not a PDF." };
  }

  // Check file size (max 50MB)
  const MAX_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: "File exceeds 50MB limit." };
  }

  // Check file size (min 100 bytes — reject empty/tiny files)
  if (file.size < 100) {
    return { valid: false, error: "File is too small to be a valid PDF." };
  }

  // Check PDF magic bytes (%PDF-)
  try {
    const header = await file.slice(0, 5).text();
    if (!header.startsWith("%PDF-")) {
      return {
        valid: false,
        error: "File does not have valid PDF headers. It may be corrupted or not a real PDF.",
      };
    }
  } catch {
    return { valid: false, error: "Could not read file headers." };
  }

  // Check filename extension
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { valid: false, error: "File does not have a .pdf extension." };
  }

  return { valid: true };
}

// Client-side rate limiter using in-memory tracking
const rateLimitStore = new Map<string, number[]>();

export function clientRateLimit(
  action: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const key = action;
  const timestamps = rateLimitStore.get(key) || [];

  // Remove expired entries
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= maxRequests) {
    const oldestValid = valid[0];
    const retryAfterMs = windowMs - (now - oldestValid);
    return { allowed: false, retryAfterMs };
  }

  valid.push(now);
  rateLimitStore.set(key, valid);
  return { allowed: true, retryAfterMs: 0 };
}

// Sanitize review name (alphanumeric + basic punctuation only)
export function sanitizeReviewName(name: string): string {
  return sanitizeText(name).replace(/[^\w\s.,'-]/g, "").substring(0, 100);
}

// Sanitize review comment
export function sanitizeReviewComment(comment: string): string {
  return sanitizeText(comment).substring(0, 1000);
}

// Hash a string using SHA-256 (for paper text hashing and IP anonymization)
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
