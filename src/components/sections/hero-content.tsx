import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroContent() {
  return (
    <section className="bg-background py-16 sm:py-20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl premium-red-text">
          The Future of Internet is SOON
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground">
          Get the fastest and most reliable internet with SOON's pure fiber-optic network. The future is here, and it's faster than ever.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="transition-transform hover:scale-105">
            <Link href="#pricing">View Plans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
