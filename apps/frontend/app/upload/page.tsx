"use client";

import type React from "react";
import { useRouter } from "next/navigation";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

type LoadingStep = "parsing" | "matching" | "generating";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function UploadPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<LoadingStep | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();
  console.log(user?.id);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      setError("Please upload a PDF file only");
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        setResumeFile(file);
      } else {
        setError("Please upload a PDF file only");
      }
    },
    []
  );

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription.trim()) return;

    console.log("------START-_---");

    setIsLoading(true);
    setError(null);

    try {
      setCurrentStep("parsing");

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("job_description", jobDescription);

      setCurrentStep("matching");

      const response = await fetch(`${API_BASE_URL}/api/v1/resume/ats-check`, {
        method: "POST",
        body: formData,
        headers: {
          "user-id": user?.id ?? "",
        },
      });

      console.log(response);

      setCurrentStep("generating");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to analyze resume");
      }

      const result = await response.json();
      if (!user?.id) {
        localStorage.setItem("ats_result", JSON.stringify(result));
      }
      console.log("ATS Result:", result);
      router.push("/result");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
      setCurrentStep(null);
    }
  };

  const isSubmitDisabled = !resumeFile || !jobDescription.trim() || isLoading;

  const getStepLabel = (step: LoadingStep) => {
    switch (step) {
      case "parsing":
        return "Parsing Resume";
      case "matching":
        return "Matching Skills";
      case "generating":
        return "Generating Analysis";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-balance">
            Upload Your Resume
          </CardTitle>
          <CardDescription className="text-pretty">
            Upload your resume and paste the job description to get personalized
            interview prep
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resume Upload Section */}
          <div className="space-y-2">
            <label
              htmlFor="resume-upload"
              className="text-sm font-medium leading-none"
            >
              Resume (PDF only)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 transition-colors",
                isDragging && "border-primary bg-accent",
                !isDragging && "border-border hover:border-muted-foreground/50",
                resumeFile && "border-primary bg-accent/50"
              )}
            >
              <input
                id="resume-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
              <div className="flex flex-col items-center gap-3 text-center">
                {resumeFile ? (
                  <>
                    <FileText className="size-10 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{resumeFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(resumeFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setResumeFile(null);
                      }}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload className="size-10 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Drop your resume here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF files only
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="space-y-2">
            <label
              htmlFor="job-description"
              className="text-sm font-medium leading-none"
            >
              Job Description
            </label>
            <Textarea
              id="job-description"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isLoading}
              className="min-h-40 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {jobDescription.length} characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-3">
              <AlertCircle className="size-4 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Loading Steps */}
          {isLoading && currentStep && (
            <div className="flex items-center gap-3 rounded-md bg-primary/5 border border-primary/10 p-4">
              <Loader2 className="size-5 text-primary animate-spin" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium">
                  {getStepLabel(currentStep)}
                </p>
                <div className="flex gap-2">
                  {(["parsing", "matching", "generating"] as LoadingStep[]).map(
                    (step) => (
                      <div
                        key={step}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          currentStep === step
                            ? "bg-primary"
                            : ["parsing", "matching", "generating"].indexOf(
                                step
                              ) <
                              ["parsing", "matching", "generating"].indexOf(
                                currentStep
                              )
                            ? "bg-primary/40"
                            : "bg-border"
                        )}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze My Profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
