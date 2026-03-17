import "server-only";

import { createClient } from "next-sanity";
import {
  SANITY_API_VERSION,
  isSanityConfigured,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
} from "@/sanity/env";

const client = createClient({
  projectId: sanityProjectId || "missing-project-id",
  dataset: sanityDataset || "production",
  apiVersion: SANITY_API_VERSION,
  useCdn: !sanityReadToken,
  perspective: "published",
  stega: false,
  token: sanityReadToken,
});

interface SanityFetchOptions {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number;
  tags?: string[];
}

function normalizeOptions(
  input: SanityFetchOptions | string,
  params?: Record<string, unknown>,
  options?: Omit<SanityFetchOptions, "query" | "params">
): SanityFetchOptions {
  if (typeof input === "string") {
    return {
      query: input,
      params,
      revalidate: options?.revalidate,
      tags: options?.tags,
    };
  }

  return input;
}

export async function sanityFetch<T>(
  options: SanityFetchOptions
): Promise<T | null>;
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  options?: Omit<SanityFetchOptions, "query" | "params">
): Promise<T | null>;
export async function sanityFetch<T>(
  input: SanityFetchOptions | string,
  params?: Record<string, unknown>,
  options?: Omit<SanityFetchOptions, "query" | "params">
): Promise<T | null> {
  const { query, params: resolvedParams, revalidate = 60, tags } = normalizeOptions(
    input,
    params,
    options
  );

  if (!isSanityConfigured()) {
    return null;
  }

  try {
    return await client.fetch<T>(query, resolvedParams ?? {}, {
      next: {
        revalidate,
        tags,
      },
    });
  } catch {
    return null;
  }
}

export { client as sanityClient };
