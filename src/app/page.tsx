import Header from "@/components/layout/header";
import HeroContent from "@/components/sections/hero-content";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureImageUploader } from "@/components/feature-image-uploader";

export default function Home() {
  const { navLinks } = content;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header navLinks={navLinks} />
      <main className="flex-1 pt-20">
        <HeroContent />
        <section className="bg-muted/40 py-8">
            <div className="container mx-auto px-4 md:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Site Customization</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-8">
                        <LogoUploader />
                        <HeroImageUploader />
                        <FeatureImageUploader />
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
