"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    const role = session.user.role;
    if (role === "ADMIN" || role === "PSYCHOLOGIST") {
      router.replace("/admin");
    } else {
      router.replace("/portal");
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales incorrectas. Intenta de nuevo.");
        setLoading(false);
        return;
      }

      // Fetch updated session to determine redirect
      const res = await fetch("/api/auth/session");
      const sessionData = await res.json();
      const role = sessionData?.user?.role;

      if (role === "ADMIN" || role === "PSYCHOLOGIST") {
        router.push("/admin");
      } else {
        router.push("/portal");
      }
    } catch {
      setError("Ocurrio un error. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary text-center mb-6">
        Iniciar Sesion
      </h1>

      {error && (
        <div className="bg-error/10 text-error text-sm rounded-xl p-3 mb-4 text-center">
          {error}
        </div>
      )}

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
            className="bg-background border border-transparent focus:border-primary rounded-xl p-4 w-full outline-none transition-colors text-text-primary placeholder:text-text-muted"
            placeholder="Tu contrasena"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white rounded-xl py-3 w-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Iniciando sesion..." : "Iniciar Sesion"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm">
        <p className="text-text-secondary">
          <Link href="/registro" className="text-primary hover:text-primary-dark font-medium transition-colors">
            Crear cuenta
          </Link>
        </p>
        <p className="text-text-secondary">
          <Link href="/reset-password" className="text-text-muted hover:text-primary transition-colors">
            Olvidaste tu contrasena?
          </Link>
        </p>
      </div>
    </div>
  );
}
