import Header from "@/components/layout/header";
import HeroImage from "@/components/sections/hero-image";
import HeroText from "@/components/sections/hero-text";
import Services from "@/components/sections/services";
import FeatureHighlight from "@/components/sections/feature-highlight";
import Pricing from "@/components/sections/pricing";
import Faq from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layout/footer";
import FadeInWrapper from "@/components/fade-in-wrapper";
import { content } from "@/lib/content";
import LogoUploader from "@/components/logo-uploader";
import { HeroImageUploader } from "@/components/hero-image-uploader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FeatureImageUploader } from "@/components/feature-image-uploader";
import { MobileLogoUploader } from "@/components/mobile-logo-uploader";
import { MobileHeroImageUploader } from "@/components/mobile-hero-image-uploader";
import { MobileFeatureImageUploader } from "@/components/mobile-feature-image-uploader";

export default function Home() {
  const { navLinks } = content;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header navLinks={navLinks} />
      <main className="flex-1">
        <HeroImage />
        <HeroText />
        <section className="bg-muted/40 py-8">
            <div className="container mx-auto px-4 md:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Site Customization</CardTitle>
                        <CardDescription>Upload your own assets to customize the look and feel of your site.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-6">
                            <LogoUploader />
                            <MobileLogoUploader />
                        </div>
                        <div className="space-y-6">
                            <HeroImageUploader />
                            <MobileHeroImageUploader />
                        </div>
                        <div className="space-y-6">
                            <FeatureImageUploader />
                            <MobileFeatureImageUploader />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
        <FadeInWrapper>
          <Services />
        </FadeInWrapper>
        <FadeInWrapper>
          <FeatureHighlight />
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
