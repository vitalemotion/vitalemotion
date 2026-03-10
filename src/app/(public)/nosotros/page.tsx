import AnimatedSection from "@/components/animations/AnimatedSection";
import PsychologistCard from "@/components/nosotros/PsychologistCard";

const team = [
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

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary-dark h-[60vh] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <AnimatedSection animation="fade-up" className="relative z-10 text-center px-6">
          <h1 className="font-serif text-5xl text-white">
            Conoce a nuestro equipo
          </h1>
          <p className="text-white/80 mt-4 text-lg max-w-xl mx-auto">
            Profesionales dedicados a tu bienestar emocional
          </p>
        </AnimatedSection>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <AnimatedSection animation="scale" className="max-w-4xl mx-auto text-center">
          <span className="uppercase tracking-widest text-accent text-sm font-sans">
            Nuestra Mision
          </span>
          <p className="font-serif text-2xl text-text-primary leading-relaxed mt-6">
            En Vital Emocion creemos que cada persona merece acceso a un cuidado
            psicologico de calidad. Nuestro compromiso es acompanarte en tu
            proceso de crecimiento personal con empatia, profesionalismo y
            respeto.
          </p>
        </AnimatedSection>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="font-serif text-4xl text-text-primary">
              Nuestro Equipo
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
            Nuestra Filosofia
          </h2>
          <p className="text-text-secondary mt-6 leading-relaxed text-lg">
            Creemos en un enfoque holistico de la salud mental. Cada persona es
            unica, y por eso nuestros tratamientos se adaptan a las necesidades
            individuales de cada paciente. Combinamos las mejores practicas de la
            psicologia contemporanea con un profundo respeto por la dignidad
            humana.
          </p>
          <p className="text-text-secondary mt-4 leading-relaxed text-lg">
            Nuestro compromiso va mas alla de la consulta: buscamos generar un
            impacto positivo en la comunidad, promoviendo la educacion emocional
            y el bienestar integral como pilares de una vida plena.
          </p>
        </AnimatedSection>
      </section>
    </>
  );
}
