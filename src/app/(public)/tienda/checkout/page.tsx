"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AnimatedSection from "@/components/animations/AnimatedSection";
import PayPalCheckout from "@/components/store/PayPalCheckout";
import { useCartStore } from "@/stores/cart";

function formatCOP(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}

interface ProfileResponse {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    items,
    subtotal,
    hasPhysicalItems,
    shippingCost,
    total,
    clearCart,
    itemCount,
  } = useCartStore();

  const [shippingForm, setShippingForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || session.user.role !== "PATIENT") {
      return;
    }

    let active = true;

    async function loadProfile() {
      setProfileLoading(true);

      try {
        const response = await fetch("/api/portal/profile");

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as ProfileResponse;

        if (!active) {
          return;
        }

        setShippingForm((prev) => ({
          name: prev.name || data.name || session?.user?.name || "",
          address: prev.address || data.address || "",
          city: prev.city || data.city || "",
          state: prev.state || data.state || "",
          zip: prev.zip || data.postalCode || "",
          phone: prev.phone || data.phone || "",
        }));
      } finally {
        if (active) {
          setProfileLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [session?.user?.name, session?.user?.role, status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePayPalSuccess = (orderData: { orderId: string }) => {
    clearCart();
    router.push(`/tienda/confirmacion?order=${orderData.orderId}`);
  };

  const isShippingComplete =
    !hasPhysicalItems() ||
    Boolean(
      shippingForm.name &&
        shippingForm.address &&
        shippingForm.city &&
        shippingForm.state &&
        shippingForm.zip &&
        shippingForm.phone
    );

  const canCheckout =
    status === "authenticated" &&
    session.user.role === "PATIENT" &&
    isShippingComplete;

  if (itemCount() === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center pt-36">
        <AnimatedSection animation="fade-up">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted mx-auto mb-4"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h1 className="font-serif text-3xl text-text-primary mb-4">
            Tu carrito esta vacio
          </h1>
          <p className="text-text-secondary mb-6">
            Agrega productos a tu carrito antes de continuar con el pago.
          </p>
          <Link
            href="/tienda"
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors duration-300"
          >
            Ir a la tienda
          </Link>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="max-w-6xl mx-auto py-12 px-6">
        <AnimatedSection animation="fade-up">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-1 text-primary hover:text-primary-dark transition-colors duration-300 mb-8"
          >
            &larr; Volver a la tienda
          </Link>

          <h1 className="font-serif text-4xl text-text-primary mb-8">
            Finalizar compra
          </h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <div className="bg-surface rounded-2xl p-6">
              <h2 className="font-serif text-xl text-text-primary mb-6">
                Resumen del pedido
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: item.image }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        Cant: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-text-primary">
                      {formatCOP(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-background pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary font-medium">
                    {formatCOP(subtotal())}
                  </span>
                </div>
                {hasPhysicalItems() && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Envio</span>
                    <span className="text-text-primary font-medium">
                      {formatCOP(shippingCost())}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base pt-2 border-t border-background">
                  <span className="font-medium text-text-primary">Total</span>
                  <span className="font-bold text-text-primary text-lg">
                    {formatCOP(total())}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <div className="space-y-8">
              {hasPhysicalItems() && (
                <div className="bg-surface rounded-2xl p-6">
                  <h2 className="font-serif text-xl text-text-primary mb-6">
                    Datos de envio
                  </h2>
                  {profileLoading && (
                    <p className="text-sm text-text-muted mb-4">
                      Cargando tus datos guardados...
                    </p>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-text-secondary mb-1"
                      >
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={shippingForm.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-surface focus:border-primary focus:outline-none text-text-primary transition-colors"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-text-secondary mb-1"
                      >
                        Direccion
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingForm.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-surface focus:border-primary focus:outline-none text-text-primary transition-colors"
                        placeholder="Calle, numero, apto"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-text-secondary mb-1"
                        >
                          Ciudad
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingForm.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-surface focus:border-primary focus:outline-none text-text-primary transition-colors"
                          placeholder="Ciudad"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-text-secondary mb-1"
                        >
                          Departamento
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={shippingForm.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-surface focus:border-primary focus:outline-none text-text-primary transition-colors"
                          placeholder="Departamento"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="zip"
                          className="block text-sm font-medium text-text-secondary mb-1"
                        >
                          Codigo postal
                        </label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={shippingForm.zip}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-surface focus:border-primary focus:outline-none text-text-primary transition-colors"
                          placeholder="000000"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-text-secondary mb-1"
                        >
                          Telefono
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={shippingForm.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-surface focus:border-primary focus:outline-none text-text-primary transition-colors"
                          placeholder="+57 300 000 0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-surface rounded-2xl p-6">
                <h2 className="font-serif text-xl text-text-primary mb-6">
                  Metodo de pago
                </h2>
                {status === "loading" ? (
                  <p className="text-sm text-text-secondary">
                    Verificando tu sesion...
                  </p>
                ) : status !== "authenticated" ? (
                  <div className="space-y-4">
                    <p className="text-sm text-text-secondary">
                      Debes iniciar sesion como paciente para completar la compra
                      y guardar tu pedido en el portal.
                    </p>
                    <Link
                      href="/login?callbackUrl=%2Ftienda%2Fcheckout"
                      className="inline-flex bg-primary text-white px-5 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
                    >
                      Iniciar sesion
                    </Link>
                  </div>
                ) : session.user.role !== "PATIENT" ? (
                  <p className="text-sm text-text-secondary">
                    El checkout solo esta disponible para cuentas de paciente.
                    Usa una cuenta de paciente para registrar el pedido en el
                    portal.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {hasPhysicalItems() && !isShippingComplete && (
                      <div className="rounded-xl border border-accent/20 bg-accent/10 p-4 text-sm text-accent">
                        Completa todos los datos de envio antes de continuar con
                        PayPal.
                      </div>
                    )}
                    <PayPalCheckout
                      total={total()}
                      items={items}
                      shippingForm={shippingForm}
                      disabled={!canCheckout}
                      onSuccess={handlePayPalSuccess}
                    />
                    <p className="text-xs text-text-muted">
                      El monto se valida en el servidor y el pedido queda
                      guardado automaticamente en tu portal.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
