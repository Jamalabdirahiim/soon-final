
// This file is now deprecated as content is fetched from Firestore.
// It is kept for reference but is no longer used by the application.

import contentData from './content.json';

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

type PricingPlan = {
  name: string;
  speed: string;
  price: string;
  isFeatured: boolean;
  homeUse: string;
  businessUse: string;
};

type Content = {
  navLinks: NavLink[];
  services: Service[];
  faq: FaqItem[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  pricingPlans: PricingPlan[];
  hero: {
    headline: string;
    subheadline: string;
  }
};

// We are providing a structured and typed content object
// by combining data from content.json.
// @ts-ignore
export const content: Content = {
  ...contentData,
};

    