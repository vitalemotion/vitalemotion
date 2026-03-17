"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import AnimatedSection from "@/components/animations/AnimatedSection";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  type: "digital" | "physical";
  downloadUrl?: string | null;
}

interface OrderDetails {
  id: string;
  createdAt: string;
  total: string;
  hasDigitalItems: boolean;
  hasPhysicalItems: boolean;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;
  items: OrderItem[];
}

function ConfirmacionContent() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || "N/A";
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const items = order?.items || [];

  useEffect(() => {
    if (!orderId || orderId === "N/A") {
      setLoading(false);
      setError("No encontramos el pedido para mostrar sus detalles.");
      return;
    }

    if (status === "loading") {
      return;
    }

    if (status !== "authenticated") {
      setLoading(false);
      setError("Inicia sesion para ver los detalles completos de tu compra.");
      return;
    }

    let active = true;

    async function loadOrder() {
      try {
        const response = await fetch(`/api/store/orders/${orderId}`);
        const data = (await response.json()) as OrderDetails & { error?: string };

        if (!active) {
          return;
        }

        if (!response.ok) {
          setError(data.error || "No se pudo cargar el pedido.");
          return;
        }

        setOrder(data);
      } catch {
        if (active) {
          setError("No se pudo cargar el pedido.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOrder();

    return () => {
      active = false;
    };
  }, [orderId, status]);

  return (
    <div className="pt-24">
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
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
            {loading ? (
              <p className="text-sm text-text-muted">Cargando detalles del pedido...</p>
            ) : error ? (
              <div className="space-y-3">
                <p className="text-sm text-text-secondary">{error}</p>
                <Link
                  href="/portal/compras"
                  className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
                >
                  Ver mis compras
                </Link>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-medium text-text-primary mb-2">
                    Resumen de compra
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Fecha: {order?.createdAt}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Total pagado: {order?.total}
                  </p>
                </div>

                {order?.hasDigitalItems && (
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
                          Tus descargas ya estan disponibles
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {items
                        .filter((item) => item.type === "digital")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-background rounded-xl p-4"
                          >
                            <div>
                              <p className="text-sm font-medium text-text-primary">
                                {item.name}
                              </p>
                              <p className="text-xs text-text-muted">
                                {item.quantity} x {item.price}
                              </p>
                            </div>
                            {item.downloadUrl ? (
                              <a
                                href={item.downloadUrl}
                                className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
                              >
                                Descargar
                              </a>
                            ) : (
                              <span className="text-xs text-text-muted">
                                Disponible en portal
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {order?.hasPhysicalItems && (
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
                          Enviaremos tu pedido a la direccion registrada
                        </p>
                      </div>
                    </div>
                    {order.shippingAddress && (
                      <p className="text-sm text-text-muted">
                        {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} {order.shippingAddress.zip}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={0.4}>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/tienda"
              className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-dark transition-colors duration-300"
            >
              Volver a la tienda
            </Link>
            <Link
              href="/portal/compras"
              className="inline-block bg-background text-text-primary px-8 py-4 rounded-xl font-medium hover:bg-secondary transition-colors duration-300"
            >
              Ver mis compras
            </Link>
          </div>
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
