"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSchedulingStore } from "@/stores/scheduling";

function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function BookingConfirmation() {
  const {
    selectedService,
    selectedPsychologist,
    selectedSlot,
    patientInfo,
    bookingResult,
    reset,
  } = useSchedulingStore();

  const checkRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // Animate the checkmark on mount
  useEffect(() => {
    const circle = checkRef.current;
    const path = pathRef.current;

    if (circle && path) {
      // Reset and animate
      circle.style.strokeDasharray = "314";
      circle.style.strokeDashoffset = "314";
      path.style.strokeDasharray = "50";
      path.style.strokeDashoffset = "50";

      requestAnimationFrame(() => {
        circle.style.transition = "stroke-dashoffset 0.6s ease-out";
        circle.style.strokeDashoffset = "0";

        setTimeout(() => {
          path.style.transition = "stroke-dashoffset 0.4s ease-out";
          path.style.strokeDashoffset = "0";
        }, 400);
      });
    }
  }, []);

  const isSuccess = bookingResult?.success;

  if (!isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-error"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-text-primary mb-3">
          No pudimos confirmar tu cita
        </h2>
        <p className="text-text-secondary mb-8">
          Hubo un error al procesar tu reserva. Por favor intenta de nuevo o
          contactanos directamente.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold bg-surface text-text-primary hover:bg-secondary transition-colors"
          >
            Contactarnos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      {/* Animated checkmark */}
      <div className="mb-8">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className="mx-auto"
        >
          <circle
            ref={checkRef}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#6B9E7A"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            ref={pathRef}
            d="M30 50 L45 65 L72 35"
            fill="none"
            stroke="#6B9E7A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="font-serif text-3xl text-text-primary mb-2">
        Cita confirmada
      </h2>
      <p className="text-text-secondary mb-8">
        Tu cita ha sido reservada exitosamente
      </p>

      {/* Summary card */}
      <div className="bg-surface rounded-2xl p-6 text-left mb-8">
        <h3 className="font-serif text-lg text-text-primary mb-4 text-center">
          Detalles de tu cita
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-start">
            <span className="text-text-secondary">Servicio</span>
            <span className="font-medium text-text-primary text-right">
              {selectedService?.name}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-text-secondary">Profesional</span>
            <span className="font-medium text-text-primary text-right">
              {selectedPsychologist?.name ||
                bookingResult?.psychologistName ||
                "Asignado automaticamente"}
            </span>
          </div>
          {selectedSlot && (
            <div className="flex justify-between items-start">
              <span className="text-text-secondary">Fecha y hora</span>
              <span className="font-medium text-text-primary text-right">
                {formatDateTime(selectedSlot)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-start">
            <span className="text-text-secondary">Duracion</span>
            <span className="font-medium text-text-primary">
              {selectedService?.duration} min
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-text-secondary">Paciente</span>
            <span className="font-medium text-text-primary text-right">
              {patientInfo.name}
            </span>
          </div>
          <div className="border-t border-secondary pt-3 flex justify-between items-start">
            <span className="font-semibold text-text-primary">Total</span>
            <span className="font-semibold text-accent">
              {selectedService ? formatPrice(selectedService.price) : ""}
            </span>
          </div>
        </div>
      </div>

      {/* WhatsApp reminder note */}
      <div className="bg-success/10 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left">
        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-success"
          >
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
              fill="currentColor"
            />
            <path
              d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-success">
            Recordatorio por WhatsApp
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Te enviaremos un recordatorio 24 horas y 1 hora antes de tu cita al
            numero {patientInfo.phone || "registrado"}.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold bg-surface text-text-primary hover:bg-secondary transition-colors"
        >
          Volver al inicio
        </Link>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          Agendar otra cita
        </button>
      </div>
    </div>
  );
}
