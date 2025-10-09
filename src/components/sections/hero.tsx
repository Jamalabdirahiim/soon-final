
"use client";

import { content } from "@/lib/content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { useUser } from "@/firebase";

export default function Hero() {
  const { headline, subheadline } = content.hero;
  const { user } = useUser();

  return (
    <section id="home" className="w-full bg-secondary pt-32 pb-20 md:pt-48 md:pb-32">
      <div className="container mx-auto px-4 text-center">
        <Fade triggerOnce direction="up" cascade damping={0.2}>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
            {subheadline}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105 shadow-lg">
              <Link href="#pricing">View Plans</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="transition-transform hover:scale-105">
              <Link href="#iptv">Explore IPTV</Link>
            </Button>
          </div>
        </Fade>
      </div>
    </section>
  );
}
