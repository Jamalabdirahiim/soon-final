import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";

export default function Hero() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-background');

  return (
    <section id="home" className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center p-0">
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
    </section>
  );
}
