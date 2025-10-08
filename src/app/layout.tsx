
import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseProvider } from '@/firebase';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SOON | Somali Optical Networks',
  description: 'High-speed fiber optic internet from SOON. Reliable, fast, and affordable connectivity for your home and business.',
  keywords: ['SOON', 'Somali Optical Networks', 'Fiber Internet', 'Mogadishu', 'Somalia', 'Internet Provider'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} !scroll-smooth`}>
      <body className="font-body antialiased bg-background">
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
