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

const features = [
  {
    icon: MessageSquare,
    title: "AI Interview Questions",
    description:
      "Get role-specific interview questions tailored to your target position and experience level.",
  },
  {
    icon: Award,
    title: "Answer Feedback",
    description:
      "Receive instant AI-powered feedback on your interview answers to improve your responses.",
  },
  {
    icon: BarChart3,
    title: "ATS Score Analysis",
    description:
      "Check how well your resume performs against Applicant Tracking Systems with detailed metrics.",
  },
  {
    icon: FileText,
    title: "Resume Optimization",
    description:
      "Get a tailored resume optimized for your target role with keyword suggestions and formatting tips.",
  },
  {
    icon: FileCheck,
    title: "Skills Gap Analysis",
    description:
      "Identify skill gaps between your profile and job requirements with actionable recommendations.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Receive comprehensive analysis and feedback in seconds, not hours or days.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/50 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Comprehensive AI-powered tools to help you prepare for interviews
            and optimize your application
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border bg-card transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
