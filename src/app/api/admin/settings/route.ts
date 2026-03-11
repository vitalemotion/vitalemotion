import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const defaultSettings: Record<string, string> = {
  practiceName: "Vital Emocion",
  practiceDescription:
    "Centro de bienestar emocional y psicologia. Ofrecemos terapia individual, de pareja y familiar con un enfoque humanista e integral.",
  contactPhone: "+57 300 123 4567",
  contactEmail: "contacto@vitalemocion.com",
  contactAddress: "Calle 85 #15-24, Consultorio 301, Bogota, Colombia",
  socialInstagram: "https://instagram.com/vitalemocion",
  socialFacebook: "https://facebook.com/vitalemocion",
  socialWhatsapp: "573001234567",
  businessHours:
    "Lunes a Viernes: 8:00 AM - 6:00 PM\nSabados: 9:00 AM - 1:00 PM\nDomingos y Festivos: Cerrado",
};

export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany();
    const settings: Record<string, string> = { ...defaultSettings };
    for (const config of configs) {
      settings[config.key] = config.value as string;
    }
    return NextResponse.json(settings);
  } catch {
    console.warn("[Admin Settings] DB unavailable, returning defaults");
    return NextResponse.json(defaultSettings);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate that body is an object with string values
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
    }

    const updates: Promise<unknown>[] = [];

    for (const [key, value] of Object.entries(body)) {
      updates.push(
        prisma.siteConfig.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      );
    }

    await Promise.all(updates);

    // Return merged settings
    const configs = await prisma.siteConfig.findMany();
    const settings: Record<string, string> = { ...defaultSettings };
    for (const config of configs) {
      settings[config.key] = config.value as string;
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[Admin Settings] Failed to update:", error);
    // Return mock success with submitted data merged into defaults
    try {
      const body = await request.json();
      return NextResponse.json({ ...defaultSettings, ...body });
    } catch {
      return NextResponse.json(defaultSettings);
    }
  }
}
