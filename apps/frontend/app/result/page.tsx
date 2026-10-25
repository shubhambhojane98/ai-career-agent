"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  ArrowLeft,
  Upload,
  LayoutDashboard,
  Video,
  Loader2,
} from "lucide-react";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import InterviewsFeedback from "@/components/interview_feedback";

/* ================= TYPES ================= */

type Improvement = {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
};

type ATSResult = {
  ats_score: number;
  overall_fit: string;
  semantic_similarity: number;
  matched_skills: string[];
  missing_skills: string[];
  keyword_gaps: string[];
  experience_match: string;
  improvements: Improvement[];
  summary: string;
  recommendations: string[];
};

export default function ResumeAnalysis() {
  const { user, isLoaded } = useUser();
  const [analysisData, setAnalysisData] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(user?.id);

  useEffect(() => {
    if (!isLoaded) return;

    if (user?.id) {
      fetchFromSupabase(user.id);
    } else {
      fetchFromLocalStorage();
    }
  }, [isLoaded, user]);

  const fetchFromSupabase = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ats_analyses")
      .select("analysis")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
      fetchFromLocalStorage();
      return;
    }

    if (data?.analysis) {
      setAnalysisData(data.analysis);
      setLoading(false);
    } else {
      // Fallback to local storage if user just signed up after an anonymous check
      fetchFromLocalStorage();
    }
  };

  const fetchFromLocalStorage = () => {
    const storedResult = localStorage.getItem("ats_result");
    if (!storedResult) {
      setLoading(false);
      return;
    }
    try {
      setAnalysisData(JSON.parse(storedResult));
    } catch (err) {
      console.error("Invalid ATS result data", err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
      medium:
        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
      low: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    };
    return variants[priority as keyof typeof variants] || variants.low;
  };

  const backHref = user ? "/dashboard" : "/";
  const backLabel = user ? "Back to Dashboard" : "Back to Home";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href={backHref}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>{backLabel}</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shrink-0">
                <span className="text-[10px] font-bold text-white">AI</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground">
                CareerCoach
              </span>
            </Link>
            <div className="w-16" />
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
          <p>Fetching your analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href={backHref}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>{backLabel}</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shrink-0">
                <span className="text-[10px] font-bold text-white">AI</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground">
                CareerCoach
              </span>
            </Link>
            <div className="w-16" />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center border-dashed">
            <CardHeader className="space-y-2">
              <CardTitle>No Analysis Found</CardTitle>
              <CardDescription>
                Upload your resume and target job description to generate your ATS analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/upload">
                <Button className="gap-2">
                  <Upload className="h-4 w-4" /> Upload Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href={backHref}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>{backLabel}</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shrink-0">
              <span className="text-[10px] font-bold text-white">AI</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">
              CareerCoach
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/result">
                <Button variant="ghost" size="sm" className="text-xs">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
        {/* Header & Quick Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Resume Analysis Results
            </h1>
            <p className="text-muted-foreground text-sm">
              AI-powered insights to optimize your resume for ATS systems
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {user && (
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            <Link href="/upload">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload New
              </Button>
            </Link>
            <Link href="/dashboard/interview">
              <Button size="sm" className="gap-2 shadow-sm">
                <Video className="h-4 w-4" />
                Mock Interview
              </Button>
            </Link>
          </div>
        </div>

      {/* ATS Score Card */}
      <Card className="mb-6 border-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>ATS Compatibility Score</CardTitle>
            <div className="text-right">
              <div
                className={`text-5xl font-bold ${getScoreColor(
                  analysisData.ats_score
                )}`}
              >
                {analysisData.ats_score}%
              </div>
              <p className="text-muted-foreground">
                {getScoreLabel(analysisData.ats_score)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={analysisData.ats_score} />
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Improve skills to reach 80%+
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Missing Skills */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle>Missing Keywords</CardTitle>
            </div>
            <CardDescription>
              Skills found in JD but missing in resume
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {[...analysisData.missing_skills, ...analysisData.keyword_gaps].map(
              (skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              )
            )}
          </CardContent>
        </Card>

        {/* Export Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Export Options</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button disabled className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" /> Download Optimized Resume
            </Button>
            <Button disabled variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" /> Download Full Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Improvements Card */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <CardTitle>Suggested Improvements</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisData.improvements.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:bg-accent/40 transition"
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{item.title}</h3>
                <Badge className={`${getPriorityBadge(item.priority)} text-xs`}>
                  {item.priority.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI INTERVIEW FEEDBACK 
          Only show for logged-in users who have a Supabase record 
      */}
      <InterviewsFeedback />
      </main>
    </div>
  );
}
