// helpers/getAtsAnalysisId.ts
import { supabase } from "@/lib/supabase/client";

export const getLatestAtsAnalysisId = async (userId: string) => {
  const { data, error } = await supabase
    .from("ats_analyses")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching ATS Analysis ID:", error.message);
    return null;
  }

  return data?.id ?? null;
};

// export const getLatestAtsAnalysisId = async (userId: string) => {
//   const { data, error } = await supabase
//     .from("ats_analyses")
//     .select("id")
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false })
//     .limit(1)
//     .maybeSingle(); // This is the magic change

//   if (error) {
//     // This now ONLY logs if the database is actually broken
//     console.error("Database Error:", error.message);
//     return null;
//   }

//   // If no data is found, data is null, no error is thrown, console stays clean!
//   return data?.id ?? null;
// };
