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

type Content = {
  navLinks: NavLink[];
  services: Service[];
  faq: FaqItem[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
};

// We are providing a structured and typed content object
// by combining data from content.json.
export const content: Content = {
  ...contentData,
};
