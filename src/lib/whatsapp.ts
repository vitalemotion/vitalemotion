const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || "";

function isConfigured(): boolean {
  return (
    TWILIO_ACCOUNT_SID.length > 0 &&
    TWILIO_AUTH_TOKEN.length > 0 &&
    TWILIO_WHATSAPP_NUMBER.length > 0
  );
}

// ---------------------------------------------------------------------------
// Message templates
// ---------------------------------------------------------------------------

export const messageTemplates = {
  confirmation: (patientName: string, serviceName: string, dateTime: string) =>
    `Hola ${patientName}! Tu cita de *${serviceName}* ha sido confirmada para el *${dateTime}*. Te esperamos en Vital Emocion. Si necesitas reagendar, contactanos con anticipacion.`,

  reminder24h: (patientName: string, serviceName: string, dateTime: string) =>
    `Hola ${patientName}! Te recordamos que manana tienes tu cita de *${serviceName}* a las *${dateTime}*. Te esperamos en Vital Emocion.`,

  reminder1h: (patientName: string, serviceName: string, time: string) =>
    `Hola ${patientName}! En 1 hora tienes tu cita de *${serviceName}* a las *${time}*. Te esperamos en Vital Emocion.`,
};

// ---------------------------------------------------------------------------
// Send WhatsApp message via Twilio REST API (no SDK)
// ---------------------------------------------------------------------------

export async function sendWhatsAppReminder(
  phone: string,
  message: string
): Promise<{ success: boolean; messageId?: string }> {
  // Normalize phone number
  const normalizedPhone = normalizePhone(phone);

  if (!isConfigured()) {
    console.log(
      `[WhatsApp Mock] Would send to ${normalizedPhone}:`,
      message.substring(0, 80) + "..."
    );
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    const body = new URLSearchParams({
      From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      To: `whatsapp:${normalizedPhone}`,
      Body: message,
    });

    const auth = Buffer.from(
      `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
    ).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[WhatsApp] Twilio error:", response.status, errorData);
      return { success: false };
    }

    const data = await response.json();
    console.log("[WhatsApp] Message sent:", data.sid);
    return { success: true, messageId: data.sid };
  } catch (error) {
    console.error("[WhatsApp] Failed to send message:", error);
    return { success: false };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizePhone(phone: string): string {
  // Remove all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Ensure it starts with + for international format
  if (!cleaned.startsWith("+")) {
    // Assume Colombia country code if no prefix
    if (cleaned.startsWith("57")) {
      cleaned = "+" + cleaned;
    } else {
      cleaned = "+57" + cleaned;
    }
  }

  return cleaned;
}

export function formatDateTimeForMessage(date: Date): string {
  return date.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatTimeForMessage(date: Date): string {
  return date.toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
