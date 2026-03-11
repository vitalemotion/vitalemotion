"use client";

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { number: 1, label: "Servicio" },
  { number: 2, label: "Profesional" },
  { number: 3, label: "Horario" },
];

export default function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;
        const isFuture = currentStep < step.number;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-semibold text-sm ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-surface text-text-muted"
                }`}
              >
                {isCompleted ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                  isFuture ? "text-text-muted" : "text-white"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 mb-6 transition-colors duration-300 ${
                  currentStep > step.number + 1
                    ? "bg-primary"
                    : currentStep > step.number
                    ? "bg-primary/60"
                    : "bg-white/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
