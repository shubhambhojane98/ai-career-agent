"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AIInterviewRoom from "@/components/AIInterviewRoom";
import { getLatestAtsAnalysisId } from "@/helpers/getAtsAnalysisId";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";

export default function InterviewPage() {
  const router = useRouter();
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (!atsAnalysisId) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center items-center">
        <Card className="max-w-lg w-full text-center border-dashed">
          <CardHeader className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Upload className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl">Resume Analysis Required</CardTitle>
            <CardDescription className="text-sm text-muted-foreground max-w-sm">
              Our AI interviewer customizes every question to your actual resume
              and target job description. Upload your documents to unlock the
              interview simulation.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              onClick={() => router.push("/upload")}
              className="flex items-center gap-2 mx-auto"
            >
              <Upload className="h-4 w-4" />
              Upload Resume & Job Description
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AIInterviewRoom atsAnalysisId={atsAnalysisId} />;
}
