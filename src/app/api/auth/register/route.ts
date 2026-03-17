import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { handleRouteError, requireDatabase } from "@/lib/route";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail } from "@/lib/sanitize";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success: withinLimit } = rateLimit(`register:${ip}`, {
      maxRequests: 5,
      windowMs: 60_000,
    });
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta de nuevo en un minuto." },
        { status: 429 }
      );
    }

    const prisma = requireDatabase();
    const body = await req.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "La contrasena debe tener al menos 8 caracteres." },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeEmail(email);

    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: "El formato de email no es valido." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        passwordHash,
        role: "PATIENT",
        patient: {
          create: {},
        },
      },
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ to: sanitizedEmail, name: sanitizedName }).catch(() => {});

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "No se pudo completar el registro.");
  }
}
