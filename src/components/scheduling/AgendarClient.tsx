"use client";

import { useSchedulingStore } from "@/stores/scheduling";
import AnimatedSection from "@/components/animations/AnimatedSection";
import ProgressIndicator from "@/components/scheduling/ProgressIndicator";
import StepService from "@/components/scheduling/StepService";
import StepPsychologist from "@/components/scheduling/StepPsychologist";
import StepTimeSlot from "@/components/scheduling/StepTimeSlot";
import BookingConfirmation from "@/components/scheduling/BookingConfirmation";

export default function AgendarClient() {
  const { currentStep, bookingResult } = useSchedulingStore();

  // Show confirmation if booking is complete
  const showConfirmation = bookingResult !== null;

  return (
    <>
      {/* Hero with progress indicator */}
      <section className="bg-primary-dark pt-28 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <AnimatedSection animation="fade-up">
            <h1 className="font-serif text-4xl sm:text-5xl text-white">
              Agenda tu cita
            </h1>
            <p className="text-white/70 mt-4 text-lg">
              En 3 simples pasos reserva tu sesion con nuestros profesionales
            </p>
          </AnimatedSection>
        </div>

        {!showConfirmation && (
          <div className="max-w-md mx-auto">
            <ProgressIndicator currentStep={currentStep} />
          </div>
        )}
      </section>

      {/* Step content */}
      <section className="py-16 px-6 min-h-[60vh]">
        <div className="transition-all duration-500 ease-in-out">
          {showConfirmation ? (
            <BookingConfirmation />
          ) : currentStep === 1 ? (
            <StepService />
          ) : currentStep === 2 ? (
            <StepPsychologist />
          ) : (
            <StepTimeSlot />
          )}
        </div>
      </section>
    </>
  );
}
