"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Star,
  Trophy,
  Sparkles,
  Loader2,
  Video,
  ArrowRight,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { StartInterviewCTA } from "./startInterviewCTA";

type InterviewFeedback = {
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};

const InterviewsFeedback = () => {
  const { user, isLoaded } = useUser();
  const [interviewFeedback, setInterviewFeedback] =
    useState<InterviewFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (user?.id) {
      fetchData(user?.id);
    } else {
      setLoading(false);
    }
  }, [isLoaded, user?.id]);

  const fetchData = async (sessionId: string) => {
    try {
      setLoading(true);

      // We use .limit(1) instead of .single() to avoid 406 errors if no data exists
      const { data, error } = await supabase
        .from("interview_feedback")
        .select("feedback")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        // Log the specific message so we can see what's wrong
        console.error("Supabase Error Details:", error.message, error.details);
        return;
      }

      // If data is an array with at least one item, set the feedback
      if (data && data.length > 0) {
        setInterviewFeedback(data[0].feedback as InterviewFeedback);
      } else {
        // No feedback found for this user - this is a valid state, not an error
        setInterviewFeedback(null);
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    );
  }

  console.log("Interview Feedback", interviewFeedback);

  // If no feedback exists yet, don't render the section or show a placeholder
  if (!interviewFeedback) {
    return <StartInterviewCTA />;
  }

  return (
    <div className="mt-12 space-y-6 pt-8 border-t">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Trophy className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Interview Performance Feedback</h2>
          <p className="text-muted-foreground">
            AI insights from your technical assessment
          </p>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-muted/30 border-none">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Overall Rating
              </p>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < (interviewFeedback?.overall_score || 0)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="ml-2 text-2xl font-bold">
                  {interviewFeedback?.overall_score}/5
                </span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 py-1.5 px-4"
            >
              {interviewFeedback.overall_score >= 4
                ? "Ready for Hire"
                : "Keep Practicing"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200/50 dark:border-emerald-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" /> Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {interviewFeedback.strengths?.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed flex gap-2">
                  <span className="text-emerald-500">•</span> {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-red-50/30 dark:bg-red-950/10 border-red-200/50 dark:border-red-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" /> Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {interviewFeedback.weaknesses?.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed flex gap-2">
                  <span className="text-red-500">•</span> {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-lg">Recommended Action Plan</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {interviewFeedback.suggestions?.map((item, i) => (
            <div
              key={i}
              className="bg-background p-4 rounded-xl border border-border shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors"
            >
              <div className="absolute -right-2 -top-2 text-4xl font-black text-muted/5 group-hover:text-primary/5 transition-colors">
                {i + 1}
              </div>
              <p className="text-sm font-medium relative z-10 leading-snug">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewsFeedback;
