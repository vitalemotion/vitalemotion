export interface SiteSettingsContent {
  practiceName: string;
  description: string;
  footerDescription: string;
  contactEmail: string;
  contactPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  addressLine1: string;
  addressLine2: string;
  businessHours: string[];
  socialInstagram: string;
  socialFacebook: string;
  socialLinkedin: string;
  socialWhatsapp: string;
  footerServices: string[];
  copyrightText: string;
}

export interface HomeHighlight {
  title: string;
  description: string;
}

export interface HomeTestimonial {
  quote: string;
  name: string;
}

export interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
  servicesEyebrow: string;
  servicesHeading: string;
  serviceHighlights: HomeHighlight[];
  testimonialsHeading: string;
  testimonials: HomeTestimonial[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
}

export interface AboutPageContent {
  heroTitle: string;
  heroSubtitle: string;
  missionEyebrow: string;
  missionText: string;
  teamHeading: string;
  philosophyTitle: string;
  philosophyParagraphs: string[];
}

export interface PortableTextBlock {
  _key?: string;
  _type: string;
  children?: Array<{
    _key?: string;
    _type?: string;
    text?: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
  }>;
  style?: string;
}

export interface BlogPostSummary {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  coverColor: string;
  coverImageUrl?: string | null;
}

export interface BlogPostDetail extends BlogPostSummary {
  body: PortableTextBlock[];
}
