
"use client";

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
import { UniversalLogoUploader } from "@/components/universal-logo-uploader";

export default function Home() {

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header navLinks={content.navLinks} />
      <main className="flex-1">
        <HeroImage />
        <HeroText content={content.hero} />
        <section className="py-12 md:py-16 lg:py-20 bg-background">
          <UniversalLogoUploader />
        </section>
        <FadeInWrapper>
          <Services content={content.services} />
        </FadeInWrapper>
        <FadeInWrapper>
          <FeatureHighlight />
        </FadeInWrapper>
        <FadeInWrapper>
          <Pricing content={content.pricingPlans} />
        </FadeInWrapper>
        <FadeInWrapper>
          <Faq content={content.faq} />
        </FadeInWrapper>
        <FadeInWrapper>
          <Contact content={content.contact} />
        </FadeInWrapper>
      </main>
      <Footer navLinks={content.navLinks} contact={content.contact} />
    </div>
  );
}
