import Image from "next/image";
import { Card } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { BluezoneIcon } from "../bluezone-icon";

export default function FeatureHighlight() {
  const featureImage = placeholderImages.find(p => p.id === 'feature-highlight-image');

  return (
    <section id="feature" className="bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">SOON | FIBER TO THE HOME & BUSINESS</div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              BLUE ZONE
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Through our partnerships with local communities, our focus is on creating a network of total linkage whereas other providers have failed to deliver. We are an excellent rather than an average data architect emerging from Somalia.
            </p>
          </div>

          <div className="bg-[#1C2C5B] p-8 rounded-lg text-white h-full flex flex-col justify-between">
            <div>
              <h3 className="text-4xl font-bold">FIBER BLUE</h3>
              <p className="mt-2 text-lg">INTERNETKA GURYAHA IYO GOOBAHA GANACSIGA</p>
            </div>
            <div className="flex items-center my-8">
              <BluezoneIcon />
            </div>
            {featureImage && (
              <div className="self-end -mb-8 -mr-8">
                 <Image
                    src={featureImage.imageUrl}
                    alt={featureImage.description}
                    width={400}
                    height={300}
                    className="object-contain"
                    data-ai-hint={featureImage.imageHint}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
