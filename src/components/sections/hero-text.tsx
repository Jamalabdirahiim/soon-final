
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroTextProps {
  content?: {
    headline: string;
    subheadline: string;
  };
}

export default function HeroText({ content }: HeroTextProps) {
  const headline = content?.headline || "The Future of Connectivity. Delivered.";
  const subheadline = content?.subheadline || "Get the fastest and most reliable internet with SOON's pure fiber-optic network. The future is here, and it's faster than ever.";

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl premium-red-text">
          {headline}
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground md:text-xl">
          {subheadline}
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="premium-red-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105">
            <Link href="#pricing">View Plans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

    