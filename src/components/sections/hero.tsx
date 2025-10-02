import Image from "next/image";
import Link from "next/link";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-background');

  return (
    <section id="home" className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center text-center">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          priority
          className="object-cover z-0"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 container text-white px-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl premium-red-text">
          The Future of Internet is SOON
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-primary-foreground/80">
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
