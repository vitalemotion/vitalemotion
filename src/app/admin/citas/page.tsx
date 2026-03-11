"use client";

import { useEffect, useState, useCallback } from "react";
import AppointmentList from "@/components/admin/AppointmentList";

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

const psychologists = [
  { id: "psy-1", name: "Dra. Laura Jimenez" },
  { id: "psy-2", name: "Dr. Carlos Mendez" },
  { id: "psy-3", name: "Dra. Maria Rodriguez" },
];

const statuses: { value: string; label: string }[] = [
  { value: "", label: "Todos los estados" },
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "COMPLETED", label: "Completada" },
  { value: "CANCELLED", label: "Cancelada" },
  { value: "NO_SHOW", label: "No asistio" },
];

export default function AdminCitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPsychologist, setFilterPsychologist] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterPsychologist) params.set("psychologistId", filterPsychologist);
      if (filterDateFrom) params.set("dateFrom", filterDateFrom);
      if (filterDateTo) params.set("dateTo", filterDateTo);

      const res = await fetch(`/api/admin/appointments?${params.toString()}`);
      const data = await res.json();
      setAppointments(data);
    } catch {
      console.error("Error loading appointments");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPsychologist, filterDateFrom, filterDateTo]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus, notes?: string) => {
    try {
      await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes }),
      });
      // Update local state
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status, notes: notes ?? a.notes } : a
        )
      );
    } catch {
      console.error("Error updating appointment");
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Gestion de Citas</h1>

      {/* Filters */}
      <div className="bg-surface rounded-xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date from */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Desde</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary text-sm outline-none transition-colors"
            />
          </div>

          {/* Date to */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Hasta</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary text-sm outline-none transition-colors"
            />
          </div>

          {/* Psychologist filter */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Psicologo</label>
            <select
              value={filterPsychologist}
              onChange={(e) => setFilterPsychologist(e.target.value)}
              className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary text-sm outline-none transition-colors"
            >
              <option value="">Todos</option>
              {psychologists.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary text-sm outline-none transition-colors"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-surface rounded-xl p-12 text-center">
          <p className="text-text-muted">Cargando citas...</p>
        </div>
      ) : (
        <AppointmentList
          appointments={appointments}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
