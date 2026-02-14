import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-background pt-24 overflow-hidden">
      {/* Visual background flair to match the Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Final CTA Section - Instead of just ending, we invite them back */}
        <div className="mb-24 rounded-3xl bg-muted/30 border border-border p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to land your dream role?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join 10,000+ professionals using AI to outpace the competition.
              Start your first simulation today.
            </p>
            <Link href="/upload">
              <Button
                size="lg"
                className="rounded-full px-8 shadow-xl shadow-primary/20"
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
          {/* Subtle decoration inside CTA */}
          <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="grid gap-12 md:grid-cols-12 pb-12">
          {/* Brand Info */}
          <div className="md:col-span-4">
            <Link href="/" className="mb-6 flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:rotate-12">
                <span className="text-xs font-bold">AI</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                CareerCoach
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The world’s first career intelligence platform designed to help
              you navigate the modern job market with confidence.
            </p>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                Product
              </h3>
              <nav className="flex flex-col gap-2">
                {["Features", "Pricing", "How it Works"].map((link) => (
                  <Link
                    key={link}
                    href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                Company
              </h3>
              <nav className="flex flex-col gap-2">
                {["About", "Blog", "Careers"].map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                Legal
              </h3>
              <nav className="flex flex-col gap-2">
                {["Privacy", "Terms", "Cookies"].map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-border py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} CareerCoach AI. Built for the future of work.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-xs">Twitter</span>
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-xs">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
