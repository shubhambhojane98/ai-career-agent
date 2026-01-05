"use client";
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

// Mock data for the resume analysis
const analysisData = {
  atsScore: 72,
  missingKeywords: [
    "Machine Learning",
    "Python",
    "Data Analysis",
    "TensorFlow",
    "SQL",
    "Cloud Computing",
    "API Development",
    "Agile Methodology",
  ],
  improvements: [
    {
      title: "Add Quantifiable Achievements",
      description:
        "Include specific metrics and numbers to demonstrate impact (e.g., 'Increased efficiency by 40%')",
      priority: "high",
    },
    {
      title: "Include Technical Skills Section",
      description:
        "Add a dedicated section highlighting your technical proficiencies and tools",
      priority: "high",
    },
    {
      title: "Optimize Job Titles",
      description:
        "Align your job titles with industry-standard terminology for better ATS matching",
      priority: "medium",
    },
    {
      title: "Add Professional Summary",
      description:
        "Include a compelling 2-3 sentence summary at the top of your resume",
      priority: "medium",
    },
    {
      title: "Expand Education Details",
      description:
        "Include relevant coursework, honors, or certifications under your education section",
      priority: "low",
    },
  ],
};

export default function ResumeAnalysis() {
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 text-balance">
          Resume Analysis Results
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
          AI-powered insights to optimize your resume for applicant tracking
          systems
        </p>
      </div>

      {/* ATS Score Card */}
      <Card className="mb-6 border-2">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl">
                ATS Compatibility Score
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                How well your resume matches applicant tracking system
                requirements
              </CardDescription>
            </div>
            <div className="text-center sm:text-right">
              <div
                className={`text-4xl sm:text-5xl font-bold ${getScoreColor(
                  analysisData.atsScore
                )}`}
              >
                {analysisData.atsScore}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {getScoreLabel(analysisData.atsScore)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={analysisData.atsScore} className="h-3" />
          <div className="flex items-center gap-2 mt-4 text-xs sm:text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 flex-shrink-0" />
            <span>
              Your score is above average. Keep improving to reach 80%+
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Missing Keywords Card */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <CardTitle className="text-lg sm:text-xl">
                Missing Keywords
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Important terms found in similar job postings but missing from
              your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysisData.missingKeywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4">
              Consider incorporating these keywords naturally throughout your
              resume
            </p>
          </CardContent>
        </Card>

        {/* Download Actions Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <CardTitle className="text-lg sm:text-xl">
                Export Options
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              Download your optimized resume and detailed analysis report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      disabled
                      className="w-full justify-start text-sm sm:text-base"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        Download Optimized Resume
                      </span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs sm:text-sm">
                    Upgrade to Premium to download your optimized resume
                  </p>
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
                      className="w-full justify-start bg-transparent text-sm sm:text-base"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        Download Full Report (PDF)
                      </span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs sm:text-sm">
                    Upgrade to Premium to download the detailed analysis report
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="pt-2 px-1">
              <p className="text-xs text-muted-foreground">
                Unlock download features with a Premium subscription
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Improvements Card */}
      <Card className="mt-4 sm:mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <CardTitle className="text-lg sm:text-xl">
              Suggested Improvements
            </CardTitle>
          </div>
          <CardDescription className="text-sm">
            Actionable recommendations to enhance your resume's effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {analysisData.improvements.map((improvement, index) => (
              <div
                key={index}
                className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                  <div className="flex items-start sm:items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-card-foreground text-sm sm:text-base">
                      {improvement.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={`${getPriorityBadge(
                        improvement.priority
                      )} text-xs flex-shrink-0`}
                    >
                      {improvement.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {improvement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
