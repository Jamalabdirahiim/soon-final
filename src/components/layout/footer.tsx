import Link from "next/link";
import { SoonLogo } from "@/components/soon-logo";
import { content } from "@/lib/content";

export default function Footer() {
  const { navLinks, contact } = content;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="col-span-1 md:col-span-1">
          <SoonLogo />
          <p className="mt-4 text-sm text-muted-foreground">
            Connecting Somalia with high-speed fiber internet.
          </p>
        </div>

        <div className="col-span-1">
          <h3 className="font-headline text-lg font-bold">Quick Links</h3>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-headline text-lg font-bold">Contact Us</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>{contact.address}</li>
            <li>Email: {contact.email}</li>
            <li>Phone: {contact.phone}</li>
          </ul>
        </div>
        
        <div className="col-span-1">
            <h3 className="font-headline text-lg font-bold">Legal</h3>
            <ul className="mt-4 space-y-2">
                <li>
                    <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                        Terms of Service
                    </Link>
                </li>
                <li>
                    <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                        Privacy Policy
                    </Link>
                </li>
            </ul>
        </div>
      </div>
      <div className="border-t border-border bg-secondary">
        <div className="container mx-auto flex items-center justify-center px-4 py-4 md:px-6">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} SOON (Somali Optical Networks). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
