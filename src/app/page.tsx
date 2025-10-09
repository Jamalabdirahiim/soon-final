
import Header from "@/components/layout/header";
import HeroImage from "@/components/sections/hero-image";
import Services from "@/components/sections/services";
import Pricing from "@/components/sections/pricing";
import Faq from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layout/footer";
import Iptv from "@/components/sections/iptv";
import Customization from "@/components/sections/customization";
import { initializeFirebase } from "@/firebase/index.server";
import { doc, getDoc, collection } from "firebase/firestore";

async function getSiteData() {
  try {
    const { firestore } = initializeFirebase();
    const settingsRef = collection(firestore, 'site-settings');

    // Fetch config (for hero/iptv images) and logo in parallel
    const [configSnap, logoSnap] = await Promise.all([
      getDoc(doc(settingsRef, 'config')),
      getDoc(doc(settingsRef, 'logo')),
    ]);

    const settings = configSnap.exists() ? configSnap.data() : {};
    const logoUrl = logoSnap.exists() ? logoSnap.data().url : null;
    
    return {
      settings,
      logoUrl,
    };
  } catch (error) {
    // Log the error for debugging, but don't let it crash the page.
    console.error("Error fetching site settings on server:", error);
  }
  // Return a default structure if fetching fails
  return { settings: null, logoUrl: null };
}

export default async function Home() {
  const { settings, logoUrl } = await getSiteData();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header logoUrl={logoUrl} />
      <main className="flex-1">
        <HeroImage 
          heroImageUrl={settings?.heroImageUrl} 
          mobileHeroImageUrl={settings?.mobileHeroImageUrl} 
        />
        <Services />
        <Iptv 
          featureImageUrl={settings?.featureImageUrl}
          mobileFeatureImageUrl={settings?.mobileFeatureImageUrl}
        />
        <Pricing />
        <Faq />
        <Contact />
        <Customization />
      </main>
      <Footer logoUrl={logoUrl} />
    </div>
  );
}
