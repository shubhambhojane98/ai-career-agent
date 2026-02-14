import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    // FIX 1: Added overflow-hidden to the section to clip those circles
    <section className="relative min-h-screen flex items-center pt-28 md:pt-20 overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Beta: Real-time Voice Mock Interviews
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]">
              Your career, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-600">
                engineered by AI.
              </span>
            </h1>

            <p className="max-w-[480px] text-lg text-muted-foreground leading-relaxed">
              Stop guessing. Our AI analyzes your DNA—resume, skills, and
              goals—to match you with the world's top roles and coach you until
              you're hired.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/upload">
                <Button
                  size="lg"
                  className="rounded-full w-full sm:w-auto h-14 px-8 text-md shadow-xl shadow-primary/20"
                >
                  Start Free Interview Prep
                </Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full w-full sm:w-auto h-14 px-8 text-md group"
              >
                Watch Demo{" "}
                <Play className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="relative">
            {/* Main Visual */}
            <div className="relative z-10 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-2 md:p-4 backdrop-blur-sm">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/50">
                <div className="bg-muted aspect-video flex items-center justify-center">
                  <div className="text-muted-foreground animate-pulse text-sm italic text-center px-4">
                    [ AI Interface Loading... ]
                  </div>
                </div>
              </div>
            </div>

            {/* FIX 2: Decorative background elements - positioned safely */}
            <div className="absolute -top-10 -right-10 h-64 w-64 bg-primary/20 rounded-full blur-[80px] -z-10 opacity-50 md:opacity-100" />
            <div className="absolute -bottom-10 -left-10 h-64 w-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 opacity-50 md:opacity-100" />
          </div>
        </div>
      </div>

      {/* FIX 3: Section-wide background glow that won't cause scroll */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0,transparent_70%)] pointer-events-none" />
    </section>
  );
}
