
"use client";

import { content } from "@/lib/content";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroText() {
  const { headline, subheadline } = content.hero;

  return (
    <section className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl premium-blue-text">
          {headline}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
          {subheadline}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
