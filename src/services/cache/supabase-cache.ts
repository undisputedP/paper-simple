import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { hashString } from "@/lib/security";
import type { Explanation, DepthLevel } from "@/types/paper";

export async function getCachedExplanation(
  paperText: string,
  depth: DepthLevel
): Promise<Explanation | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const textHash = await hashString(paperText);

    const { data, error } = await supabase
      .from("paper_cache")
      .select("explanation")
      .eq("text_hash", textHash)
      .eq("depth", depth)
      .single();

    if (error || !data) return null;

    // Increment access count in background
    supabase
      .from("paper_cache")
      .update({ access_count: (data as { access_count?: number }).access_count || 1 })
      .eq("text_hash", textHash)
      .eq("depth", depth)
      .then(() => {});

    return data.explanation as Explanation;
  } catch {
    return null;
  }
}

export async function cacheExplanation(
  paperText: string,
  depth: DepthLevel,
  explanation: Explanation
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    const textHash = await hashString(paperText);

    await supabase.from("paper_cache").upsert(
      {
        text_hash: textHash,
        depth,
        explanation,
        access_count: 1,
      },
      { onConflict: "text_hash,depth" }
    );
  } catch {
    // Silently fail — caching is non-critical
  }
}
