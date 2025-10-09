
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
import { Separator } from "../ui/separator";

const defaultLogo = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAyMDAgNTYiIGZpbGw9Im5vbmUiPgo8dGV4dCB4PSIxMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIzNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDdEQjYiPgpTT09OPC90ZXh0Pgo8L3N2Zz4K`;

const socialIconMap: Record<string, React.ReactNode> = {
  Facebook: <Facebook size={20} />,
  Instagram: <Instagram size={20} />,
  Twitter: <Twitter size={20} />,
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

    return () => unsubscribe();
  }, [firestore]);

  return (
    <footer className="premium-blue-bg text-primary-foreground py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          
          <div className="md:col-span-1 space-y-4">
            <SoonLogo logoSrc={logoUrl} className="!h-10" isInFooter={true} />
          </div>

          <div>
            <h3 className="font-bold text-base mb-4 tracking-wider">QUICK LINKS</h3>
            <ul className="space-y-3">
              {content.navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base mb-4 tracking-wider">CONTACT US</h3>
            <div className="space-y-3 text-primary-foreground/80">
              {content.contact.addressLines.map(line => <p key={line}>{line}</p>)}
              <p>Phone: {content.contact.phone}</p>
              <p>Email: {content.contact.email}</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base mb-4 tracking-wider">FOLLOW US</h3>
            <div className="flex items-center space-x-4 mb-4">
              {content.socialLinks.map((social) => (
                <Link href={social.url} key={social.name} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  {socialIconMap[social.name]}
                </Link>
              ))}
            </div>
            <p className="text-primary-foreground/80">{content.contact.socialHandle}</p>
          </div>

        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="text-center text-xs text-primary-foreground/60 space-y-1">
            <p>{content.footer.copyright}</p>
            <p>Designed & Developed by {content.developer.name} | Contact: {content.developer.contact}</p>
        </div>
      </div>
    </footer>
  );
}
