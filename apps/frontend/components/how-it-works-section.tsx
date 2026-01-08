import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, Target } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Documents",
    description:
      "Upload your resume and paste the job description. Our AI analyzes both to understand your profile and target role.",
  },
  {
    icon: Sparkles,
    title: "Get AI-Powered Insights",
    description:
      "Receive personalized interview questions, ATS compatibility score, and detailed feedback on your resume.",
  },
  {
    icon: Target,
    title: "Ace Your Interview",
    description:
      "Practice with AI-generated questions, improve your answers, and get a tailored resume optimized for the role.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Three simple steps to transform your interview preparation and land
            your dream job
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-border bg-card transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mb-2 text-sm font-semibold text-primary">
                  Step {index + 1}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-balance text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
