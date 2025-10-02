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
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { navLinks, logoUrl } = content;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header navLinks={navLinks} logoUrl={logoUrl} />
      <main className="flex-1">
        <Hero />
        <section className="bg-background text-center py-12 md:py-24">
            <div className="container">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                The Future of Internet is SOON
                </h1>
                <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground">
                Get the fastest and most reliable internet with SOON's pure fiber-optic network. The future is here, and it's faster than ever.
                </p>
                <div className="mt-10">
                    <Button asChild size="lg" className="transition-transform hover:scale-105">
                        <Link href="#pricing">View Plans</Link>
                    </Button>
                </div>
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
      <Footer logoUrl={logoUrl} />
    </div>
  );
}
