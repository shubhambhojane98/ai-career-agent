"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import { MetricCard } from "@/components/metric-card";
import {
  Video,
  Target,
  Zap,
  Clock,
  ChevronRight,
  Upload,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type AtsRecord = {
  id?: string;
  created_at?: string;
  analysis?: {
    ats_score?: number;
    keyword_gaps?: string[];
    missing_skills?: string[];
  };
};

type SessionRecord = {
  id: string;
  created_at: string;
  interview_feedback?: {
    feedback: {
      overall_score: number;
    };
  }[];
};

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    latestAts: null as AtsRecord | null,
    recentSessions: [] as SessionRecord[],
    stats: {
      atsScore: 0,
      avgInterview: 0,
      totalSessions: 0,
      missingSkillsCount: 0,
    },
  });

  useEffect(() => {
    if (isLoaded && user?.id) fetchDashboardData(user.id);
  }, [isLoaded, user]);

  async function fetchDashboardData(userId: string) {
    setLoading(true);

    try {
      // 1. Fetch Latest ATS & Skill Gaps
      const { data: ats } = await supabase
        .from("ats_analyses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // 2. Fetch Recent Sessions with Feedback (Joining logic)
      const { data: sessions } = await supabase
        .from("interview_sessions")
        .select(
          `
          id,
          created_at,
          interview_feedback (feedback)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      const typedSessions = (sessions as unknown as SessionRecord[]) || [];
      const feedbacks =
        typedSessions.filter((s) => s.interview_feedback?.[0]) || [];
      const avg = feedbacks.length
        ? feedbacks.reduce(
            (acc, s) =>
              acc + (s.interview_feedback?.[0]?.feedback?.overall_score || 0),
            0
          ) / feedbacks.length
        : 0;

      setData({
        latestAts: ats as AtsRecord | null,
        recentSessions: typedSessions,
        stats: {
          atsScore: ats?.analysis?.ats_score || 0,
          avgInterview: Number(avg.toFixed(1)),
          totalSessions: typedSessions.length,
          missingSkillsCount:
            ats?.analysis?.keyword_gaps?.length ||
            ats?.analysis?.missing_skills?.length ||
            0,
        },
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <div className="p-8">Loading your career insights...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-10">
      {/* Header with quick actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Hello, {user?.firstName || "there"}!
          </h1>
          <p className="text-muted-foreground text-lg">
            {data.latestAts
              ? data.stats.atsScore > 70
                ? "Your career prep is on track."
                : "Your resume needs focus to increase your ATS match."
              : "Welcome! Upload your resume and job description to get started."}
          </p>
        </div>
        {!data.latestAts && (
          <Link href="/upload">
            <Button className="flex items-center gap-2">
              <Upload size={16} /> Upload Resume
            </Button>
          </Link>
        )}
      </div>

      {/* Primary Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Resume Strength"
          value={`${data.stats.atsScore}%`}
          icon={Target}
          description="Latest ATS match"
        />
        <MetricCard
          title="Interview Avg"
          value={`${data.stats.avgInterview}/5`}
          icon={Video}
          description="Based on AI mockups"
        />
        <MetricCard
          title="Gaps Found"
          value={data.stats.missingSkillsCount}
          icon={Zap}
          description="Skills to acquire"
        />
        <MetricCard
          title="Sessions"
          value={data.stats.totalSessions}
          icon={Clock}
          description="Total attempts"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Recent Activity List */}
        <Card className="lg:col-span-2 shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Interview Sessions</CardTitle>
            {data.recentSessions.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Last {data.recentSessions.length} session(s)
              </span>
            )}
          </CardHeader>
          <CardContent>
            {data.recentSessions.length > 0 ? (
              <div className="space-y-4">
                {data.recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Video size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          Session #{session.id.slice(0, 5)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {session.interview_feedback?.[0] ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        >
                          Score:{" "}
                          {session.interview_feedback[0].feedback.overall_score}/5
                        </Badge>
                      ) : (
                        <Badge variant="outline">In Progress</Badge>
                      )}
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  No interview sessions recorded yet.
                </p>
                <Link href="/dashboard/interview">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Video size={16} /> Start Mock Interview
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Col: Skill Gap Summary */}
        <Card className="shadow-sm border-muted h-full">
          <CardHeader>
            <CardTitle className="text-lg">Skill Gap Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.latestAts?.analysis?.missing_skills?.length ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {data.latestAts.analysis.missing_skills
                    .slice(0, 6)
                    .map((skill: string) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="px-3 py-1 border-dashed border-primary/40 text-primary"
                      >
                        + {skill}
                      </Badge>
                    ))}
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase mb-1">
                    AI Recommendation
                  </p>
                  <p className="text-sm italic text-muted-foreground">
                    &quot;Focus on improving your{" "}
                    {data.latestAts.analysis.missing_skills[0] || "technical"}{" "}
                    skills to boost your match rate.&quot;
                  </p>
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground space-y-2">
                <p>No skill gaps identified yet.</p>
                <p className="text-xs text-muted-foreground">
                  Upload a resume and job description to see tailored skill recommendations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
