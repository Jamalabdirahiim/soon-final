
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
  hero: {
    headline: string;
    subheadline: string;
  };
  services: Service[];
  pricingPlans: PricingPlan[];
  faq: FaqItem[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
};

// We are providing a structured and typed content object
// by combining data from content.json.
// @ts-ignore
export const content: Content = {
  ...contentData,
};
