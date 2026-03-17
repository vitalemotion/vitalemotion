"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TeamFormData {
  name: string;
  email: string;
  password?: string;
  bio: string;
  specialties: string[];
  calcomUserId: string;
  isActive: boolean;
}

interface TeamFormProps {
  initialData?: TeamFormData & { id: string };
  mode: "create" | "edit";
}

const availableSpecialties = [
  "Ansiedad",
  "Depresion",
  "Estres",
  "Terapia Cognitivo-Conductual",
  "Terapia de Pareja",
  "Terapia Familiar",
  "Comunicacion",
  "Mindfulness",
  "Bienestar Emocional",
  "Autoestima",
  "Desarrollo Personal",
  "Duelo",
  "Trauma",
  "Adicciones",
  "Trastornos Alimentarios",
];

export default function TeamForm({ initialData, mode }: TeamFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [form, setForm] = useState<TeamFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    bio: initialData?.bio || "",
    specialties: initialData?.specialties || [],
    calcomUserId: initialData?.calcomUserId || "",
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSpecialty = (specialty: string) => {
    const trimmed = specialty.trim();
    if (trimmed && !form.specialties.includes(trimmed)) {
      setForm((prev) => ({ ...prev, specialties: [...prev.specialties, trimmed] }));
    }
    setSpecialtyInput("");
    setShowSuggestions(false);
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const filteredSuggestions = availableSpecialties.filter(
    (s) =>
      s.toLowerCase().includes(specialtyInput.toLowerCase()) &&
      !form.specialties.includes(s)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/team"
          : `/api/admin/team/${initialData?.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar");
      }

      router.push("/admin/equipo");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-6 shadow-sm space-y-6 max-w-2xl">
      {error && (
        <div className="bg-error/10 text-error rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
          placeholder="Ej: Dra. Maria Rodriguez"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
          placeholder="email@vitalemocion.com"
        />
      </div>

      {mode === "create" && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
            Contrasena inicial
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
            placeholder="Minimo 8 caracteres"
          />
        </div>
      )}

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-text-primary mb-2">
          Biografia
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={form.bio}
          onChange={handleChange}
          className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors resize-none"
          placeholder="Descripcion profesional del psicologo..."
        />
      </div>

      {/* Specialties */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Especialidades
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {form.specialties.map((spec) => (
            <span
              key={spec}
              className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1"
            >
              {spec}
              <button
                type="button"
                onClick={() => handleRemoveSpecialty(spec)}
                className="hover:text-primary-dark"
              >
                x
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={specialtyInput}
            onChange={(e) => {
              setSpecialtyInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (specialtyInput.trim()) handleAddSpecialty(specialtyInput);
              }
            }}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
            placeholder="Buscar o agregar especialidad..."
          />
          {showSuggestions && specialtyInput && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface rounded-lg shadow-lg border border-primary-dark/5 z-10 max-h-48 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddSpecialty(suggestion)}
                  className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary-dark/5 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cal.com User ID */}
      <div>
        <label htmlFor="calcomUserId" className="block text-sm font-medium text-text-primary mb-2">
          Cal.com User ID
        </label>
        <input
          id="calcomUserId"
          name="calcomUserId"
          type="text"
          value={form.calcomUserId}
          onChange={handleChange}
          className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
          placeholder="ID de usuario en Cal.com (opcional)"
        />
        <p className="text-xs text-text-muted mt-1">
          Necesario para la integracion de agenda
        </p>
      </div>

      {/* isActive toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            form.isActive ? "bg-primary" : "bg-text-muted/30"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              form.isActive ? "translate-x-6" : ""
            }`}
          />
        </button>
        <span className="text-sm text-text-primary">
          {form.isActive ? "Psicologo activo" : "Psicologo inactivo"}
        </span>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white rounded-lg px-6 py-2.5 font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving
            ? "Guardando..."
            : mode === "create"
              ? "Agregar Psicologo"
              : "Guardar Cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/equipo")}
          className="bg-background text-text-secondary rounded-lg px-6 py-2.5 font-medium hover:bg-primary-dark/5 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
