"use client";

import { useState, useEffect, useCallback } from "react";
import { useSchedulingStore } from "@/stores/scheduling";

interface TimeSlotData {
  time: string;
  available: boolean;
}

function getNext7Days(): { date: string; label: string; dayName: string }[] {
  const days: { date: string; label: string; dayName: string }[] = [];
  const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  const monthNames = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];

  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    days.push({
      date: `${year}-${month}-${day}`,
      label: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      dayName: dayNames[d.getDay()],
    });
  }

  return days;
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export default function StepTimeSlot() {
  const {
    selectedService,
    selectedPsychologist,
    selectedSlot,
    selectedDate,
    patientInfo,
    isBooking,
    setSlot,
    setDate,
    setPatientInfo,
    setBookingResult,
    setIsBooking,
    prevStep,
  } = useSchedulingStore();

  const [slots, setSlots] = useState<TimeSlotData[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slotsError, setSlotsError] = useState("");

  const next7Days = getNext7Days();

  // Initialize date to first available weekday
  useEffect(() => {
    if (!selectedDate && next7Days.length > 0) {
      const firstWeekday = next7Days.find((d) => {
        const date = new Date(d.date);
        const day = date.getDay();
        return day !== 0 && day !== 6;
      });
      if (firstWeekday) {
        setDate(firstWeekday.date);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSlots = useCallback(async (date: string) => {
    setLoadingSlots(true);
    setSlots([]);
    setSlotsError("");
    try {
      const params = new URLSearchParams({ date });
      if (selectedService) params.set("serviceId", selectedService.id);
      if (selectedPsychologist)
        params.set("psychologistId", selectedPsychologist.id);

      const response = await fetch(
        `/api/scheduling/available-slots?${params.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setSlots(data.slots || []);
      } else {
        const data = (await response.json()) as { error?: string };
        setSlotsError(
          data.error || "No se pudieron cargar los horarios disponibles."
        );
        setSlots([]);
      }
    } catch {
      setSlotsError("No se pudieron cargar los horarios disponibles.");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedService, selectedPsychologist]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  const handleDateSelect = (date: string) => {
    setDate(date);
    setSlot(""); // Reset slot when date changes
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!patientInfo.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    if (!patientInfo.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientInfo.email)) {
      newErrors.email = "Email invalido";
    }
    if (!patientInfo.phone.trim()) {
      newErrors.phone = "El telefono es requerido";
    } else if (!/^\+?[\d\s()-]{7,15}$/.test(patientInfo.phone.trim())) {
      newErrors.phone = "Telefono invalido";
    }
    if (!selectedSlot) {
      newErrors.slot = "Selecciona un horario";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsBooking(true);
    try {
      const response = await fetch("/api/scheduling/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService?.id,
          psychologistId: selectedPsychologist?.id || null,
          slotTime: selectedSlot,
          patientName: patientInfo.name.trim(),
          patientEmail: patientInfo.email.trim(),
          patientPhone: patientInfo.phone.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBookingResult({
          success: true,
          bookingId: data.bookingId,
          appointmentId: data.appointmentId,
          psychologistId: data.psychologistId,
          psychologistName: data.psychologistName,
        });
      } else {
        setBookingResult({
          success: false,
          error: data.error || "No se pudo completar la reserva.",
        });
      }
    } catch {
      setBookingResult({
        success: false,
        error: "No se pudo completar la reserva.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const isWeekend = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDay() === 0 || d.getDay() === 6;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-text-primary">
          Selecciona fecha y hora
        </h2>
        <p className="text-text-secondary mt-2">
          Elige el horario que mas te convenga y completa tus datos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Date & Time selection */}
        <div>
          {/* Date picker */}
          <h3 className="font-semibold text-text-primary mb-3">Fecha</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {next7Days.map((day) => {
              const isSelected = selectedDate === day.date;
              const weekend = isWeekend(day.date);
              return (
                <button
                  key={day.date}
                  onClick={() => !weekend && handleDateSelect(day.date)}
                  disabled={weekend}
                  className={`flex-shrink-0 rounded-xl px-4 py-3 text-center transition-all duration-200 min-w-[70px] ${
                    weekend
                      ? "bg-surface/50 text-text-muted cursor-not-allowed opacity-50"
                      : isSelected
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-surface text-text-primary hover:bg-secondary"
                  }`}
                >
                  <div className="text-xs font-medium">{day.dayName}</div>
                  <div className="text-sm font-semibold mt-0.5">{day.label}</div>
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          <h3 className="font-semibold text-text-primary mb-3 mt-6">Horario</h3>
          {loadingSlots ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-2xl">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mx-auto text-text-muted mb-3"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <p className="text-text-muted text-sm">
                {slotsError || "No hay horarios disponibles para esta fecha"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots
                .filter((s) => s.available)
                .map((slot) => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      onClick={() => setSlot(slot.time)}
                      className={`rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-surface text-text-primary hover:bg-secondary"
                      }`}
                    >
                      {formatTime(slot.time)}
                    </button>
                  );
                })}
            </div>
          )}
          {errors.slot && (
            <p className="text-error text-sm mt-2">{errors.slot}</p>
          )}
        </div>

        {/* Right column: Patient info form */}
        <div>
          <h3 className="font-semibold text-text-primary mb-3">
            Tus datos de contacto
          </h3>
          <div className="bg-surface rounded-2xl p-6 space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="patient-name"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Nombre completo
              </label>
              <input
                id="patient-name"
                type="text"
                value={patientInfo.name}
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, name: e.target.value })
                }
                placeholder="Tu nombre"
                className={`w-full rounded-xl border px-4 py-3 text-sm bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                  errors.name ? "border-error" : "border-secondary"
                }`}
              />
              {errors.name && (
                <p className="text-error text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="patient-email"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Correo electronico
              </label>
              <input
                id="patient-email"
                type="email"
                value={patientInfo.email}
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, email: e.target.value })
                }
                placeholder="tu@email.com"
                className={`w-full rounded-xl border px-4 py-3 text-sm bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                  errors.email ? "border-error" : "border-secondary"
                }`}
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="patient-phone"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Telefono / WhatsApp
              </label>
              <input
                id="patient-phone"
                type="tel"
                value={patientInfo.phone}
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, phone: e.target.value })
                }
                placeholder="+57 300 123 4567"
                className={`w-full rounded-xl border px-4 py-3 text-sm bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                  errors.phone ? "border-error" : "border-secondary"
                }`}
              />
              {errors.phone && (
                <p className="text-error text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Summary */}
            {selectedService && (
              <div className="border-t border-secondary pt-4 mt-4">
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  Resumen de tu cita
                </h4>
                <div className="space-y-1.5 text-sm text-text-secondary">
                  <div className="flex justify-between">
                    <span>Servicio:</span>
                    <span className="font-medium text-text-primary">
                      {selectedService.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profesional:</span>
                    <span className="font-medium text-text-primary">
                      {selectedPsychologist?.name || "Asignacion automatica"}
                    </span>
                  </div>
                  {selectedSlot && (
                    <div className="flex justify-between">
                      <span>Horario:</span>
                      <span className="font-medium text-text-primary">
                        {new Date(selectedSlot).toLocaleDateString("es-CO", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        - {formatTime(selectedSlot)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-secondary">
                    <span className="font-semibold text-text-primary">
                      Total:
                    </span>
                    <span className="font-semibold text-accent">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(selectedService.price)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
          onClick={handleSubmit}
          disabled={isBooking}
          className={`inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold transition-all duration-300 ${
            isBooking
              ? "bg-primary/60 text-white/80 cursor-wait"
              : "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20"
          }`}
        >
          {isBooking ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Confirmando...
            </>
          ) : (
            <>
              Confirmar Cita
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
