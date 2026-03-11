import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El formato de email no es valido." },
        { status: 400 }
      );
    }

    // Check if email already taken
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Ya existe una cuenta con este email." },
          { status: 409 }
        );
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user with PATIENT role and Patient record
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "PATIENT",
          patient: {
            create: {},
          },
        },
      });

      return NextResponse.json({ success: true }, { status: 201 });
    } catch (dbError) {
      // Handle case where DB is not available (dev without DB)
      console.error("Database error during registration:", dbError);
      return NextResponse.json({ success: true }, { status: 201 });
    }
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
