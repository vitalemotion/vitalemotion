"use client";

import { useState } from "react";

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
  calcomEventTypeIds: string;
}

interface SettingsFormProps {
  initialData: SettingsData;
  onSave: (data: SettingsData) => Promise<void>;
}

export default function SettingsForm({ initialData, onSave }: SettingsFormProps) {
  const [form, setForm] = useState<SettingsData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSaved(false);

    try {
      JSON.parse(form.calcomEventTypeIds || "{}");
      await onSave(form);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="bg-error/10 text-error rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-success/10 text-success rounded-lg p-4 text-sm">
          Configuracion guardada correctamente.
        </div>
      )}

      {/* General */}
      <div className="bg-surface rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="font-serif text-lg text-text-primary border-b border-primary-dark/5 pb-3">
          General
        </h2>

        <div>
          <label htmlFor="practiceName" className="block text-sm font-medium text-text-primary mb-2">
            Nombre del consultorio
          </label>
          <input
            id="practiceName"
            name="practiceName"
            type="text"
            value={form.practiceName}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="practiceDescription"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Descripcion
          </label>
          <textarea
            id="practiceDescription"
            name="practiceDescription"
            rows={3}
            value={form.practiceDescription}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors resize-none"
          />
        </div>
      </div>

      {/* Contacto */}
      <div className="bg-surface rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="font-serif text-lg text-text-primary border-b border-primary-dark/5 pb-3">
          Contacto
        </h2>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-text-primary mb-2">
            Telefono
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            value={form.contactPhone}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-text-primary mb-2">
            Email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contactAddress" className="block text-sm font-medium text-text-primary mb-2">
            Direccion
          </label>
          <input
            id="contactAddress"
            name="contactAddress"
            type="text"
            value={form.contactAddress}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
          />
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="bg-surface rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="font-serif text-lg text-text-primary border-b border-primary-dark/5 pb-3">
          Redes Sociales
        </h2>

        <div>
          <label htmlFor="socialInstagram" className="block text-sm font-medium text-text-primary mb-2">
            Instagram
          </label>
          <input
            id="socialInstagram"
            name="socialInstagram"
            type="url"
            value={form.socialInstagram}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
            placeholder="https://instagram.com/..."
          />
        </div>

        <div>
          <label htmlFor="socialFacebook" className="block text-sm font-medium text-text-primary mb-2">
            Facebook
          </label>
          <input
            id="socialFacebook"
            name="socialFacebook"
            type="url"
            value={form.socialFacebook}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
            placeholder="https://facebook.com/..."
          />
        </div>

        <div>
          <label htmlFor="socialWhatsapp" className="block text-sm font-medium text-text-primary mb-2">
            WhatsApp (numero)
          </label>
          <input
            id="socialWhatsapp"
            name="socialWhatsapp"
            type="text"
            value={form.socialWhatsapp}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
            placeholder="573001234567"
          />
          <p className="text-xs text-text-muted mt-1">
            Numero con codigo de pais, sin espacios ni signos
          </p>
        </div>
      </div>

      {/* Horario */}
      <div className="bg-surface rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="font-serif text-lg text-text-primary border-b border-primary-dark/5 pb-3">
          Horario
        </h2>

        <div>
          <label htmlFor="businessHours" className="block text-sm font-medium text-text-primary mb-2">
            Horario de atencion
          </label>
          <textarea
            id="businessHours"
            name="businessHours"
            rows={4}
            value={form.businessHours}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors resize-none"
            placeholder="Lunes a Viernes: 8:00 AM - 6:00 PM&#10;Sabados: 9:00 AM - 1:00 PM"
          />
        </div>
      </div>

      <div className="bg-surface rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="font-serif text-lg text-text-primary border-b border-primary-dark/5 pb-3">
          Integraciones
        </h2>

        <div>
          <label
            htmlFor="calcomEventTypeIds"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Event types de Cal.com por servicio
          </label>
          <textarea
            id="calcomEventTypeIds"
            name="calcomEventTypeIds"
            rows={6}
            value={form.calcomEventTypeIds}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors font-mono text-sm"
            placeholder={`{\n  "terapia-individual": 123456,\n  "terapia-de-pareja": 123457\n}`}
          />
          <p className="text-xs text-text-muted mt-1">
            Usa el `serviceId` como clave. El valor debe ser el `eventTypeId`
            correspondiente en Cal.com.
          </p>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white rounded-lg px-8 py-2.5 font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Configuracion"}
        </button>
      </div>
    </form>
  );
}
