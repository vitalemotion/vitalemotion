"use client";

import { useState } from "react";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  psychologistName: string;
  psychologistId: string;
  service: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes: string | null;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: AppointmentStatus, notes?: string) => void;
}

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistio",
};

const statusBadgeClasses: Record<AppointmentStatus, string> = {
  PENDING: "bg-accent/10 text-accent",
  CONFIRMED: "bg-success/10 text-success",
  CANCELLED: "bg-error/10 text-error",
  COMPLETED: "bg-primary/10 text-primary",
  NO_SHOW: "bg-text-muted/10 text-text-muted",
};

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
}

export default function AppointmentList({ appointments, onUpdateStatus }: AppointmentListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const handleExpand = (apt: Appointment) => {
    if (expandedId === apt.id) {
      setExpandedId(null);
    } else {
      setExpandedId(apt.id);
      setEditNotes(apt.notes || "");
    }
  };

  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-dark/5 text-left">
              <th className="px-6 py-4 font-medium text-text-secondary">Paciente</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Servicio</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Psicologo</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Fecha</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Hora</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Estado</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-dark/5">
            {appointments.map((apt) => {
              const { date, time } = formatDateTime(apt.startTime);
              const isExpanded = expandedId === apt.id;
              return (
                <tr key={apt.id} className="group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-text-primary">{apt.patientName}</p>
                      <p className="text-xs text-text-muted">{apt.patientEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{apt.service}</td>
                  <td className="px-6 py-4 text-text-secondary">{apt.psychologistName}</td>
                  <td className="px-6 py-4 text-text-primary">{date}</td>
                  <td className="px-6 py-4 text-text-primary font-medium">{time}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClasses[apt.status]}`}
                    >
                      {statusLabels[apt.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleExpand(apt)}
                      className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                    >
                      {isExpanded ? "Cerrar" : "Ver / Editar"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                  No hay citas que mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Expanded detail panel */}
      {expandedId && (() => {
        const apt = appointments.find((a) => a.id === expandedId);
        if (!apt) return null;
        return (
          <div className="border-t border-primary-dark/5 p-6 bg-background/50">
            <div className="max-w-xl space-y-4">
              <h3 className="font-medium text-text-primary">Detalles de la cita</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">Paciente</p>
                  <p className="text-text-primary">{apt.patientName}</p>
                </div>
                <div>
                  <p className="text-text-muted">Servicio</p>
                  <p className="text-text-primary">{apt.service}</p>
                </div>
                <div>
                  <p className="text-text-muted">Psicologo</p>
                  <p className="text-text-primary">{apt.psychologistName}</p>
                </div>
                <div>
                  <p className="text-text-muted">Horario</p>
                  <p className="text-text-primary">
                    {formatDateTime(apt.startTime).time} - {formatDateTime(apt.endTime).time}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Notas</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors resize-none text-sm"
                  placeholder="Agregar notas sobre la cita..."
                />
              </div>

              {/* Status actions */}
              <div className="flex flex-wrap gap-2">
                {apt.status === "PENDING" && (
                  <button
                    onClick={() => onUpdateStatus(apt.id, "CONFIRMED", editNotes)}
                    className="bg-success/10 text-success rounded-lg px-4 py-2 text-sm font-medium hover:bg-success/20 transition-colors"
                  >
                    Confirmar
                  </button>
                )}
                {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(apt.id, "COMPLETED", editNotes)}
                      className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      Marcar Completada
                    </button>
                    <button
                      onClick={() => onUpdateStatus(apt.id, "NO_SHOW", editNotes)}
                      className="bg-text-muted/10 text-text-muted rounded-lg px-4 py-2 text-sm font-medium hover:bg-text-muted/20 transition-colors"
                    >
                      No Asistio
                    </button>
                    <button
                      onClick={() => onUpdateStatus(apt.id, "CANCELLED", editNotes)}
                      className="bg-error/10 text-error rounded-lg px-4 py-2 text-sm font-medium hover:bg-error/20 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {editNotes !== (apt.notes || "") && (
                  <button
                    onClick={() => onUpdateStatus(apt.id, apt.status, editNotes)}
                    className="bg-background text-text-secondary rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-dark/5 transition-colors"
                  >
                    Guardar Notas
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
