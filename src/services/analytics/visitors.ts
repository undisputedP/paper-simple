import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function trackVisit(page: string = "/"): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase.from("visitors").insert({ page });
  } catch {
    // Silently fail — analytics are non-critical
  }
}

export async function getVisitorCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  try {
    const { count, error } = await supabase
      .from("visitors")
      .select("*", { count: "exact", head: true });

    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}
