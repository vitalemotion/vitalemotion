"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const safeCallbackUrl = callbackUrl.startsWith("/") ? callbackUrl : "";

  useEffect(() => {
    if (!session) {
      return;
    }

    if (safeCallbackUrl) {
      router.replace(safeCallbackUrl);
      return;
    }

    const role = session.user.role;
    router.replace(role === "ADMIN" || role === "PSYCHOLOGIST" ? "/admin" : "/portal");
  }, [router, safeCallbackUrl, session]);

  if (session) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

      const response = await fetch("/api/auth/session");
      const sessionData = (await response.json()) as {
        user?: { role?: string };
      };
      const role = sessionData?.user?.role;

      if (safeCallbackUrl) {
        router.push(safeCallbackUrl);
      } else if (role === "ADMIN" || role === "PSYCHOLOGIST") {
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

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            Contrasena
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
          <Link
            href="/registro"
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Crear cuenta
          </Link>
        </p>
        <p className="text-text-secondary">
          <Link
            href="/reset-password"
            className="text-text-muted hover:text-primary transition-colors"
          >
            Olvidaste tu contrasena?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <p className="text-sm text-text-muted">Cargando...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
