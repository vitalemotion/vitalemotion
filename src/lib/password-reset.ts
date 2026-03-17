import { createHash, randomBytes } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

const RESET_PASSWORD_TOKEN_TTL_MS = 1000 * 60 * 60;
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESET_PASSWORD_FROM_EMAIL =
  process.env.RESET_PASSWORD_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createPasswordResetUrl(origin: string, email: string, token: string) {
  const url = new URL("/reset-password", origin);
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);
  return url.toString();
}

export async function createPasswordResetToken(
  prisma: PrismaClient,
  email: string
) {
  const token = randomBytes(32).toString("hex");
  const hashedToken = hashToken(token);
  const expires = new Date(Date.now() + RESET_PASSWORD_TOKEN_TTL_MS);

  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashedToken,
      expires,
    },
  });

  return token;
}

export async function consumePasswordResetToken(
  prisma: PrismaClient,
  email: string,
  token: string
) {
  const hashedToken = hashToken(token);
  const resetToken = await prisma.verificationToken.findUnique({
    where: { token: hashedToken },
  });

  if (!resetToken || resetToken.identifier !== email) {
    return false;
  }

  if (resetToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token: hashedToken },
    });
    return false;
  }

  await prisma.verificationToken.delete({
    where: { token: hashedToken },
  });

  return true;
}

async function sendWithResend(email: string, resetUrl: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESET_PASSWORD_FROM_EMAIL,
      to: [email],
      subject: "Restablece tu contrasena en Vital Emocion",
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
          <h1 style="font-size: 20px; margin-bottom: 16px;">Restablece tu contrasena</h1>
          <p>Recibimos una solicitud para cambiar la contrasena de tu cuenta.</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 18px; background: #6c8a6b; color: white; text-decoration: none; border-radius: 10px;">
              Crear nueva contrasena
            </a>
          </p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
          <p>Este enlace expira en 1 hora.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`No se pudo enviar el correo de recuperacion: ${errorText}`);
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (RESEND_API_KEY && RESET_PASSWORD_FROM_EMAIL) {
    await sendWithResend(email, resetUrl);
    return {
      delivered: true,
      previewUrl: null,
    };
  }

  console.warn(`[Auth] Password reset link for ${email}: ${resetUrl}`);

  return {
    delivered: false,
    previewUrl: process.env.NODE_ENV !== "production" ? resetUrl : null,
  };
}
