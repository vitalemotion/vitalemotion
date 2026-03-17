import AnimatedSection from "@/components/animations/AnimatedSection";

interface ServiceHighlight {
  title: string;
  description: string;
}

const defaultServices = [
  {
    title: "Terapia Individual",
    description:
      "Sesiones personalizadas para abordar tus necesidades emocionales con total confidencialidad.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
      </svg>
    ),
  },
  {
    title: "Terapia de Pareja",
    description:
      "Fortalece tu relacion y mejora la comunicacion con tu pareja en un espacio seguro.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="7" r="3.5" />
        <circle cx="15" cy="7" r="3.5" />
        <path d="M3 21a6 6 0 0 1 9-5.2" />
        <path d="M12 15.8A6 6 0 0 1 21 21" />
        <path d="M12 17.5l-1.5-1.5 1.5-1.5 1.5 1.5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Talleres y Grupos",
    description:
      "Participa en talleres de crecimiento personal y bienestar emocional.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="9" r="2.5" />
        <circle cx="19" cy="9" r="2.5" />
        <path d="M7.5 21a4.5 4.5 0 0 1 9 0" />
        <path d="M2 21a3.5 3.5 0 0 1 5.5-2.9" />
        <path d="M22 21a3.5 3.5 0 0 0-5.5-2.9" />
      </svg>
    ),
  },
];

function getServiceIcon(title: string, index: number) {
  const match = defaultServices.find((service) => service.title === title);
  return match?.icon || defaultServices[index % defaultServices.length]?.icon;
}

export default function ValueProposition({
  eyebrow = "NUESTROS SERVICIOS",
  heading = "Cuidamos de tu salud mental",
  services = defaultServices,
}: {
  eyebrow?: string;
  heading?: string;
  services?: ServiceHighlight[];
}) {
  const resolvedServices = services.length > 0 ? services : defaultServices;

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-accent mb-3">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl text-text-primary">
            {heading}
          </h2>
        </AnimatedSection>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resolvedServices.map((service, index) => (
            <AnimatedSection
              key={service.title}
              animation="fade-up"
              delay={index * 0.15}
            >
              <div className="bg-surface rounded-2xl p-8 text-center shadow-lg shadow-black/5">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {getServiceIcon(service.title, index)}
                </div>
                <h3 className="font-serif text-xl mb-3">{service.title}</h3>
                <p className="text-text-secondary">{service.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
