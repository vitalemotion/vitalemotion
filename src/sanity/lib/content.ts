import { cache } from "react";
import { urlForImage } from "./image";
import { sanityFetch } from "./client";
import type {
  AboutPageContent,
  BlogPostDetail,
  BlogPostSummary,
  HomePageContent,
  PortableTextBlock,
  SiteSettingsContent,
} from "./types";

const siteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    practiceName,
    description,
    footerDescription,
    contactEmail,
    contactPhone,
    secondaryPhone,
    whatsappNumber,
    addressLine1,
    addressLine2,
    businessHours,
    socialInstagram,
    socialFacebook,
    socialLinkedin,
    socialWhatsapp,
    footerServices,
    copyrightText
  }
`;

const homePageQuery = `
  *[_type == "homePage"][0]{
    heroTitle,
    heroSubtitle,
    servicesEyebrow,
    servicesHeading,
    serviceHighlights[]{
      title,
      description
    },
    testimonialsHeading,
    testimonials[]{
      quote,
      name
    },
    ctaTitle,
    ctaDescription,
    ctaButtonLabel,
    ctaButtonHref
  }
`;

const aboutPageQuery = `
  *[_type == "aboutPage"][0]{
    heroTitle,
    heroSubtitle,
    missionEyebrow,
    missionText,
    teamHeading,
    philosophyTitle,
    philosophyParagraphs
  }
`;

const postsQuery = `
  *[
    _type == "post" &&
    defined(slug.current) &&
    (!defined(publishedAt) || publishedAt <= now())
  ] | order(coalesce(publishedAt, _createdAt) desc){
    title,
    "slug": slug.current,
    excerpt,
    "author": coalesce(authorName, "Equipo Vital Emocion"),
    "date": coalesce(publishedAt, _createdAt),
    coverColor,
    coverImage
  }
`;

const postBySlugQuery = `
  *[
    _type == "post" &&
    slug.current == $slug &&
    (!defined(publishedAt) || publishedAt <= now())
  ][0]{
    title,
    "slug": slug.current,
    excerpt,
    "author": coalesce(authorName, "Equipo Vital Emocion"),
    "date": coalesce(publishedAt, _createdAt),
    coverColor,
    coverImage,
    body
  }
`;

const relatedPostsQuery = `
  *[
    _type == "post" &&
    defined(slug.current) &&
    slug.current != $slug &&
    (!defined(publishedAt) || publishedAt <= now())
  ] | order(coalesce(publishedAt, _createdAt) desc)[0...$limit]{
    title,
    "slug": slug.current,
    excerpt,
    "author": coalesce(authorName, "Equipo Vital Emocion"),
    "date": coalesce(publishedAt, _createdAt),
    coverColor,
    coverImage
  }
