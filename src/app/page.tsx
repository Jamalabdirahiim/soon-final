
import { initializeFirebase } from "@/firebase/index.server";
import { doc, getDoc } from "firebase/firestore";

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
import MobileHeroImageUploader from "@/components/mobile-hero-image-uploader";
import { Separator } from "@/components/ui/separator";
import HeroText from "@/components/sections/hero-text";
import { placeholderImages } from "@/lib/placeholder-images.json";
import UserSession from "@/components/user-session";

async function getSiteData() {
  const { firestore } = initializeFirebase();
  
  const defaultHeroImage = placeholderImages.find(p => p.id === 'hero-background');
  const defaultMobileHeroImage = placeholderImages.find(p => p.id === 'mobile-hero-background');
  const defaultLogo = '/logo.svg';

  try {
    const configDocRef = doc(firestore, 'site-settings', 'config');
    const logoDocRef = doc(firestore, 'site-settings', 'logo');

    const [configDoc, logoDoc] = await Promise.all([
        getDoc(configDocRef),
        getDoc(logoDocRef)
    ]);
    
    const configData = configDoc.exists() ? configDoc.data() : {};
    const logoData = logoDoc.exists() ? logoDoc.data() : {};

    return {
      logoUrl: logoData.url || defaultLogo,
      heroImageUrl: configData.heroImageUrl || defaultHeroImage?.imageUrl,
      mobileHeroImageUrl: configData.mobileHeroImageUrl || defaultMobileHeroImage?.imageUrl || configData.heroImageUrl || defaultHeroImage?.imageUrl,
    };
  } catch (error) {
    console.error("Error fetching site data:", error);
    // Return defaults in case of error
    return {
      logoUrl: defaultLogo,
      heroImageUrl: defaultHeroImage?.imageUrl,
      mobileHeroImageUrl: defaultMobileHeroImage?.imageUrl,
    };
  }
}


export default async function Home() {
  const { logoUrl, heroImageUrl, mobileHeroImageUrl } = await getSiteData();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header logoUrl={logoUrl} />
      <main className="flex-1">
        <HeroImage heroImageUrl={heroImageUrl} mobileHeroImageUrl={mobileHeroImageUrl} />
        <HeroText />
        
        <UserSession>
          {(user) => user && (
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
        </UserSession>
        
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
