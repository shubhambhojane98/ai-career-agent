// helpers/getAtsAnalysisId.ts
import { supabase } from "@/lib/supabase/client";
import { getApiBaseUrl } from "@/lib/utils";

export const getLatestAtsAnalysisId = async (userId: string) => {
  // 1. Fetch from the backend API (queries Supabase via service role)
  const apiBase = getApiBaseUrl();
  const urlsToTry = [apiBase];
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1") &&
    !urlsToTry.includes("http://127.0.0.1:8000")
  ) {
    urlsToTry.push("http://127.0.0.1:8000");
  }

  for (const url of urlsToTry) {
    try {
      const res = await fetch(`${url}/api/v1/resume/latest`, {
        headers: {
          "user-id": userId,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.id) {
          if (typeof window !== "undefined") {
            localStorage.setItem("latest_ats_analysis_id", data.id);
          }
          return data.id;
        }
      }
    } catch (backendErr) {
      console.error(`Backend fetch error at ${url} for latest ATS ID:`, backendErr);
    }
  }

  // 2. Fallback to localStorage if cached
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("latest_ats_analysis_id");
    if (storedId) return storedId;
  }

  // 3. Fallback to Supabase direct query
  try {
    const { data, error } = await supabase
      .from("ats_analyses")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data?.id) {
      return data.id;
    }
  } catch (err) {
    console.error("Error fetching ATS Analysis ID from Supabase:", err);
  }

  return null;
};

