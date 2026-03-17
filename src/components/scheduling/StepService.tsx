"use client";

import { useEffect, useState } from "react";
import { useSchedulingStore, type SchedulingService } from "@/stores/scheduling";

interface ServicesResponse {
  services?: SchedulingService[];
}

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

function LoadingCard({ index }: { index: number }) {
  return (
    <div
      className="rounded-2xl border-2 border-transparent bg-surface p-6"
      aria-hidden="true"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-4 h-12 w-12 animate-pulse rounded-xl bg-primary/10" />
      <div className="h-6 w-2/3 animate-pulse rounded bg-secondary/80" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-secondary/60" />
      <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-secondary/60" />
      <div className="mt-4 flex gap-3">
        <div className="h-6 w-20 animate-pulse rounded-full bg-primary/10" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-secondary/60" />
      </div>
    </div>
  );
}

export default function StepService() {
  const {
    selectedService,
    setService,
    setPsychologist,
    setSlot,
    setDate,
    nextStep,
  } = useSchedulingStore();
  const [services, setServices] = useState<SchedulingService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      setLoadingServices(true);
      setLoadError(null);

      try {
        const response = await fetch("/api/scheduling/services", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los servicios");
        }

        const data: ServicesResponse = await response.json();
        setServices(Array.isArray(data.services) ? data.services : []);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("[Scheduling] Failed to load services:", error);
        setServices([]);
        setLoadError("No pudimos cargar los servicios disponibles.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingServices(false);
        }
      }
    }

    loadServices();

    return () => controller.abort();
  }, [requestKey]);

  const handleSelect = (service: SchedulingService) => {
    const serviceChanged = selectedService?.id !== service.id;

    setService(service);

    if (serviceChanged) {
      setPsychologist(null);
      setSlot("");
      setDate("");
    }
  };

  const handleNext = () => {
    if (selectedService) {
      nextStep();
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-3xl text-text-primary">
          Selecciona un servicio
        </h2>
        <p className="mt-2 text-text-secondary">
          Elige el tipo de sesion que mejor se adapte a tus necesidades
        </p>
      </div>

      {loadingServices ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <LoadingCard key={index} index={index} />
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-2xl bg-surface p-8 text-center">
          <p className="text-text-primary">{loadError}</p>
          <button
            onClick={() => setRequestKey((current) => current + 1)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Reintentar
          </button>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl bg-surface p-8 text-center">
          <p className="text-text-primary">
            No hay servicios configurados en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
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
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary"
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
                    <path
                      d={
                        serviceIcons[service.name] ||
                        serviceIcons["Terapia Individual"]
                      }
                    />
                  </svg>
                </div>

                <h3 className="font-serif text-lg text-text-primary">
                  {service.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {service.duration} min
                  </span>
                  <span className="text-sm font-semibold text-accent">
                    {formatPrice(service.price)}
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
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
      )}

      <div className="mt-10 text-center">
        <button
          onClick={handleNext}
          disabled={!selectedService || loadingServices || services.length === 0}
          className={`inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold transition-all duration-300 ${
            selectedService && !loadingServices && services.length > 0
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
