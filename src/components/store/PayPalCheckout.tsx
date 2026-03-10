"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID } from "@/lib/paypal";
import { CartItem } from "@/types/store";
import { useState } from "react";

interface PayPalCheckoutProps {
  total: number;
  items: CartItem[];
  onSuccess: (orderData: Record<string, unknown>) => void;
}

export default function PayPalCheckout({
  total,
  items,
  onSuccess,
}: PayPalCheckoutProps) {
  const [error, setError] = useState<string | null>(null);

  // Convert COP to USD approximation for PayPal (1 USD ~ 4000 COP)
  const totalUSD = (total / 4000).toFixed(2);

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
          {error}
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
          createOrder={(_data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: `Vital Emocion - ${items.length} producto(s)`,
                  amount: {
                    currency_code: "USD",
                    value: totalUSD,
                  },
                },
              ],
            });
          }}
          onApprove={async (_data, actions) => {
            if (actions.order) {
              const details = await actions.order.capture();
              onSuccess(details as unknown as Record<string, unknown>);
            }
          }}
          onError={(err) => {
            console.error("PayPal error:", err);
            setError(
              "Hubo un error al procesar el pago. Por favor intenta de nuevo."
            );
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
