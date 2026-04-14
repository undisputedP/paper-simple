import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sanitizeReviewName, sanitizeReviewComment } from "@/lib/security";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ reviews: [], fallback: true });
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, rating, comment, helpful, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ reviews: [], fallback: true });
    }

    return NextResponse.json({ reviews: data });
  } catch {
    return NextResponse.json({ reviews: [], fallback: true });
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { name, rating, comment } = body;

    // Validate
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be 1-5" },
        { status: 400 }
      );
    }
    if (!comment || typeof comment !== "string" || comment.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment is required" },
        { status: 400 }
      );
    }
    if (comment.length > 1000) {
      return NextResponse.json(
        { error: "Comment must be under 1000 characters" },
        { status: 400 }
      );
    }

    // Sanitize
    const cleanName = sanitizeReviewName(name);
    const cleanComment = sanitizeReviewComment(comment);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        name: cleanName,
        rating,
        comment: cleanComment,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ review: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const { error } = await supabase.rpc("increment_helpful", {
      review_id: id,
    });

    // Fallback if RPC not set up
    if (error) {
      const { data: current } = await supabase
        .from("reviews")
        .select("helpful")
        .eq("id", id)
        .single();

      if (current) {
        await supabase
          .from("reviews")
          .update({ helpful: (current.helpful || 0) + 1 })
          .eq("id", id);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
