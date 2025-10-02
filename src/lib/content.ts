import contentData from './content.json';
import { placeholderImages } from './placeholder-images.json';

type NavLink = {
  label: string;
  href: string;
};

type Service = {
  icon: 'Wifi' | 'Router' | 'Server' | 'LifeBuoy';
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type Content = {
  logoUrl?: string;
  navLinks: NavLink[];
  services: Service[];
  faq: FaqItem[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
};

const logoImage = placeholderImages.find(img => img.id === 'logo-image');

// We are providing a structured and typed content object
// by combining data from content.json and placeholder-images.json.
export const content: Content = {
  ...contentData,
  logoUrl: logoImage?.imageUrl,
};
