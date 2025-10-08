
import { initializeFirebase } from "@/firebase/index.server";
import { doc, getDoc } from "firebase/firestore";

import Header from "@/components/layout/header";
import HeroImage from "@/components/sections/hero-image";
import Services from "@/components/sections/services";
import Pricing from "@/components/sections/pricing";
import Faq from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layout/footer";
import Iptv from "@/components/sections/iptv";
import { placeholderImages } from "@/lib/placeholder-images.json";
import Customization from "@/components/sections/customization";
import HeroText from "@/components/sections/hero-text";

async function getSiteData() {
  const { firestore } = initializeFirebase();
  
  const defaultHeroImage = placeholderImages.find(p => p.id === 'hero-background');
  const defaultMobileHeroImage = placeholderImages.find(p => p.id === 'mobile-hero-background');
  const defaultLogo = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAyMDAgNTYiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSIxMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIzNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDdEQjYiPgpTT09OPC90ZXh0Pgo8L3N2Zz4K`;

  try {
    const configDocRef = doc(firestore, 'site-settings', 'config');
    const logoDocRef = doc(firestore, 'site-settings', 'logo');

    const [configDoc, logoDoc] = await Promise.all([
        getDoc(configDocRef),
        getDoc(logoDoc)
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
        
        <Customization />
        
        <Iptv />
        <Services />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer logoUrl={logoUrl} />
    </div>
  );
}
