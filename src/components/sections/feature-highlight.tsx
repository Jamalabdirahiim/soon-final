import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { placeholderImages } from "@/lib/placeholder-images.json";

export default function FeatureHighlight() {
  const featureImage = placeholderImages.find(p => p.id === 'feature-highlight-image');

  return (
    <section id="feature" className="bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Feature</div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                Uninterrupted Connectivity
              </h2>
            </div>
            <p className="text-muted-foreground md:text-lg">
              Our state-of-the-art network infrastructure is built for resilience and stability. Say goodbye to buffering, lag, and dropped connections. Whether you're in a critical video conference, streaming 4K content, or gaming online, SOON delivers a consistently smooth and reliable experience, 24/7.
            </p>
            <ul className="grid gap-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-primary" />
                    99.9% Uptime Guarantee
                </li>
                <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-primary" />
                    Low Latency for Gaming & Calls
                </li>
                <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-primary" />
                    Weather-Resistant Fiber Lines
                </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            {featureImage && (
              <Card className="overflow-hidden shadow-lg">
                <Image
                  src={featureImage.imageUrl}
                  alt={featureImage.description}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  data-ai-hint={featureImage.imageHint}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
