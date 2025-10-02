import Image from "next/image";
import { Button } from "@/components/ui/button";
import { placeholderImages } from "@/lib/placeholder-images.json";

export default function CoverageMap() {
  const mapImage = placeholderImages.find(p => p.id === 'coverage-map-image');

  return (
    <section id="coverage" className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1 flex items-center justify-center">
            {mapImage && (
              <div className="overflow-hidden rounded-lg border-4 border-white shadow-2xl">
                <Image
                  src={mapImage.imageUrl}
                  alt={mapImage.description}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  data-ai-hint={mapImage.imageHint}
                />
              </div>
            )}
          </div>
          <div className="order-1 lg:order-2 space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Network</div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
              Expanding Our Reach Daily
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              SOON is committed to bringing high-speed fiber internet to every corner of the city. Our network is constantly growing. Check if your home or business is in our coverage area.
            </p>
            <Button size="lg">Check Availability</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
