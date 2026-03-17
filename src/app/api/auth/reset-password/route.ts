import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { consumePasswordResetToken } from "@/lib/password-reset";
import { handleRouteError, requireDatabase } from "@/lib/route";

export async function POST(request: NextRequest) {
  try {
    const prisma = requireDatabase();
    const body = (await request.json()) as {
      email?: string;
      token?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const token = body.token?.trim();
    const password = body.password;

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: "Faltan datos para restablecer la contrasena." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contrasena debe tener al menos 8 caracteres." },
        { status: 400 }
      );
    }

    const resetToken = await consumePasswordResetToken(prisma, email, token);

    if (!resetToken) {
      return NextResponse.json(
        { error: "El enlace de restablecimiento es invalido o expiro." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Tu contrasena fue actualizada correctamente.",
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo restablecer la contrasena.");
  }
}
