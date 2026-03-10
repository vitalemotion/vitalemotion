import AnimatedSection from "@/components/animations/AnimatedSection";

interface PsychologistCardProps {
  name: string;
  title: string;
  specialty: string[];
  bio: string;
  imageColor: string;
  index: number;
}

export default function PsychologistCard({
  name,
  title,
  specialty,
  bio,
  imageColor,
  index,
}: PsychologistCardProps) {
  const animation = index % 2 === 0 ? "fade-left" : "fade-right";

  return (
    <AnimatedSection animation={animation} delay={index * 0.15}>
      <div className="bg-surface rounded-2xl overflow-hidden shadow-lg shadow-black/5">
        <div className={`${imageColor} h-72`} />
        <div className="p-6">
          <h3 className="font-serif text-xl text-text-primary">{name}</h3>
          <p className="text-accent text-sm uppercase tracking-wide mt-1">
            {title}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {specialty.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-text-secondary mt-4 leading-relaxed text-sm">
            {bio}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
