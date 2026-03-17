export const SANITY_API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-14";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";
export const sanityReadToken = process.env.SANITY_API_READ_TOKEN;

export function isSanityConfigured(): boolean {
  return Boolean(sanityProjectId && sanityDataset);
}
