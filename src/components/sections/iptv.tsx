
"use client";

import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { useIsMobile } from "@/hooks/use-mobile";
import FadeInWrapper from "@/components/fade-in-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { content } from "@/lib/content";
import { useUser } from "@/firebase";
import { ADMIN_EMAILS } from "@/lib/admin";
import { ImageUploaderDialog } from "../image-uploader-dialog";
import { IptvImageUploader } from "./iptv-image-uploader";
import { Fade } from "react-awesome-reveal";

interface IptvProps {
  featureImageUrl?: string;
  mobileFeatureImageUrl?: string;
}

export default function Iptv({ featureImageUrl, mobileFeatureImageUrl }: IptvProps) {
  const defaultIptvImage = placeholderImages.find(p => p.id === 'iptv-hero');
  const isMobile = useIsMobile();
  const { user } = useUser();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");

  const getSrc = () => {
    if (isMobile === undefined) return defaultIptvImage?.imageUrl;
    const desktopSrc = featureImageUrl || defaultIptvImage?.imageUrl;
    const mobileSrc = mobileFeatureImageUrl || desktopSrc;
    return isMobile ? mobileSrc : desktopSrc;
  };

  const currentSrc = getSrc();
  const { headline, subheadline } = content.iptv;

  return (
    <section id="iptv" className="bg-secondary py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Fade direction="left" triggerOnce>
                <div className="space-y-6 text-center lg:text-left">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                        {headline}
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                        {subheadline}
                    </p>
                    {isAdmin ? (
                       <ImageUploaderDialog
                          triggerText="Edit IPTV Image"
                          dialogTitle="Update IPTV Section Image"
                       >
                          <IptvImageUploader />
                       </ImageUploaderDialog>
                    ) : (
                      <Button asChild size="lg" className="premium-blue-bg text-primary-foreground hover:brightness-110 transition-transform hover:scale-105 shadow-lg mt-4">
                          <Link href="#contact">Learn More</Link>
                      </Button>
                    )}
                </div>
              </Fade>
              <Fade direction="right" triggerOnce>
                <div className="relative w-full max-w-2xl mx-auto lg:max-w-none aspect-[16/10] rounded-xl overflow-hidden">
                  {currentSrc && (
                    <Image
                      src={currentSrc}
                      alt={defaultIptvImage?.description || "IPTV service interface"}
                      fill
                      className="w-full h-full object-cover"
                      data-ai-hint={defaultIptvImage?.imageHint}
                      key={currentSrc}
                    />
                  )}
                </div>
              </Fade>
          </div>
      </div>
    </section>
  );
}