`;

type SanityPostSummaryRecord = {
  title?: string;
  slug?: string;
  excerpt?: string;
  author?: string;
  date?: string;
  coverColor?: string;
  coverImage?: unknown;
};

type SanityPostDetailRecord = SanityPostSummaryRecord & {
  body?: PortableTextBlock[];
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mapPostSummary(post: SanityPostSummaryRecord): BlogPostSummary | null {
  if (!post.title || !post.slug || !post.date) {
    return null;
  }

  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    author: post.author || "Equipo Vital Emocion",
    date: formatDate(post.date),
    coverColor: post.coverColor || "bg-primary",
    coverImageUrl: post.coverImage ? urlForImage(post.coverImage).width(1200).url() : null,
  };
}

export const getSiteSettingsContent = cache(async (): Promise<SiteSettingsContent | null> => {
  const data = await sanityFetch<Partial<SiteSettingsContent>>({
    query: siteSettingsQuery,
    revalidate: 300,
    tags: ["sanity:siteSettings"],
  });

  if (!data) {
    return null;
  }

  return {
    practiceName: data.practiceName || "Vital Emocion",
    description: data.description || "",
    footerDescription: data.footerDescription || "",
    contactEmail: data.contactEmail || "",
    contactPhone: data.contactPhone || "",
    secondaryPhone: data.secondaryPhone || "",
    whatsappNumber: data.whatsappNumber || "",
    addressLine1: data.addressLine1 || "",
    addressLine2: data.addressLine2 || "",
    businessHours: Array.isArray(data.businessHours) ? data.businessHours.filter(Boolean) : [],
    socialInstagram: data.socialInstagram || "",
    socialFacebook: data.socialFacebook || "",
    socialLinkedin: data.socialLinkedin || "",
    socialWhatsapp: data.socialWhatsapp || "",
    footerServices: Array.isArray(data.footerServices) ? data.footerServices.filter(Boolean) : [],
    copyrightText: data.copyrightText || "",
  };
});

export const getHomePageContent = cache(async (): Promise<HomePageContent | null> => {
  const data = await sanityFetch<Partial<HomePageContent>>({
    query: homePageQuery,
    revalidate: 300,
    tags: ["sanity:homePage"],
  });

  if (!data) {
    return null;
  }

  return {
    heroTitle: data.heroTitle || "",
    heroSubtitle: data.heroSubtitle || "",
    servicesEyebrow: data.servicesEyebrow || "",
    servicesHeading: data.servicesHeading || "",
    serviceHighlights: Array.isArray(data.serviceHighlights)
      ? data.serviceHighlights.filter(
          (item): item is HomePageContent["serviceHighlights"][number] =>
            Boolean(item?.title && item?.description)
        )
      : [],
    testimonialsHeading: data.testimonialsHeading || "",
    testimonials: Array.isArray(data.testimonials)
      ? data.testimonials.filter(
          (item): item is HomePageContent["testimonials"][number] =>
            Boolean(item?.quote && item?.name)
        )
      : [],
    ctaTitle: data.ctaTitle || "",
    ctaDescription: data.ctaDescription || "",
    ctaButtonLabel: data.ctaButtonLabel || "",
    ctaButtonHref: data.ctaButtonHref || "",
  };
});

export const getAboutPageContent = cache(async (): Promise<AboutPageContent | null> => {
  const data = await sanityFetch<Partial<AboutPageContent>>({
    query: aboutPageQuery,
    revalidate: 300,
    tags: ["sanity:aboutPage"],
  });

  if (!data) {
    return null;
  }

  return {
    heroTitle: data.heroTitle || "",
    heroSubtitle: data.heroSubtitle || "",
    missionEyebrow: data.missionEyebrow || "",
    missionText: data.missionText || "",
    teamHeading: data.teamHeading || "",
    philosophyTitle: data.philosophyTitle || "",
    philosophyParagraphs: Array.isArray(data.philosophyParagraphs)
      ? data.philosophyParagraphs.filter(Boolean)
      : [],
  };
});

export const getSanityPublishedPosts = cache(async (): Promise<BlogPostSummary[]> => {
  const posts = await sanityFetch<SanityPostSummaryRecord[]>({
    query: postsQuery,
    revalidate: 120,
    tags: ["sanity:post"],
  });

  if (!posts?.length) {
    return [];
  }

  return posts.map(mapPostSummary).filter((post): post is BlogPostSummary => Boolean(post));
});

export const getSanityPostBySlug = cache(
  async (slug: string): Promise<BlogPostDetail | null> => {
    const post = await sanityFetch<SanityPostDetailRecord>({
      query: postBySlugQuery,
      params: { slug },
      revalidate: 120,
      tags: [`sanity:post:${slug}`],
    });

    if (!post) {
      return null;
    }

    const summary = mapPostSummary(post);
    if (!summary) {
      return null;
    }

    return {
      ...summary,
      body: Array.isArray(post.body) ? post.body : [],
    };
  }
);

export const getSanityRelatedPosts = cache(
  async (slug: string, limit = 2): Promise<BlogPostSummary[]> => {
    const posts = await sanityFetch<SanityPostSummaryRecord[]>({
      query: relatedPostsQuery,
      params: { slug, limit },
      revalidate: 120,
      tags: ["sanity:post"],
    });

    if (!posts?.length) {
      return [];
    }

    return posts.map(mapPostSummary).filter((post): post is BlogPostSummary => Boolean(post));
  }
);

export const getSanityPostSlugs = cache(async (): Promise<string[]> => {
  const posts = await getSanityPublishedPosts();
  return posts.map((post) => post.slug);
});
