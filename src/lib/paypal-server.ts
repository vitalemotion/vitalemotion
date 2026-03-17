import { getCopPerUsdRate } from "./exchange-rate";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";
const PAYPAL_API_BASE_URL =
  process.env.PAYPAL_API_BASE_URL || "https://api-m.sandbox.paypal.com";

interface PayPalLink {
  href?: string;
  rel?: string;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links?: PayPalLink[];
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  payer?: {
    email_address?: string;
    payer_id?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
}

export function isPayPalConfigured() {
  return PAYPAL_CLIENT_ID.length > 0 && PAYPAL_CLIENT_SECRET.length > 0;
}

export async function convertCopToUsd(value: number) {
  const copPerUsdRate = await getCopPerUsdRate();
  return (value / copPerUsdRate).toFixed(2);
}

async function getPayPalAccessToken() {
  if (!isPayPalConfigured()) {
    throw new Error("PAYPAL_NOT_CONFIGURED");
  }

  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("PAYPAL_AUTH_FAILED");
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error("PAYPAL_AUTH_FAILED");
  }

  return data.access_token;
}

async function paypalRequest<T>(path: string, init: RequestInit) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `PAYPAL_REQUEST_FAILED:${response.status}:${errorText || "unknown"}`
    );
  }

  return (await response.json()) as T;
}

export async function createPayPalOrder(input: {
  localOrderId: string;
  totalCOP: number;
  itemCount: number;
}) {
  const amountUsd = await convertCopToUsd(input.totalCOP);
  const order = await paypalRequest<PayPalOrderResponse>("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.localOrderId,
          custom_id: input.localOrderId,
          description: `Vital Emocion - ${input.itemCount} producto(s)`,
          amount: {
            currency_code: "USD",
            value: amountUsd,
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    }),
  });

  return {
    id: order.id,
    status: order.status,
    approveUrl:
      order.links?.find((link) => link.rel === "approve")?.href || null,
  };
}

export async function capturePayPalOrder(paypalOrderId: string) {
  return paypalRequest<PayPalCaptureResponse>(
    `/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
    }
  );
}
