import type { Contact } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getDashboardData(userId: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      dueFollowUps: [] as Contact[],
      recentContacts: [] as Contact[],
      totalContacts: 0,
      activeRelationships: 0,
      strategicRelationships: 0,
      error: null as string | null,
    };
  }

  const today = new Date().toISOString().slice(0, 10);

  const [dueResult, recentResult, totalResult, activeResult, strategicResult] =
    await Promise.all([
      supabase
        .from("contacts")
        .select("*")
        .eq("user_id", userId)
        .lte("next_follow_up_date", today)
        .order("next_follow_up_date", { ascending: true })
        .limit(6),
      supabase
        .from("contacts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("relationship_status", ["Warm", "Active"]),
      supabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("relationship_status", "Strategic"),
    ]);

  return {
    dueFollowUps: (dueResult.data ?? []) as Contact[],
    recentContacts: (recentResult.data ?? []) as Contact[],
    totalContacts: totalResult.count ?? 0,
    activeRelationships: activeResult.count ?? 0,
    strategicRelationships: strategicResult.count ?? 0,
    error:
      dueResult.error?.message ??
      recentResult.error?.message ??
      totalResult.error?.message ??
      activeResult.error?.message ??
      strategicResult.error?.message ??
      null,
  };
}
