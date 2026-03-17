"use client";

import { useEffect, useState } from "react";
import {
  useSchedulingStore,
  type SchedulingPsychologist,
} from "@/stores/scheduling";

interface PsychologistsResponse {
  psychologists?: SchedulingPsychologist[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function LoadingCard({ index }: { index: number }) {
  return (
    <div
      className="rounded-2xl border-2 border-transparent bg-surface p-6"
      aria-hidden="true"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-4 flex justify-center">
        <div className="h-20 w-20 animate-pulse rounded-full bg-primary/10" />
      </div>
      <div className="mx-auto h-6 w-2/3 animate-pulse rounded bg-secondary/80" />
      <div className="mx-auto mt-3 h-4 w-full animate-pulse rounded bg-secondary/60" />
      <div className="mx-auto mt-2 h-4 w-5/6 animate-pulse rounded bg-secondary/60" />
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-primary/10" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-secondary/60" />
      </div>
    </div>
  );
}

export default function StepPsychologist() {
  const {
    selectedPsychologist,
    selectedService,
    setPsychologist,
    nextStep,
    prevStep,
  } = useSchedulingStore();
  const [psychologists, setPsychologists] = useState<SchedulingPsychologist[]>(
    []
  );
  const [loadingPsychologists, setLoadingPsychologists] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);
  const selectedServiceId = selectedService?.id;

  useEffect(() => {
    if (!selectedServiceId) {
      setPsychologists([]);
      setLoadingPsychologists(false);
      setLoadError(null);
      return;
    }

    const controller = new AbortController();

    async function loadPsychologists() {
      const serviceId = selectedServiceId;
      if (!serviceId) {
        return;
      }

      setLoadingPsychologists(true);
      setLoadError(null);

      try {
        const params = new URLSearchParams();
        params.set("serviceId", serviceId);
        const response = await fetch(
          `/api/scheduling/psychologists?${params.toString()}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("No se pudieron cargar los profesionales");
        }

        const data: PsychologistsResponse = await response.json();
        const nextPsychologists = Array.isArray(data.psychologists)
          ? data.psychologists
          : [];

        setPsychologists(nextPsychologists);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("[Scheduling] Failed to load psychologists:", error);
        setPsychologists([]);
        setLoadError("No pudimos cargar los profesionales disponibles.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingPsychologists(false);
        }
      }
    }

    loadPsychologists();

    return () => controller.abort();
  }, [requestKey, selectedServiceId]);

  useEffect(() => {
    if (
      selectedPsychologist &&
      !psychologists.some(
        (psychologist) => psychologist.id === selectedPsychologist.id
      )
    ) {
      setPsychologist(null);
    }
  }, [psychologists, selectedPsychologist, setPsychologist]);

  const handleSelect = (psychologist: SchedulingPsychologist | null) => {
    setPsychologist(psychologist);
  };

  const handleNext = () => {
    nextStep();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-3xl text-text-primary">
          Elige tu profesional
        </h2>
        <p className="mt-2 text-text-secondary">
          Selecciona un psicologo o dejanos asignarte al mejor disponible
        </p>
      </div>

      <button
        onClick={() => handleSelect(null)}
        className={`mb-4 w-full text-left rounded-2xl p-6 transition-all duration-300 border-2 ${
          selectedPsychologist === null
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
            : "border-transparent bg-surface hover:border-primary/30 hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
              selectedPsychologist === null
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg text-text-primary">
              No tengo preferencia
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              Te asignaremos al profesional con mayor disponibilidad para tu
              servicio seleccionado
            </p>
          </div>
          {selectedPsychologist === null && (
            <div className="flex flex-shrink-0 items-center gap-2 text-sm font-medium text-primary">
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
            </div>
          )}
        </div>
      </button>

      {loadingPsychologists ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
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
      ) : psychologists.length === 0 ? (
        <div className="rounded-2xl bg-surface p-8 text-center">
          <p className="text-text-primary">
            No hay perfiles publicados para este servicio.
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Puedes continuar y te asignaremos automaticamente al profesional
            disponible.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {psychologists.map((psychologist) => {
            const isSelected = selectedPsychologist?.id === psychologist.id;
            return (
              <button
                key={psychologist.id}
                onClick={() => handleSelect(psychologist)}
                className={`text-left rounded-2xl p-6 transition-all duration-300 border-2 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-transparent bg-surface hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <div className="mb-4 flex justify-center">
                  {psychologist.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={psychologist.photoUrl}
                      alt={psychologist.name}
                      className="h-20 w-20 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={`flex h-20 w-20 items-center justify-center rounded-full text-xl font-serif font-bold transition-colors ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {getInitials(psychologist.name)}
                    </div>
                  )}
                </div>

                <h3 className="text-center font-serif text-lg text-text-primary">
                  {psychologist.name}
                </h3>
                <p className="mt-2 text-center text-sm leading-relaxed text-text-secondary">
                  {psychologist.bio}
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {psychologist.specialties.slice(0, 3).map((specialty) => (
                    <span
                      key={specialty}
                      className={`rounded-full px-2.5 py-0.5 text-xs ${
                        selectedService &&
                        specialty.toLowerCase() ===
                          selectedService.name.toLowerCase()
                          ? "bg-primary/20 text-primary font-medium"
                          : "bg-secondary/60 text-text-secondary"
                      }`}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {isSelected && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary">
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

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={prevStep}
          className="inline-flex items-center gap-2 font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
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
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary-dark"
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
