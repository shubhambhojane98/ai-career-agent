// components/interview-empty-state.tsx
import { Button } from "@/components/ui/button";
import { Video, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const StartInterviewCTA = () => {
  const router = useRouter();

  return (
    <div className="mt-12 py-10 px-6 border border-dashed rounded-xl bg-muted/20 flex flex-col items-center gap-4 text-center">
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">No feedback found</h3>
        <p className="text-sm text-muted-foreground">
          You haven&apos;t completed an AI interview yet.
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
