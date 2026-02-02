"use client";

import { useEffect, useState } from "react";
import AIInterviewRoom from "@/components/AIInterviewRoom";
import { getLatestAtsAnalysisId } from "@/helpers/getAtsAnalysisId";
import { useUser } from "@clerk/nextjs";

export default function InterviewPage() {
  const { user } = useUser();
  const [atsAnalysisId, setAtsAnalysisId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAtsId = async () => {
      setLoading(true);
      const id = await getLatestAtsAnalysisId(user.id);
      setAtsAnalysisId(id);
      setLoading(false);
    };

    fetchAtsId();
  }, [user]);

  console.log("ATS-ID", atsAnalysisId);

  if (loading) return <div>Loading...</div>;
  if (!atsAnalysisId)
    return <div>No ATS Analysis found. Please upload your resume first.</div>;

  return <AIInterviewRoom atsAnalysisId={atsAnalysisId} />;
}
