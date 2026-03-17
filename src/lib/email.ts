// ---------------------------------------------------------------------------
// Transactional email utility — uses Resend REST API
// ---------------------------------------------------------------------------

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL =
  process.env.FROM_EMAIL ||
  process.env.RESEND_FROM_EMAIL ||
  "Vital Emocion <noreply@vitalemocion.com>";
const SITE_URL = process.env.NEXTAUTH_URL || "https://vitalemocion.com";

// ---------------------------------------------------------------------------
// Brand constants (inline CSS — email-safe)
// ---------------------------------------------------------------------------

const COLORS = {
  primary: "#7C9A8E",
  primaryDark: "#5B7A6E",
  secondary: "#E8DDD3",
  accent: "#C4916E",
  background: "#FAF8F5",
  surface: "#F2EDE8",
  text: "#1f2937",
  textMuted: "#6b7280",
} as const;

// ---------------------------------------------------------------------------
// Generic email sender
// ---------------------------------------------------------------------------

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn(
      `[Email] RESEND_API_KEY no configurada. Correo no enviado a ${to}: "${subject}"`
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[Email] Resend error (${response.status}): ${errorText}`);
  }
}

// ---------------------------------------------------------------------------
// HTML wrapper with brand styling
// ---------------------------------------------------------------------------

function wrapHtml(bodyContent: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vital Emocion</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.background};font-family:'DM Sans',Helvetica,Arial,sans-serif;color:${COLORS.text};line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.background};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:${COLORS.primaryDark};padding:24px 32px;text-align:center;">
              <h1 style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:24px;color:#ffffff;letter-spacing:0.5px;">
                Vital Emocion
              </h1>
              <p style="margin:4px 0 0;font-size:12px;color:${COLORS.secondary};letter-spacing:1px;text-transform:uppercase;">
                Bienestar Psicologico
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:${COLORS.surface};padding:20px 32px;text-align:center;border-top:1px solid ${COLORS.secondary};">
              <p style="margin:0;font-size:13px;color:${COLORS.textMuted};">
                Vital Emocion &mdash; Bienestar Psicologico, Bogota, Colombia
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:${COLORS.textMuted};">
                <a href="${SITE_URL}" style="color:${COLORS.primaryDark};text-decoration:underline;">vitalemocion.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ---------------------------------------------------------------------------
// Reusable styled button
// ---------------------------------------------------------------------------

function styledButton(href: string, label: string): string {
  return `
<a href="${href}" style="display:inline-block;padding:12px 24px;background-color:${COLORS.primaryDark};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
  ${label}
</a>`.trim();
}

// ---------------------------------------------------------------------------
// Template: Welcome Email
// ---------------------------------------------------------------------------

interface WelcomeEmailData {
  to: string;
  name: string;
}

export async function sendWelcomeEmail({ to, name }: WelcomeEmailData): Promise<void> {
  const firstName = name.split(" ")[0] || name;

  const html = wrapHtml(`
    <h2 style="margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-size:22px;color:${COLORS.primaryDark};">
      ¡Bienvenido/a, ${firstName}!
    </h2>
    <p style="margin:0 0 12px;font-size:15px;">
      Nos alegra que formes parte de <strong>Vital Emocion</strong>. Estamos aqui para acompanarte en tu camino hacia el bienestar emocional.
    </p>
    <p style="margin:0 0 24px;font-size:15px;">
      Desde tu cuenta puedes:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:12px 16px;background-color:${COLORS.surface};border-radius:8px;margin-bottom:8px;">
          <strong style="color:${COLORS.primaryDark};">Agendar una cita</strong><br/>
          <span style="font-size:14px;color:${COLORS.textMuted};">Escoge el servicio y horario que mejor se adapte a ti.</span><br/>
          <a href="${SITE_URL}/agendar" style="color:${COLORS.accent};font-size:14px;text-decoration:underline;">Agendar ahora &rarr;</a>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px 16px;background-color:${COLORS.surface};border-radius:8px;">
          <strong style="color:${COLORS.primaryDark};">Visitar la tienda</strong><br/>
          <span style="font-size:14px;color:${COLORS.textMuted};">Recursos y herramientas para tu crecimiento personal.</span><br/>
          <a href="${SITE_URL}/tienda" style="color:${COLORS.accent};font-size:14px;text-decoration:underline;">Ir a la tienda &rarr;</a>
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:12px 16px;background-color:${COLORS.surface};border-radius:8px;">
          <strong style="color:${COLORS.primaryDark};">Tu portal</strong><br/>
          <span style="font-size:14px;color:${COLORS.textMuted};">Consulta tus citas, compras y perfil en un solo lugar.</span><br/>
          <a href="${SITE_URL}/portal" style="color:${COLORS.accent};font-size:14px;text-decoration:underline;">Ir al portal &rarr;</a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:15px;">
      Si tienes alguna pregunta, no dudes en <a href="${SITE_URL}/contacto" style="color:${COLORS.accent};text-decoration:underline;">contactarnos</a>.
    </p>
  `);

  await sendEmail({
    to,
    subject: "¡Bienvenido/a a Vital Emocion!",
    html,
  });
}

// ---------------------------------------------------------------------------
// Template: Appointment Confirmation
// ---------------------------------------------------------------------------

interface AppointmentConfirmationData {
  to: string;
  patientName: string;
  service: string;
  psychologist: string;
  date: string;
  time: string;
}

export async function sendAppointmentConfirmation({
  to,
  patientName,
  service,
  psychologist,
  date,
  time,
}: AppointmentConfirmationData): Promise<void> {
  const firstName = patientName.split(" ")[0] || patientName;

  const html = wrapHtml(`
    <h2 style="margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-size:22px;color:${COLORS.primaryDark};">
      ¡Tu cita esta confirmada!
    </h2>
    <p style="margin:0 0 20px;font-size:15px;">
      Hola <strong>${firstName}</strong>, tu cita ha sido agendada exitosamente. Aqui estan los detalles:
    </p>

    <!-- Appointment card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.surface};border-radius:10px;border-left:4px solid ${COLORS.primaryDark};margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:10px;">
                <span style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.textMuted};">Servicio</span><br/>
                <strong style="font-size:16px;color:${COLORS.text};">${service}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:10px;">
                <span style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.textMuted};">Profesional</span><br/>
                <strong style="font-size:16px;color:${COLORS.text};">${psychologist}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:10px;">
                <span style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.textMuted};">Fecha</span><br/>
                <strong style="font-size:16px;color:${COLORS.text};">${date}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <span style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.textMuted};">Hora</span><br/>
                <strong style="font-size:16px;color:${COLORS.text};">${time}</strong>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 20px;font-size:15px;">
      Puedes ver o cancelar tu cita desde tu portal:
    </p>
    <p style="margin:0 0 16px;text-align:center;">
      ${styledButton(`${SITE_URL}/portal/citas`, "Ver mis citas")}
    </p>
    <p style="margin:0;font-size:13px;color:${COLORS.textMuted};">
      Si necesitas reprogramar, por favor contactanos con al menos 24 horas de anticipacion.
    </p>
  `);

  await sendEmail({
    to,
    subject: `Cita confirmada: ${service}`,
    html,
  });
}

// ---------------------------------------------------------------------------
// Template: Order Confirmation
// ---------------------------------------------------------------------------

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationData {
  to: string;
  patientName: string;
  orderId: string;
  items: OrderItem[];
  total: number;
}

export async function sendOrderConfirmation({
  to,
  patientName,
  orderId,
  items,
  total,
}: OrderConfirmationData): Promise<void> {
  const firstName = patientName.split(" ")[0] || patientName;

  const formatCOP = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const itemsRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid ${COLORS.secondary};font-size:14px;">
          ${item.name}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid ${COLORS.secondary};font-size:14px;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid ${COLORS.secondary};font-size:14px;text-align:right;">
          ${formatCOP(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const html = wrapHtml(`
    <h2 style="margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-size:22px;color:${COLORS.primaryDark};">
      ¡Pedido confirmado!
    </h2>
    <p style="margin:0 0 8px;font-size:15px;">
      Hola <strong>${firstName}</strong>, hemos recibido tu pago. Aqui esta el resumen de tu pedido:
    </p>
    <p style="margin:0 0 20px;font-size:13px;color:${COLORS.textMuted};">
      Pedido <strong>#${orderId.slice(-8).toUpperCase()}</strong>
    </p>

    <!-- Items table -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLORS.secondary};border-radius:8px;overflow:hidden;margin-bottom:16px;">
      <thead>
        <tr style="background-color:${COLORS.surface};">
          <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.textMuted};">Producto</th>
          <th style="padding:10px 12px;text-align:center;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.textMuted};">Cant.</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.textMuted};">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
      <tfoot>
        <tr style="background-color:${COLORS.surface};">
          <td colspan="2" style="padding:12px;font-size:15px;font-weight:700;text-align:right;">Total</td>
          <td style="padding:12px;font-size:15px;font-weight:700;text-align:right;color:${COLORS.primaryDark};">${formatCOP(total)}</td>
        </tr>
      </tfoot>
    </table>

    <p style="margin:0 0 20px;font-size:15px;">
      Puedes ver todos los detalles de tu compra en tu portal:
    </p>
    <p style="margin:0 0 16px;text-align:center;">
      ${styledButton(`${SITE_URL}/portal/compras`, "Ver mis compras")}
    </p>
    <p style="margin:0;font-size:13px;color:${COLORS.textMuted};">
      Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
    </p>
  `);

  await sendEmail({
    to,
    subject: `Pedido confirmado #${orderId.slice(-8).toUpperCase()}`,
    html,
  });
}
