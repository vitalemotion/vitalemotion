"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/sentry";

export default function GlobalError({
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
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF8F5",
          color: "#2D2D2D",
          fontFamily:
            "'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily:
              "'Playfair Display', ui-serif, Georgia, serif",
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#7C9A8E",
            margin: 0,
          }}
        >
          Error inesperado
        </h1>
        <p
          style={{
            marginTop: "1rem",
            color: "#6B6560",
            maxWidth: "28rem",
            lineHeight: 1.6,
          }}
        >
          Ocurrio un error critico. Por favor, intenta recargar la pagina.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#7C9A8E",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Recargar
        </button>
      </body>
    </html>
  );
}
