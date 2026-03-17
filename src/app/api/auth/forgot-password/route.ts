import { NextRequest, NextResponse } from "next/server";
import {
  createPasswordResetToken,
  createPasswordResetUrl,
  sendPasswordResetEmail,
} from "@/lib/password-reset";
import { handleRouteError, requireDatabase } from "@/lib/route";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success: withinLimit } = rateLimit(`forgot-password:${ip}`, {
      maxRequests: 3,
      windowMs: 60_000,
    });
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta de nuevo en un minuto." },
        { status: 429 }
      );
    }

    const prisma = requireDatabase();
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Debes ingresar un email valido." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "Si existe una cuenta asociada a ese correo, enviaremos instrucciones para restablecer la contrasena.",
      });
    }

    const rawToken = await createPasswordResetToken(prisma, user.email);
    const origin = process.env.NEXTAUTH_URL || request.nextUrl.origin;
    const resetUrl = createPasswordResetUrl(origin, user.email, rawToken);
    const delivery = await sendPasswordResetEmail(user.email, resetUrl);

    return NextResponse.json({
      success: true,
      message:
        "Si existe una cuenta asociada a ese correo, enviaremos instrucciones para restablecer la contrasena.",
      previewUrl: delivery.previewUrl,
    });
  } catch (error) {
    return handleRouteError(
      error,
      "No se pudo iniciar la recuperacion de contrasena."
    );
  }
}
