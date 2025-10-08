
"use client";

import Link from "next/link";
import React from "react";
import { SoonLogo } from "@/components/soon-logo";
import { content } from "@/lib/content";
import { Facebook, Instagram, Twitter } from "lucide-react";

const socialIconMap: { [key: string]: React.ElementType } = {
  Facebook,
  Instagram,
  Twitter,
};

export default function Footer({ logoUrl }: { logoUrl: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-12 md:grid-cols-2 lg:grid-cols-4 md:px-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <SoonLogo logoSrc={logoUrl} />
          <p className="mt-4 text-sm text-primary-foreground/80">
            Connecting Somalia with high-speed fiber internet and IPTV.
          </p>
        </div>

        <div className="col-span-1">
          <h3 className="font-headline text-lg font-bold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2">
            {content.navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-headline text-lg font-bold text-white">Contact Us</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>{content.contact.address}</li>
            <li>Email: {content.contact.email}</li>
            <li>Phone: {content.contact.phone}</li>
          </ul>
        </div>
        
        <div className="col-span-1 md:col-start-2 lg:col-start-auto">
            <h3 className="font-headline text-lg font-bold text-white">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              {content.socialLinks.map((social) => {
                const Icon = socialIconMap[social.name];
                return (
                  <Link key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 transition-colors hover:text-white">
                    <Icon className="h-6 w-6" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                );
              })}
            </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto flex items-center justify-center px-4 py-4 md:px-6">
          <p className="text-xs text-primary-foreground/80">
            &copy; {currentYear} SOON (Somali Optical Networks). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
