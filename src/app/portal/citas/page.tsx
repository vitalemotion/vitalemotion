"use client";

import { useState, useEffect } from "react";
import AppointmentCard from "@/components/portal/AppointmentCard";

type AppointmentStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";

interface Appointment {
  id: string;
  service: string;
  psychologist: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  startTime: string;
}

export default function CitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

  useEffect(() => {
    fetch("/api/portal/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const now = new Date();

  const upcoming = appointments.filter(
    (apt) => new Date(apt.startTime) >= now && apt.status !== "COMPLETED"
  );
  const history = appointments.filter(
    (apt) => new Date(apt.startTime) < now || apt.status === "COMPLETED"
  );

  const handleCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: "CANCELLED" as AppointmentStatus } : apt
      )
    );
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Mis Citas</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "upcoming"
              ? "bg-primary text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Proximas
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "bg-primary text-white"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Historial
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-background rounded w-1/3 mb-2" />
              <div className="h-3 bg-background rounded w-1/4 mb-4" />
              <div className="h-3 bg-background rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === "upcoming" ? (
            upcoming.length > 0 ? (
              upcoming.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  isUpcoming={true}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <div className="bg-surface rounded-2xl p-8 shadow-sm text-center">
                <p className="text-text-muted">No tienes citas proximas</p>
              </div>
            )
          ) : history.length > 0 ? (
            history.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                isUpcoming={false}
              />
            ))
          ) : (
            <div className="bg-surface rounded-2xl p-8 shadow-sm text-center">
              <p className="text-text-muted">No tienes citas anteriores</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
