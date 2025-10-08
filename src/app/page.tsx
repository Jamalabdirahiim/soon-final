
"use client";

import Header from "@/components/layout/header";
import HeroImage from "@/components/sections/hero-image";
import Services from "@/components/sections/services";
import Pricing from "@/components/sections/pricing";
import Faq from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layout/footer";
import FadeInWrapper from "@/components/fade-in-wrapper";
import Iptv from "@/components/sections/iptv";
import LogoUploader from "@/components/sections/logo-uploader";
import HeroImageUploader from "@/components/sections/hero-image-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";
import HeroText from "@/components/sections/hero-text";
import MobileHeroImageUploader from "@/components/mobile-hero-image-uploader";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroImage />
        <HeroImageUploader />
        <HeroText />
        
        {user && (
          <section className="bg-secondary py-16 md:py-24">
            <div className="container mx-auto px-4">
               <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">Site Customization</CardTitle>
                  <CardDescription>
                    Update your branding and hero images. Changes are saved instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <LogoUploader />
                  <Separator />
                  <div className="grid md:grid-cols-2 gap-8">
                    <HeroImageUploader />
                    <MobileHeroImageUploader />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
        
        <FadeInWrapper>
          <Iptv />
        </FadeInWrapper>
        <FadeInWrapper>
          <Services />
        </FadeInWrapper>
        <FadeInWrapper>
          <Pricing />
        </FadeInWrapper>
        <FadeInWrapper>
          <Faq />
        </FadeInWrapper>
        <FadeInWrapper>
          <Contact />
        </FadeInWrapper>
      </main>
      <Footer />
    </div>
  );
}
