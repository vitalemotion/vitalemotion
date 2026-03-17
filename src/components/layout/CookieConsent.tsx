"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "ve-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Defer state update to avoid synchronous setState in effect
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
      }
    } catch {
      // localStorage not available (SSR or blocked)
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "rejected");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-surface border border-text-muted/10 rounded-2xl shadow-lg p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-text-secondary leading-relaxed flex-1">
            Utilizamos cookies para mejorar tu experiencia. Al continuar
            navegando, aceptas nuestra politica de cookies.{" "}
            <Link
              href="/politica-privacidad"
              className="text-primary hover:text-primary-dark underline transition-colors"
            >
              Conoce mas
            </Link>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReject}
              className="px-5 py-2 text-sm font-medium text-text-secondary border border-text-muted/20 rounded-xl hover:bg-background transition-colors"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
