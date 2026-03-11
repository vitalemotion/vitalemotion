"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!nombre.trim()) return "El nombre es requerido.";
    if (!email.trim()) return "El email es requerido.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "El formato de email no es valido.";
    if (password.length < 8) return "La contrasena debe tener al menos 8 caracteres.";
    if (password !== confirmPassword) return "Las contrasenas no coinciden.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nombre, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta.");
        setLoading(false);
        return;
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Registration succeeded but auto-login failed, redirect to login
        router.push("/login");
        return;
      }

      router.push("/portal");
    } catch {
      setError("Ocurrio un error. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary text-center mb-6">
        Crear Cuenta
      </h1>

      {error && (
        <div className="bg-error/10 text-error text-sm rounded-xl p-3 mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-text-secondary mb-1">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="bg-background border border-transparent focus:border-primary rounded-xl p-4 w-full outline-none transition-colors text-text-primary placeholder:text-text-muted"
            placeholder="Tu nombre completo"
          />
        </div>

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
            Contrasena
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="bg-background border border-transparent focus:border-primary rounded-xl p-4 w-full outline-none transition-colors text-text-primary placeholder:text-text-muted"
            placeholder="Minimo 8 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">
            Confirmar Contrasena
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-background border border-transparent focus:border-primary rounded-xl p-4 w-full outline-none transition-colors text-text-primary placeholder:text-text-muted"
            placeholder="Repite tu contrasena"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white rounded-xl py-3 w-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-text-secondary">
          Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
            Iniciar Sesion
          </Link>
        </p>
      </div>
    </div>
  );
}
