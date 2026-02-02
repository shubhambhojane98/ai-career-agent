// helpers/getAtsAnalysisId.ts
import { supabase } from "@/lib/supabase/client";

export const getLatestAtsAnalysisId = async (userId: string) => {
  const { data, error } = await supabase
    .from("ats_analyses")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching ATS Analysis ID:", error);
    return null;
  }

  return data?.id ?? null;
};
