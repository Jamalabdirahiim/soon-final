
"use client";

import React, { useState, useEffect } from "react";
import { SoonLogo } from "@/components/soon-logo";
import { content } from "@/lib/content";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const defaultLogo = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAyMDAgNTYiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSIxMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIzNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDdEQjYiPgpTT09OPC90ZXh0Pgo8L3N2Zz4K`;

const socialIconMap = {
  Facebook: <Facebook size={24} />,
  Instagram: <Instagram size={24} />,
  Twitter: <Twitter size={24} />,
};


export default function Footer() {
  const [logoUrl, setLogoUrl] = useState(defaultLogo);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;

    const logoDocRef = doc(firestore, 'site-settings', 'logo');

    const unsubscribe = onSnapshot(logoDocRef, (doc) => {
      if (doc.exists()) {
        setLogoUrl(doc.data().url || defaultLogo);
      } else {
        setLogoUrl(defaultLogo);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [firestore]);

  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <SoonLogo logoSrc={logoUrl} isInFooter={true}/>
        </div>
        <div className="flex items-center space-x-4">
          {content.socialLinks.map((social) => (
            <Link href={social.url} key={social.name} className="text-white hover:text-gray-300">
              {socialIconMap[social.name]}
            </Link>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-4 md:mt-0">&copy; {new Date().getFullYear()} {content.footer.copyright}</p>
      </div>
    </footer>
  );
}
