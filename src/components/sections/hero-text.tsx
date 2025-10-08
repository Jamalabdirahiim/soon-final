
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content";

export default function HeroText() {
  const { headline, subheadline } = content.hero;

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl premium-blue-text">
          {headline}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
          {subheadline}
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105">
            <Link href="#pricing">View Plans</Link>
          </Button>
           <Button asChild size="lg" variant="outline" className="transition-transform hover:scale-105">
            <Link href="#iptv">Explore IPTV</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
