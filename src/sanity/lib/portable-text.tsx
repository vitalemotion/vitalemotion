import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "./types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-text-secondary leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl text-text-primary mt-12">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl text-text-primary mt-10">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-text-primary">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = href.startsWith("http://") || href.startsWith("https://");

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            {children}
          </a>
        );
      }

      return (
        <Link href={href} className="text-primary underline underline-offset-4">
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-6 text-text-secondary">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-6 text-text-secondary">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

export function SanityPortableText({
  value,
}: {
  value: PortableTextBlock[];
}) {
  return <PortableText value={value} components={components} />;
}
