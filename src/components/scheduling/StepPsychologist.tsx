"use client";

import { useSchedulingStore, SchedulingPsychologist } from "@/stores/scheduling";

const PLACEHOLDER_PSYCHOLOGISTS: SchedulingPsychologist[] = [
  {
    id: "psy-1",
    name: "Dra. Laura Martinez",
    specialties: ["Terapia Individual", "Terapia de Pareja", "Coaching de Vida"],
    photoUrl: null,
    bio: "Psicologa clinica con 10 anos de experiencia en terapia cognitivo-conductual.",
  },
  {
    id: "psy-2",
    name: "Dr. Carlos Mendez",
    specialties: ["Evaluacion Psicologica", "Terapia Infantil", "Terapia Individual"],
    photoUrl: null,
    bio: "Especialista en evaluacion neuropsicologica y desarrollo infantil.",
  },
  {
    id: "psy-3",
    name: "Dra. Ana Sofia Reyes",
    specialties: ["Talleres de Mindfulness", "Coaching de Vida", "Terapia de Pareja"],
    photoUrl: null,
    bio: "Experta en mindfulness y bienestar emocional con enfoque humanista.",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function StepPsychologist() {
  const { selectedPsychologist, selectedService, setPsychologist, nextStep, prevStep } =
    useSchedulingStore();

  // Filter psychologists that match the selected service
  const matchingPsychologists = selectedService
    ? PLACEHOLDER_PSYCHOLOGISTS.filter((p) =>
        p.specialties.includes(selectedService.name)
      )
    : PLACEHOLDER_PSYCHOLOGISTS;

  const displayPsychologists =
    matchingPsychologists.length > 0
      ? matchingPsychologists
      : PLACEHOLDER_PSYCHOLOGISTS;

  const handleSelect = (psychologist: SchedulingPsychologist | null) => {
    setPsychologist(psychologist);
  };

  const handleNext = () => {
    // Allow proceeding with null (auto-assign) or selected psychologist
    nextStep();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-text-primary">
          Elige tu profesional
        </h2>
        <p className="text-text-secondary mt-2">
          Selecciona un psicologo o dejanos asignarte al mejor disponible
        </p>
      </div>

      {/* Auto-assign option */}
      <button
        onClick={() => handleSelect(null)}
        className={`w-full text-left rounded-2xl p-6 mb-4 transition-all duration-300 border-2 ${
          selectedPsychologist === null
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
            : "border-transparent bg-surface hover:border-primary/30 hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
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
            <p className="text-text-secondary text-sm mt-1">
              Te asignaremos al profesional con mayor disponibilidad para tu
              servicio seleccionado
            </p>
          </div>
          {selectedPsychologist === null && (
            <div className="flex items-center gap-2 text-primary text-sm font-medium flex-shrink-0">
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

      {/* Psychologist cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayPsychologists.map((psychologist) => {
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
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                {psychologist.photoUrl ? (
                  <img
                    src={psychologist.photoUrl}
                    alt={psychologist.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-serif font-bold transition-colors ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {getInitials(psychologist.name)}
                  </div>
                )}
              </div>

              <h3 className="font-serif text-lg text-text-primary text-center">
                {psychologist.name}
              </h3>
              <p className="text-text-secondary text-sm mt-2 text-center leading-relaxed">
                {psychologist.bio}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {psychologist.specialties.slice(0, 3).map((spec) => (
                  <span
                    key={spec}
                    className={`rounded-full px-2.5 py-0.5 text-xs ${
                      selectedService && spec === selectedService.name
                        ? "bg-primary/20 text-primary font-medium"
                        : "bg-secondary/60 text-text-secondary"
                    }`}
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="mt-4 flex items-center justify-center gap-2 text-primary text-sm font-medium">
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

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={prevStep}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium"
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
          className="inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold bg-primary text-white hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20"
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
