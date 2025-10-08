
"use client";

import Header from "@/components/layout/header";
import HeroImage from "@/components/sections/hero-image";
import HeroText from "@/components/sections/hero-text";
import Services from "@/components/sections/services";
import Pricing from "@/components/sections/pricing";
import Faq from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layout/footer";
import FadeInWrapper from "@/components/fade-in-wrapper";
import Iptv from "@/components/sections/iptv";
import LogoUploader from "@/components/sections/logo-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroImage />
        <HeroText />
        
        {user && (
          <section className="bg-secondary py-12 md:py-16">
            <div className="container mx-auto px-4">
               <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Logo Management</CardTitle>
                  <CardDescription>
                    Upload or change your company logo. For best results, use a transparent PNG, SVG, or paste an image from your clipboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LogoUploader />
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
