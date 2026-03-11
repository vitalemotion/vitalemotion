"use client";

import { useSchedulingStore, SchedulingService } from "@/stores/scheduling";

const PLACEHOLDER_SERVICES: SchedulingService[] = [
  {
    id: "svc-1",
    name: "Terapia Individual",
    duration: 50,
    price: 80000,
    description:
      "Sesiones de 50 minutos enfocadas en tus necesidades personales.",
  },
  {
    id: "svc-2",
    name: "Terapia de Pareja",
    duration: 90,
    price: 120000,
    description:
      "Mejora la comunicacion y fortalece tu relacion. Sesiones de 90 minutos.",
  },
  {
    id: "svc-3",
    name: "Evaluacion Psicologica",
    duration: 120,
    price: 150000,
    description:
      "Evaluacion integral con pruebas estandarizadas para un diagnostico preciso.",
  },
  {
    id: "svc-4",
    name: "Talleres de Mindfulness",
    duration: 60,
    price: 40000,
    description:
      "Grupos reducidos para aprender tecnicas de mindfulness y reduccion de estres.",
  },
  {
    id: "svc-5",
    name: "Terapia Infantil",
    duration: 45,
    price: 70000,
    description:
      "Intervencion especializada para ninos y adolescentes con enfoque ludico.",
  },
  {
    id: "svc-6",
    name: "Coaching de Vida",
    duration: 50,
    price: 90000,
    description:
      "Acompanamiento profesional para alcanzar tus metas personales y profesionales.",
  },
];

const serviceIcons: Record<string, string> = {
  "Terapia Individual": "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2",
  "Terapia de Pareja": "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
  "Evaluacion Psicologica": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2",
  "Talleres de Mindfulness": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2",
  "Terapia Infantil": "M12 2L2 7l10 5 10-5-10-5z",
  "Coaching de Vida": "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function StepService() {
  const { selectedService, setService, nextStep } = useSchedulingStore();

  const handleSelect = (service: SchedulingService) => {
    setService(service);
  };

  const handleNext = () => {
    if (selectedService) {
      nextStep();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-text-primary">
          Selecciona un servicio
        </h2>
        <p className="text-text-secondary mt-2">
          Elige el tipo de sesion que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLACEHOLDER_SERVICES.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => handleSelect(service)}
              className={`text-left rounded-2xl p-6 transition-all duration-300 border-2 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-transparent bg-surface hover:border-primary/30 hover:shadow-md"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                }`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={serviceIcons[service.name] || serviceIcons["Terapia Individual"]} />
                </svg>
              </div>

              <h3 className="font-serif text-lg text-text-primary">
                {service.name}
              </h3>
              <p className="text-text-secondary text-sm mt-1 leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                  {service.duration} min
                </span>
                <span className="text-accent font-semibold text-sm">
                  {formatPrice(service.price)}
                </span>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Seleccionado
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleNext}
          disabled={!selectedService}
          className={`inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold transition-all duration-300 ${
            selectedService
              ? "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20"
              : "bg-surface text-text-muted cursor-not-allowed"
          }`}
        >
          Siguiente
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
