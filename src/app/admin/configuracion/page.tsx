"use client";

import { useEffect, useState } from "react";
import SettingsForm from "@/components/admin/SettingsForm";

interface SettingsData {
  practiceName: string;
  practiceDescription: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  socialInstagram: string;
  socialFacebook: string;
  socialWhatsapp: string;
  businessHours: string;
}

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setSettings(data);
      } catch {
        console.error("Error loading settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (data: SettingsData) => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error al guardar configuracion");
    }

    const updated = await res.json();
    setSettings(updated);
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Configuracion</h1>

      {loading ? (
        <div className="bg-surface rounded-xl p-12 text-center">
          <p className="text-text-muted">Cargando configuracion...</p>
        </div>
      ) : settings ? (
        <SettingsForm initialData={settings} onSave={handleSave} />
      ) : (
        <div className="bg-surface rounded-xl p-12 text-center">
          <p className="text-text-muted">Error al cargar la configuracion.</p>
        </div>
      )}
    </div>
  );
}
