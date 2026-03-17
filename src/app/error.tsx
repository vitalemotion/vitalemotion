"use client";

import Link from "next/link";
import { useEffect } from "react";
import { captureError } from "@/lib/sentry";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="font-serif text-5xl font-bold text-primary">Oops</h1>
      <h2 className="mt-4 font-serif text-2xl text-text-primary">
        Algo salio mal
      </h2>
      <p className="mt-2 max-w-md text-text-secondary">
        Ocurrio un error inesperado. Puedes intentar de nuevo o volver al
        inicio.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="rounded-lg border border-primary px-6 py-3 font-sans text-sm font-medium text-primary transition-colors hover:bg-surface"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
