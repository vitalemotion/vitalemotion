import type { Metadata } from "next";
import AnimatedSection from "@/components/animations/AnimatedSection";
import ServiceCard from "@/components/servicios/ServiceCard";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Servicios | Vital Emocion",
  description:
    "Terapia individual, terapia de pareja, evaluacion psicologica, talleres y mas.",
  openGraph: {
    title: "Servicios | Vital Emocion",
    description:
      "Terapia individual, terapia de pareja, evaluacion psicologica, talleres y mas.",
  },
};

const PLACEHOLDER_SERVICES = [
  {
    name: "Terapia Individual",
    description:
      "Sesiones de 50 minutos enfocadas en tus necesidades personales. Trabajamos con tecnicas cognitivo-conductuales y humanistas.",
    duration: "50 min",
    price: "$80.000",
  },
  {
    name: "Terapia de Pareja",
    description:
      "Mejora la comunicacion y fortalece tu relacion. Sesiones de 90 minutos para parejas.",
    duration: "90 min",
    price: "$120.000",
  },
  {
    name: "Evaluacion Psicologica",
    description:
      "Evaluacion integral con pruebas estandarizadas para un diagnostico preciso.",
    duration: "120 min",
    price: "$150.000",
  },
  {
    name: "Talleres de Mindfulness",
    description:
      "Grupos reducidos para aprender tecnicas de mindfulness y reduccion de estres.",
    duration: "60 min",
    price: "$40.000",
  },
  {
    name: "Terapia Infantil",
    description:
      "Intervencion especializada para ninos y adolescentes con enfoque ludico.",
    duration: "45 min",
    price: "$70.000",
  },
  {
    name: "Coaching de Vida",
    description:
      "Acompanamiento profesional para alcanzar tus metas personales y profesionales.",
    duration: "50 min",
    price: "$90.000",
  },
];

function formatCOP(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}

async function getServices() {
  try {
    const dbServices = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    if (dbServices.length > 0) {
      return dbServices.map((s) => ({
        name: s.name,
        description: s.description,
        duration: `${s.duration} min`,
        price: formatCOP(s.price),
      }));
    }
    return PLACEHOLDER_SERVICES;
  } catch {
    return PLACEHOLDER_SERVICES;
  }
}

export default async function ServiciosPage() {
  const services = await getServices();

  return (
    <>
      {/* Hero */}
      <section className="bg-primary-dark h-[60vh] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <AnimatedSection animation="fade-up" className="relative z-10 text-center px-6">
          <h1 className="font-serif text-5xl text-white">
            Nuestros Servicios
          </h1>
          <p className="text-white/80 mt-4 text-lg max-w-xl mx-auto">
            Soluciones profesionales para cada etapa de tu vida
          </p>
        </AnimatedSection>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.name} {...service} index={index} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <AnimatedSection animation="fade-up">
          <h2 className="font-serif text-3xl text-text-primary">
            ¿Listo para comenzar?
          </h2>
          <p className="text-text-secondary mt-3 mb-8">
            Da el primer paso hacia tu bienestar emocional
          </p>
          <Link
            href="/agendar"
            className="inline-block bg-primary text-white rounded-xl px-8 py-4 font-semibold hover:bg-primary-dark transition-colors"
          >
            Agenda tu primera cita
          </Link>
        </AnimatedSection>
      </section>
    </>
  );
}
