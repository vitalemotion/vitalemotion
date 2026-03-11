"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call — actual email sending to be implemented later
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl text-text-primary mb-3">
          Revisa tu correo
        </h1>
        <p className="text-text-secondary text-sm mb-6">
          Te hemos enviado un enlace para restablecer tu contrasena a{" "}
          <span className="font-medium text-text-primary">{email}</span>.
        </p>
        <Link
          href="/login"
          className="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
        >
          Volver a Iniciar Sesion
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary text-center mb-2">
        Restablecer Contrasena
      </h1>
      <p className="text-text-secondary text-sm text-center mb-6">
        Ingresa tu email y te enviaremos un enlace para restablecer tu contrasena.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background border border-transparent focus:border-primary rounded-xl p-4 w-full outline-none transition-colors text-text-primary placeholder:text-text-muted"
            placeholder="tu@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white rounded-xl py-3 w-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : "Enviar Enlace"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-text-muted hover:text-primary transition-colors">
          Volver a Iniciar Sesion
        </Link>
      </div>
    </div>
  );
}
