"use client";

import { Button } from "@/components/ui/button";
import { Video, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, SignUpButton } from "@clerk/nextjs";

export const StartInterviewCTA = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!user) {
    return (
      <div className="mt-12 py-10 px-6 border border-dashed rounded-xl bg-muted/20 flex flex-col items-center gap-4 text-center">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">Practice with Real-Time AI Interview</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Create an account to save your resume analysis and practice an interactive voice mock interview.
          </p>
        </div>
        <SignUpButton mode="modal" fallbackRedirectUrl="/upload">
          <Button className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Sign Up to Start Interview
            <ArrowRight className="h-4 w-4" />
          </Button>
        </SignUpButton>
      </div>
    );
  }

  return (
    <div className="mt-12 py-10 px-6 border border-dashed rounded-xl bg-muted/20 flex flex-col items-center gap-4 text-center">
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">No interview feedback found</h3>
        <p className="text-sm text-muted-foreground">
          You haven&apos;t completed an AI interview yet. Practice now to get real-time feedback.
        </p>
      </div>
      <Button
        onClick={() => router.push("/dashboard/interview")}
        className="flex items-center gap-2"
      >
        <Video className="h-4 w-4" />
        Take Mock AI Interview
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

