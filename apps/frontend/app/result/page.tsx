"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [analysisData, setAnalysisData] = useState<ATSResult | null>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("ats_result");
    if (!storedResult) return;

    try {
      setAnalysisData(JSON.parse(storedResult));
    } catch (err) {
      console.error("Invalid ATS result data", err);
    }
  }, []);

  if (!analysisData) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Loading analysis result...</p>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold mb-2">Resume Analysis Results</h1>
        <p className="text-muted-foreground">
          AI-powered insights to optimize your resume for ATS systems
        </p>
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

      {/* ===== GRID SECTION (FIXED ALIGNMENT) ===== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Missing Skills */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle>Missing Keywords</CardTitle>
            </div>
            <CardDescription>
              Skills found in job descriptions but missing in your resume
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

        {/* Download Actions Card (Aligned) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Export Options</CardTitle>
            </div>
            <CardDescription>
              Download your optimized resume and ATS report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Optimized Resume
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Upgrade to Premium to unlock downloads
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      disabled
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Full Report (PDF)
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Premium feature</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
}
