
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { content } from "@/lib/content";

export default function Iptv() {
  const iptvImage = placeholderImages.find(p => p.id === 'iptv-hero');

  return (
    <section id="iptv" className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              SOON IPTV
            </div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl premium-blue-text">
              {content.iptv.headline}
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              {content.iptv.subheadline}
            </p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary">400+</div>
              <div className="text-lg text-muted-foreground">Live TV Channels</div>
            </div>
            <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105">
              <Link href="#contact">Get It Now</Link>
            </Button>
          </div>
          
          <div className="relative rounded-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            {iptvImage && (
              <Image
                src={iptvImage.imageUrl}
                alt={iptvImage.description}
                width={1200}
                height={900}
                className="w-full h-auto object-cover"
                data-ai-hint={iptvImage.imageHint}
                key={iptvImage.id}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
