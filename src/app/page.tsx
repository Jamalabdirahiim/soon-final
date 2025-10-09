
import Header from "@/components/layout/header";
import HeroImage from "@/components/sections/hero-image";
import Services from "@/components/sections/services";
import Pricing from "@/components/sections/pricing";
import Faq from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layout/footer";
import IptvHero from "@/components/sections/iptv-hero";
import { initializeFirebase } from "@/firebase/index.server";
import { doc, getDoc, Firestore } from "firebase/firestore";

async function getSiteSettings() {
  try {
    const { firestore } = initializeFirebase();
    const configDocRef = doc(firestore, 'site-settings', 'config');
    const configSnap = await getDoc(configDocRef);
    if (configSnap.exists()) {
      return configSnap.data();
    }
  } catch (error) {
    console.error("Error fetching site settings on server:", error);
  }
  return null;
}


export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroImage 
          heroImageUrl={settings?.heroImageUrl} 
          mobileHeroImageUrl={settings?.mobileHeroImageUrl} 
        />
        <Services />
        <IptvHero />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
