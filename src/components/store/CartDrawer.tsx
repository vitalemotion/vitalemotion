"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart";

function formatCOP(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    hasPhysicalItems,
    shippingCost,
    total,
  } = useCartStore();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl text-text-primary">Tu Carrito</h2>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {itemCount()} {itemCount() === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-colors duration-300"
            aria-label="Cerrar carrito"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-muted mb-4"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p className="text-text-secondary font-medium mb-2">
              Tu carrito esta vacio
            </p>
            <p className="text-text-muted text-sm mb-6">
              Explora nuestra tienda y encuentra algo especial
            </p>
            <Link
              href="/tienda"
              onClick={closeCart}
              className="text-primary font-medium hover:text-primary-dark transition-colors duration-300"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-surface/50 rounded-xl"
                >
                  <div
                    className="w-16 h-16 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: item.image }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-text-primary truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-accent font-semibold">
                      {formatCOP(item.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-text-primary w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-surface px-6 py-4 space-y-3">
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
              <div className="flex justify-between text-base pt-2 border-t border-surface">
                <span className="font-medium text-text-primary">Total</span>
                <span className="font-bold text-text-primary">
                  {formatCOP(total())}
                </span>
              </div>

              <Link
                href="/tienda/checkout"
                onClick={closeCart}
                className="block w-full bg-accent text-white text-center rounded-xl py-4 font-medium hover:bg-accent/90 transition-colors duration-300"
              >
                Ir a pagar
              </Link>
              <button
                onClick={closeCart}
                className="w-full text-center text-primary font-medium py-2 hover:text-primary-dark transition-colors duration-300"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
