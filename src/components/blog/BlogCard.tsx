import Link from "next/link";
import AnimatedSection from "@/components/animations/AnimatedSection";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  slug: string;
  coverColor: string;
  coverImageUrl?: string | null;
  index: number;
}

export default function BlogCard({
  title,
  excerpt,
  date,
  author,
  slug,
  coverColor,
  coverImageUrl,
  index,
}: BlogCardProps) {
  return (
    <AnimatedSection animation="fade-up" delay={index * 0.1}>
      <Link href={`/blog/${slug}`} className="block group">
        <article className="bg-surface rounded-2xl overflow-hidden shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
          <div
            className={`${coverImageUrl ? "" : coverColor} h-48 bg-cover bg-center`}
            style={
              coverImageUrl
                ? {
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.14), rgba(0,0,0,0.14)), url(${coverImageUrl})`,
                  }
                : undefined
            }
          />
          <div className="p-6">
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <time>{date}</time>
              <span>·</span>
              <span>{author}</span>
            </div>
            <h3 className="font-serif text-lg text-text-primary mt-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-text-secondary text-sm mt-2 line-clamp-3">
              {excerpt}
            </p>
          </div>
        </article>
      </Link>
    </AnimatedSection>
  );
}
