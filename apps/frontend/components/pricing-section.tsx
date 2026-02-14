import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Essential tools for curious seekers.",
    features: [
      "5 resume analyses per month",
      "Basic ATS score",
      "10 AI interview questions",
      "Email support",
    ],
    cta: "Start for Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "Everything you need to land the offer.",
    features: [
      "Unlimited resume analyses",
      "Advanced ATS optimization",
      "Real-time Answer feedback",
      "Tailored resume generation",
      "Priority AI processing",
      "Mock interview recording",
    ],
    cta: "Scale Your Career",
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Pricing
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Simple, honest pricing.
          </h3>
        </div>

        {/* Max-width constrained to 4xl for 2 cards so they don't look too wide */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col transition-all duration-300 border-2 ${
                plan.highlighted
                  ? "border-primary bg-card shadow-[0_20px_50px_rgba(var(--primary),0.15)] z-10 md:scale-105"
                  : "border-border/60 bg-muted/10"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] uppercase font-black flex items-center gap-1 tracking-wider shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  Recommended
                </div>
              )}

              <CardHeader className="p-8 pb-4 text-center md:text-left">
                <CardTitle className="text-xl font-bold tracking-tight">
                  {plan.name}
                </CardTitle>
                <div className="mt-4 flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-5xl font-extrabold tracking-tighter text-foreground">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground font-medium text-lg">
                      /mo
                    </span>
                  )}
                </div>
                <CardDescription className="mt-3 text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 px-8 pt-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div
                        className={`rounded-full p-1 ${
                          plan.highlighted
                            ? "bg-primary/10"
                            : "bg-muted-foreground/10"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 shrink-0 ${
                            plan.highlighted
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <span className="text-foreground/80 font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-8 pt-4">
                <Button
                  size="lg"
                  className={`w-full rounded-2xl h-14 text-sm font-bold transition-all shadow-md active:scale-[0.98] ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30"
                      : "bg-white border-2 border-border text-foreground hover:bg-muted hover:border-foreground/30 dark:bg-zinc-900"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* <p className="mt-12 text-center text-sm text-muted-foreground">
          No hidden fees. Cancel anytime.{" "}
          <Link href="#" className="underline hover:text-primary">
            Need a student discount?
          </Link>
        </p> */}
      </div>
    </section>
  );
}
