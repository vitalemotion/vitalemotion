"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const tokenFromUrl = searchParams.get("token") || "";
  const hasResetToken = Boolean(emailFromUrl && tokenFromUrl);

  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = useMemo(
    () => (hasResetToken ? "Crear nueva contrasena" : "Restablecer contrasena"),
    [hasResetToken]
  );

  const description = useMemo(
    () =>
      hasResetToken
        ? "Ingresa tu nueva contrasena para recuperar el acceso a tu cuenta."
        : "Ingresa tu email y te enviaremos un enlace para restablecer tu contrasena.",
    [hasResetToken]
  );

  const handleRequestReset = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setPreviewUrl("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        previewUrl?: string | null;
      };

      if (!response.ok) {
        setError(data.error || "No se pudo iniciar la recuperacion.");
        return;
      }

      setSubmitted(true);
      setSuccessMessage(
        data.message ||
          "Si existe una cuenta asociada a ese correo, enviaremos instrucciones."
      );
      setPreviewUrl(data.previewUrl || "");
    } catch {
      setError("No se pudo iniciar la recuperacion.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyReset = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("La contrasena debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailFromUrl,
          token: tokenFromUrl,
          password,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setError(data.error || "No se pudo actualizar la contrasena.");
        return;
      }

      setSubmitted(true);
      setSuccessMessage(
        data.message || "Tu contrasena fue actualizada correctamente."
      );
    } catch {
      setError("No se pudo actualizar la contrasena.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl text-text-primary mb-3">{title}</h1>
        <p className="text-text-secondary text-sm mb-4">{successMessage}</p>
        {previewUrl && (
          <div className="bg-background rounded-xl p-4 text-left mb-6">
            <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
              Enlace de prueba
            </p>
            <Link
              href={previewUrl}
              className="text-sm text-primary hover:text-primary-dark break-all transition-colors"
            >
              {previewUrl}
            </Link>
          </div>
        )}
        <Link
          href="/login"
          className="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
        >
          Volver a iniciar sesion
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary text-center mb-2">
        {title}
      </h1>
      <p className="text-text-secondary text-sm text-center mb-6">
        {description}
      </p>

      <form
        onSubmit={hasResetToken ? handleApplyReset : handleRequestReset}
        className="space-y-4"
      >
        {!hasResetToken && (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="bg-background border border-transparent focus:border-primary rounded-xl p-4 w-full outline-none transition-colors text-text-primary placeholder:text-text-muted"
              placeholder="tu@email.com"
            />
          </div>
        )}

        {hasResetToken && (
          <>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                Nueva contrasena
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="bg-background border border-transparent focus:border-primary rounded-xl p-4 w-full outline-none transition-colors text-text-primary placeholder:text-text-muted"
                placeholder="Minimo 8 caracteres"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                Confirmar contrasena
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                className="bg-background border border-transparent focus:border-primary rounded-xl p-4 w-full outline-none transition-colors text-text-primary placeholder:text-text-muted"
                placeholder="Repite la contrasena"
              />
            </div>
          </>
        )}

        {error && <p className="text-sm text-error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white rounded-xl py-3 w-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Procesando..."
            : hasResetToken
              ? "Guardar nueva contrasena"
              : "Enviar enlace"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="text-text-muted hover:text-primary transition-colors"
        >
          Volver a iniciar sesion
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <p className="text-sm text-text-muted">Cargando...</p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
