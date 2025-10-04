
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
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export default function Home() {
  const firestore = useFirestore();
  const contentDocRef = firestore ? doc(firestore, 'site-content', 'content') : null;
  const { data: content, loading } = useDoc(contentDocRef);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {/* You can add a loading spinner or skeleton screen here */}
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header navLinks={content?.navLinks || []} />
      <main className="flex-1">
        <HeroImage />
        <HeroText content={content?.hero} />
        <FadeInWrapper>
          <Services content={content?.services || []} />
        </FadeInWrapper>
        <FadeInWrapper>
          <FeatureHighlight />
        </FadeInWrapper>
        <FadeInWrapper>
          <Pricing content={content?.pricingPlans || []} />
        </FadeInWrapper>
        <FadeInWrapper>
          <Faq content={content?.faq || []} />
        </FadeInWrapper>
        <FadeInWrapper>
          <Contact content={content?.contact} />
        </FadeInWrapper>
      </main>
      <Footer navLinks={content?.navLinks || []} contact={content?.contact} />
    </div>
  );
}

    