import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            AI-Powered Interview Preparation
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Crack Interviews with AI-Powered Career Coaching
          </h1>

          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            Upload your resume and job description. Get interview questions,
            answer feedback, ATS score, and a tailored resume.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full gap-2 sm:w-auto">
              Start Free Interview Prep
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 sm:w-auto bg-transparent"
            >
              <Play className="h-4 w-4" />
              See How It Works
            </Button>
          </div>

          <div className="mt-16">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <div className="relative aspect-video w-full bg-muted">
                <video
                  className="h-full w-full object-cover"
                  controls
                  poster="/ai-career-coaching-dashboard-preview.jpg"
                >
                  <source src="/video-placeholder.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"></div>
      </div>
    </section>
  );
}
