import Header from "@/components/layout/header";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import FeatureHighlight from "@/components/sections/feature-highlight";
import Pricing from "@/components/sections/pricing";
import Faq from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layout/footer";
import FadeInWrapper from "@/components/fade-in-wrapper";
import { content } from "@/lib/content";

export default function Home() {
  const { navLinks, logoUrl } = content;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1">
        <Hero />
        <Header navLinks={navLinks} logoUrl={logoUrl} />
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
      <Footer logoUrl={logoUrl} />
    </div>
  );
}
