import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileCheck,
  MessageSquare,
  Award,
  FileText,
  BarChart3,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header Content */}
        <div className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            The Platform
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Built for the next generation <br /> of job seekers.
          </h3>
        </div>

        {/* The Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full">
          {/* Featured Card: AI Interview (Span 2 columns, 2 rows) */}
          <Card className="md:col-span-2 md:row-span-2 relative overflow-hidden border-border/50 bg-gradient-to-b from-card to-muted/30 shadow-sm transition-all hover:shadow-md group">
            <CardHeader className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                <MessageSquare className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl font-bold">
                AI Interview Simulation
              </CardTitle>
              <CardDescription className="text-lg mt-4 leading-relaxed">
                Practice with an AI that mimics real-world interviewers. Get
                specific questions for your role and instant, actionable
                feedback on your responses.
              </CardDescription>
            </CardHeader>
            {/* Visual Decoration for the big card */}
            <div className="absolute -bottom-6 -right-6 h-40 w-40 bg-primary/5 rounded-full blur-3xl" />
          </Card>

          {/* Card: ATS Score (Span 2 columns) */}
          <Card className="md:col-span-2 border-border/50 bg-card hover:bg-muted/20 transition-colors">
            <CardHeader className="flex-row items-start gap-6 space-y-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>ATS Intelligence</CardTitle>
                <CardDescription className="mt-1">
                  We reverse-engineer corporate filters to ensure your resume
                  actually reaches a human.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          {/* Card: Resume Optimization (Span 1 column) */}
          <Card className="border-border/50 bg-card hover:border-primary/50 transition-all">
            <CardHeader>
              <FileText className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-lg">Resume Builder</CardTitle>
              <CardDescription className="text-sm">
                Auto-generate bullet points that highlight your impact.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Card: Skills Gap (Span 1 column) */}
          <Card className="border-border/50 bg-card hover:border-primary/50 transition-all">
            <CardHeader>
              <FileCheck className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-lg">Skill Gap Analysis</CardTitle>
              <CardDescription className="text-sm">
                Identify exactly what you're missing for your dream role.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
