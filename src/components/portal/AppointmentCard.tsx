"use client";

import { useState } from "react";
import Link from "next/link";

type AppointmentStatus =
  | "CONFIRMED"
  | "PENDING"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

interface Appointment {
  id: string;
  service: string;
  psychologist: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

function getStatusClasses(status: AppointmentStatus): string {
  switch (status) {
    case "CONFIRMED":
      return "bg-success/10 text-success";
    case "PENDING":
      return "bg-accent/10 text-accent";
    case "CANCELLED":
      return "bg-error/10 text-error";
    case "COMPLETED":
      return "text-text-muted bg-background";
    case "NO_SHOW":
      return "bg-background text-text-muted";
    default:
      return "bg-surface text-text-secondary";
  }
}

const statusLabels: Record<AppointmentStatus, string> = {
  CONFIRMED: "Confirmada",
  PENDING: "Pendiente",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistio",
};

export default function AppointmentCard({
  appointment,
  isUpcoming,
  onCancel,
}: {
  appointment: Appointment;
  isUpcoming: boolean;
  onCancel?: (id: string) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/portal/appointments/${appointment.id}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "No se pudo cancelar la cita");
      } else {
        onCancel?.(appointment.id);
      }
    } catch {
      alert("Error al cancelar la cita");
    } finally {
      setCancelling(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-text-primary">{appointment.service}</h3>
          <p className="text-sm text-text-muted">{appointment.psychologist}</p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusClasses(appointment.status)}`}
        >
          {statusLabels[appointment.status]}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span>{appointment.date}</span>
        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{appointment.time}</span>
      </div>

      {isUpcoming && appointment.status !== "CANCELLED" && (
        <div className="flex items-center gap-3">
          <Link
            href="/agendar"
            className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
          >
            Reagendar
          </Link>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm text-error font-medium hover:text-error/80 transition-colors"
            >
              Cancelar
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">Confirmar cancelacion?</span>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-xs bg-error text-white px-3 py-1 rounded-lg font-medium hover:bg-error/90 transition-colors disabled:opacity-50"
              >
                {cancelling ? "Cancelando..." : "Si, cancelar"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                No
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
