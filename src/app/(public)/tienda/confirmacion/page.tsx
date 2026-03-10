"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AnimatedSection from "@/components/animations/AnimatedSection";

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || "N/A";

  return (
    <div className="pt-24">
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        {/* Animated checkmark */}
        <AnimatedSection animation="scale">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-success"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={0.2}>
          <h1 className="font-serif text-4xl text-text-primary mb-4">
            &iexcl;Gracias por tu compra!
          </h1>
          <p className="text-text-secondary text-lg mb-2">
            Tu pedido ha sido procesado exitosamente.
          </p>
          <p className="text-text-muted text-sm mb-8">
            Numero de orden:{" "}
            <span className="font-mono font-medium text-text-primary">
              {orderId}
            </span>
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={0.3}>
          <div className="bg-surface rounded-2xl p-8 mb-8 text-left space-y-6">
            {/* Digital items section */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-success"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">
                    Productos digitales
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Tus descargas estan listas
                  </p>
                </div>
              </div>
              <div className="ml-13 space-y-2">
                <button className="text-sm text-primary hover:text-primary-dark transition-colors font-medium">
                  Descargar contenido digital &rarr;
                </button>
              </div>
            </div>

            {/* Physical items section */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">
                    Productos fisicos
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Te enviaremos tu pedido a la direccion indicada
                  </p>
                </div>
              </div>
              <p className="ml-13 text-sm text-text-muted">
                Recibirás un correo con el numero de seguimiento cuando tu
                pedido sea enviado.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={0.4}>
          <Link
            href="/tienda"
            className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-dark transition-colors duration-300"
          >
            Volver a la tienda
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-24 text-center py-20">
          <p className="text-text-muted">Cargando...</p>
        </div>
      }
    >
      <ConfirmacionContent />
    </Suspense>
  );
}
