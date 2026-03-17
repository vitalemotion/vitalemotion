import type { Metadata } from "next";
import AnimatedSection from "@/components/animations/AnimatedSection";
import PsychologistCard from "@/components/nosotros/PsychologistCard";
import { prisma } from "@/lib/db";
import { getAboutPageContent } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Nuestro Equipo | Vital Emocion",
  description:
    "Conoce a nuestros psicologos profesionales dedicados a tu bienestar emocional.",
  openGraph: {
    title: "Nuestro Equipo | Vital Emocion",
    description:
      "Conoce a nuestros psicologos profesionales dedicados a tu bienestar emocional.",
  },
};

const IMAGE_COLORS = ["bg-primary", "bg-accent", "bg-primary-dark"];

const PLACEHOLDER_TEAM = [
  {
    name: "Dra. Maria Rodriguez",
    title: "Psicologa Clinica",
    specialty: ["Ansiedad", "Depresion", "Estres"],
    bio: "Con mas de 10 anos de experiencia en psicologia clinica, la Dra. Rodriguez se especializa en el tratamiento de trastornos de ansiedad y depresion. Su enfoque integrador combina terapia cognitivo-conductual con tecnicas de mindfulness.",
    imageColor: "bg-primary",
  },
  {
    name: "Dr. Carlos Mendez",
    title: "Psicologo de Pareja",
    specialty: ["Terapia de Pareja", "Comunicacion"],
    bio: "El Dr. Mendez ha dedicado su carrera a fortalecer las relaciones de pareja. Utiliza un enfoque basado en la Terapia Focalizada en las Emociones para ayudar a las parejas a reconectarse y construir vinculos mas solidos.",
    imageColor: "bg-accent",
  },
  {
    name: "Dra. Laura Jimenez",
    title: "Psicologa Infantil",
    specialty: ["Ninos", "Adolescentes", "Familia"],
    bio: "Especialista en psicologia infantil y del adolescente, la Dra. Jimenez trabaja con un enfoque ludico y centrado en la familia. Su objetivo es crear un espacio seguro donde los mas jovenes puedan expresarse libremente.",
    imageColor: "bg-primary-dark",
  },
];

function deriveTitle(specialties: string[]): string {
  if (specialties.some((s) => s.includes("Pareja") || s.includes("Comunicacion")))
    return "Psicologo de Pareja";
  if (specialties.some((s) => s.includes("Ninos") || s.includes("Adolescentes") || s.includes("Infantil")))
    return "Psicologa Infantil";
  return "Psicologa Clinica";
}

async function getTeam() {
  try {
    const psychologists = await prisma.psychologist.findMany({
      where: { isActive: true },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    });
    if (psychologists.length > 0) {
      return psychologists.map((psy, i) => ({
        name: psy.user.name || "Psicologo",
        title: deriveTitle(psy.specialties),
        specialty: psy.specialties,
        bio: psy.bio || "",
        imageColor: IMAGE_COLORS[i % IMAGE_COLORS.length],
      }));
    }
    return PLACEHOLDER_TEAM;
  } catch {
    return PLACEHOLDER_TEAM;
  }
}

export default async function NosotrosPage() {
  const aboutContent = await getAboutPageContent();
  const team = await getTeam();
  const missionEyebrow = aboutContent?.missionEyebrow || "Nuestra Mision";
  const missionText =
    aboutContent?.missionText ||
    "En Vital Emocion creemos que cada persona merece acceso a un cuidado psicologico de calidad. Nuestro compromiso es acompanarte en tu proceso de crecimiento personal con empatia, profesionalismo y respeto.";
  const philosophyTitle = aboutContent?.philosophyTitle || "Nuestra Filosofia";
  const philosophyParagraphs =
    aboutContent?.philosophyParagraphs?.length
      ? aboutContent.philosophyParagraphs
      : [
          "Creemos en un enfoque holistico de la salud mental. Cada persona es unica, y por eso nuestros tratamientos se adaptan a las necesidades individuales de cada paciente. Combinamos las mejores practicas de la psicologia contemporanea con un profundo respeto por la dignidad humana.",
          "Nuestro compromiso va mas alla de la consulta: buscamos generar un impacto positivo en la comunidad, promoviendo la educacion emocional y el bienestar integral como pilares de una vida plena.",
        ];

  return (
    <>
      {/* Hero */}
      <section className="bg-primary-dark h-[60vh] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <AnimatedSection animation="fade-up" className="relative z-10 text-center px-6">
          <h1 className="font-serif text-5xl text-white">
            {aboutContent?.heroTitle || "Conoce a nuestro equipo"}
          </h1>
          <p className="text-white/80 mt-4 text-lg max-w-xl mx-auto">
            {aboutContent?.heroSubtitle ||
              "Profesionales dedicados a tu bienestar emocional"}
          </p>
        </AnimatedSection>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <AnimatedSection animation="scale" className="max-w-4xl mx-auto text-center">
          <span className="uppercase tracking-widest text-accent text-sm font-sans">
            {missionEyebrow}
          </span>
          <p className="font-serif text-2xl text-text-primary leading-relaxed mt-6">
            {missionText}
          </p>
        </AnimatedSection>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="font-serif text-4xl text-text-primary">
              {aboutContent?.teamHeading || "Nuestro Equipo"}
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <PsychologistCard key={member.name} {...member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-6 bg-secondary">
        <AnimatedSection animation="blur-in" className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-text-primary">
            {philosophyTitle}
          </h2>
          {philosophyParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-text-secondary leading-relaxed text-lg ${
                index === 0 ? "mt-6" : "mt-4"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </AnimatedSection>
      </section>
    </>
  );
}
