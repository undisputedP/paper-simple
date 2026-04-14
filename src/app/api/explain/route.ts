import { NextRequest, NextResponse } from "next/server";
import { sanitizeText } from "@/lib/security";
import { getCachedExplanation, cacheExplanation } from "@/services/cache/supabase-cache";
import { aiService } from "@/services/ai/mock";
import type { DepthLevel } from "@/types/paper";

const VALID_DEPTHS: DepthLevel[] = ["high-school", "undergrad", "graduate", "expert"];
const MAX_TEXT_LENGTH = 500_000; // ~500KB of text

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, depth } = body;

    // Validate inputs
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      );
    }

    if (!depth || !VALID_DEPTHS.includes(depth)) {
      return NextResponse.json(
        { error: "Invalid 'depth'. Must be one of: high-school, undergrad, graduate, expert" },
        { status: 400 }
      );
    }

    // Enforce text length limit
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: "Paper text exceeds maximum length" },
        { status: 413 }
      );
    }

    const sanitizedText = sanitizeText(text);

    // Check cache first
    const cached = await getCachedExplanation(sanitizedText, depth);
    if (cached) {
      return NextResponse.json({ explanation: cached, cached: true });
    }

    // Generate explanation
    const explanation = await aiService.explainPaper(sanitizedText, depth);

    // Cache the result
    await cacheExplanation(sanitizedText, depth, explanation);

    return NextResponse.json({ explanation, cached: false });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
