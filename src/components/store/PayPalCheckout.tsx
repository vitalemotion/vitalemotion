"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID } from "@/lib/paypal";
import { CartItem } from "@/types/store";
import { useRef, useState } from "react";

interface ShippingFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

interface PayPalCheckoutProps {
  total: number;
  items: CartItem[];
  shippingForm: ShippingFormData;
  disabled?: boolean;
  onSuccess: (orderData: { orderId: string; captureId: string | null }) => void;
}

export default function PayPalCheckout({
  total,
  items,
  shippingForm,
  disabled = false,
  onSuccess,
}: PayPalCheckoutProps) {
  const [error, setError] = useState<string | null>(null);
  const pendingOrderIdRef = useRef<string | null>(null);

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
          {error}
        </div>
      )}

      {disabled && (
        <div className="p-4 bg-secondary border border-primary/10 rounded-xl text-text-secondary text-sm">
          Completa los datos requeridos antes de continuar con el pago.
        </div>
      )}

      <PayPalScriptProvider
        options={{
          clientId: PAYPAL_CLIENT_ID,
          currency: "USD",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            shape: "rect",
            label: "pay",
          }}
          disabled={disabled}
          forceReRender={[total, items.length, disabled]}
          createOrder={async () => {
            try {
              setError(null);

              const response = await fetch("/api/store/checkout/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: items.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                  })),
                  shipping: shippingForm,
                }),
              });

              const data = (await response.json()) as {
                error?: string;
                orderId?: string;
                paypalOrderId?: string;
              };

              if (!response.ok || !data.orderId || !data.paypalOrderId) {
                throw new Error(
                  data.error || "No se pudo preparar la orden en PayPal."
                );
              }

              pendingOrderIdRef.current = data.orderId;
              return data.paypalOrderId;
            } catch (cause) {
              const message =
                cause instanceof Error
                  ? cause.message
                  : "No se pudo preparar la orden en PayPal.";
              setError(message);
              throw cause;
            }
          }}
          onApprove={async (data) => {
            try {
              if (!pendingOrderIdRef.current) {
                throw new Error("No se encontro la orden local para confirmar.");
              }

              const response = await fetch("/api/store/checkout/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: pendingOrderIdRef.current,
                  paypalOrderId: data.orderID,
                }),
              });

              const result = (await response.json()) as {
                error?: string;
                orderId?: string;
                captureId?: string | null;
              };

              if (!response.ok || !result.orderId) {
                throw new Error(
                  result.error || "No se pudo confirmar el pago con PayPal."
                );
              }

              onSuccess({
                orderId: result.orderId,
                captureId: result.captureId || null,
              });
            } catch (cause) {
              const message =
                cause instanceof Error
                  ? cause.message
                  : "No se pudo confirmar el pago con PayPal.";
              setError(message);
              throw cause;
            }
          }}
          onError={(err) => {
            console.error("PayPal error:", err);
            setError(
              "Hubo un error al procesar el pago. Por favor intenta de nuevo."
            );
            pendingOrderIdRef.current = null;
          }}
          onCancel={() => {
            setError("El pago fue cancelado antes de completarse.");
            pendingOrderIdRef.current = null;
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
