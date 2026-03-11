"use client";

import { useState, useEffect } from "react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateField = (field: keyof ProfileData, value: string | boolean) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (!newPassword || !confirmPassword) {
      setPasswordError("Completa todos los campos");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contrasenas no coinciden");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("La contrasena debe tener al menos 8 caracteres");
      return;
    }

    setPasswordSaving(true);
    try {
      // Mock password change
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError("Error al cambiar la contrasena");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-2xl p-6 shadow-sm animate-pulse">
            <div className="h-5 bg-background rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-background rounded" />
              <div className="h-10 bg-background rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Datos Personales */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm">
        <h2 className="font-serif text-lg text-text-primary mb-4">Datos Personales</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Nombre</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full bg-background border border-text-muted/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full bg-background/50 border border-text-muted/20 rounded-xl px-4 py-2.5 text-sm text-text-muted cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Telefono</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full bg-background border border-text-muted/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Direccion de Envio */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm">
        <h2 className="font-serif text-lg text-text-primary mb-4">Direccion de Envio</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Direccion</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full bg-background border border-text-muted/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Ciudad</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full bg-background border border-text-muted/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Departamento</label>
              <input
                type="text"
                value={profile.state}
                onChange={(e) => updateField("state", e.target.value)}
                className="w-full bg-background border border-text-muted/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Codigo Postal</label>
              <input
                type="text"
                value={profile.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                className="w-full bg-background border border-text-muted/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preferencias de Notificacion */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm">
        <h2 className="font-serif text-lg text-text-primary mb-4">Preferencias de Notificacion</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.emailNotifications}
              onChange={(e) => updateField("emailNotifications", e.target.checked)}
              className="w-4 h-4 rounded border-text-muted/30 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-text-primary">Notificaciones por email</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.whatsappNotifications}
              onChange={(e) => updateField("whatsappNotifications", e.target.checked)}
              className="w-4 h-4 rounded border-text-muted/30 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-text-primary">Notificaciones por WhatsApp</span>
          </label>
        </div>
      </div>

      {/* Save profile button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-primary text-white rounded-xl py-3 text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar Cambios"}
      </button>

      {success && (
        <p className="text-sm text-success text-center">Perfil actualizado exitosamente</p>
      )}

      {/* Cambiar Contrasena */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm">
        <h2 className="font-serif text-lg text-text-primary mb-4">Cambiar Contrasena</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Contrasena actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPasswordError("");
                setPasswordSuccess(false);
              }}
              className="w-full bg-background border border-text-muted/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Nueva contrasena</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError("");
                setPasswordSuccess(false);
              }}
              className="w-full bg-background border border-text-muted/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Confirmar nueva contrasena</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
                setPasswordSuccess(false);
              }}
              className="w-full bg-background border border-text-muted/20 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {passwordError && (
            <p className="text-sm text-error">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-success">Contrasena actualizada exitosamente</p>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={passwordSaving}
            className="bg-surface text-primary border border-primary rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            {passwordSaving ? "Guardando..." : "Cambiar Contrasena"}
          </button>
        </div>
      </div>
    </div>
  );
}
