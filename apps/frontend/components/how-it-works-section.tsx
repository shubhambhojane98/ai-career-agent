import { Upload, Sparkles, Target } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Documents",
    description:
      "Upload your resume and paste the job description. Our AI analyzes both to understand your profile.",
  },
  {
    icon: Sparkles,
    title: "Get AI-Powered Insights",
    description:
      "Receive personalized interview questions, ATS score, and detailed resume feedback instantly.",
  },
  {
    icon: Target,
    title: "Ace Your Interview",
    description:
      "Practice with AI-generated questions and get a tailored resume optimized for the specific role.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            The Process
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            From Application to Offer.
          </h3>
        </div>

        <div className="relative grid gap-12 md:grid-cols-3">
          {/* Connecting Line (Desktop Only) */}
          <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent hidden md:block" />

          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Step Number Badge */}
              <div className="relative z-10 mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                <step.icon className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />

                {/* Floating Step Number */}
                <div className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  0{index + 1}
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold tracking-tight text-foreground">
                  {step.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom Decorative Bar */}
              <div className="mt-6 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full rounded-full" />
            </div>
          ))}
        </div>

        {/* Bottom Call to Action Visual */}
        <div className="mt-20 rounded-3xl bg-muted/30 border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground italic">
            "The AI picked up on keywords I never would have thought of. I had
            my best interview yet."
            <span className="block mt-2 font-semibold not-italic text-foreground">
              — Sarah J., Software Engineer
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
