
import Header from "@/components/layout/header";
import HeroImage from "@/components/sections/hero-image";
import Services from "@/components/sections/services";
import Pricing from "@/components/sections/pricing";
import Faq from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layout/footer";
import Iptv from "@/components/sections/iptv";
import Customization from "@/components/sections/customization";
import Hero from "@/components/sections/hero";
import IptvImageUploader from "@/components/sections/iptv-image-uploader";


export default async function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroImage heroImageUrl={undefined} mobileHeroImageUrl={undefined} />
        <IptvImageUploader />
        <Hero />
        
        <Customization />
        
        <Iptv />
        <Services />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
