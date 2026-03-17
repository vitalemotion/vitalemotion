import { NextRequest, NextResponse } from "next/server";
import {
  CALCOM_EVENT_TYPE_CONFIG_KEY,
  parseCalcomEventTypeMap,
  serializeCalcomEventTypeMap,
} from "@/lib/calcom-event-types";
import { handleRouteError, requireDatabase, requireRole } from "@/lib/route";

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
  calcomEventTypeIds: "{}",
};

const settingsDefinitions: Record<
  string,
  { dbKey: string; valueType: "string" | "json" }
> = {
  practiceName: { dbKey: "practice_name", valueType: "string" },
  practiceDescription: {
    dbKey: "practice_description",
    valueType: "string",
  },
  contactPhone: { dbKey: "phone", valueType: "string" },
  contactEmail: { dbKey: "email", valueType: "string" },
  contactAddress: { dbKey: "address", valueType: "string" },
  socialInstagram: { dbKey: "social_instagram", valueType: "string" },
  socialFacebook: { dbKey: "social_facebook", valueType: "string" },
  socialWhatsapp: { dbKey: "whatsapp_number", valueType: "string" },
  businessHours: { dbKey: "business_hours", valueType: "string" },
  calcomEventTypeIds: {
    dbKey: CALCOM_EVENT_TYPE_CONFIG_KEY,
    valueType: "json",
  },
};

const inverseSettingsKeyMap = Object.fromEntries(
  Object.entries(settingsDefinitions).map(([formKey, definition]) => [
    definition.dbKey,
    formKey,
  ])
);

function normalizeSettings(configs: { key: string; value: unknown }[]) {
  const settings: Record<string, string> = { ...defaultSettings };

  for (const config of configs) {
    const formKey = inverseSettingsKeyMap[config.key];
    const definition = formKey ? settingsDefinitions[formKey] : null;

    if (formKey && definition?.valueType === "string" && typeof config.value === "string") {
      settings[formKey] = config.value;
      continue;
    }

    if (formKey && definition?.valueType === "json") {
      settings[formKey] = serializeCalcomEventTypeMap(config.value);
      continue;
    }

    if (config.key === "social_media" && config.value && typeof config.value === "object") {
      const socialMedia = config.value as Record<string, unknown>;
      if (typeof socialMedia.instagram === "string") {
        settings.socialInstagram = socialMedia.instagram;
      }
      if (typeof socialMedia.facebook === "string") {
        settings.socialFacebook = socialMedia.facebook;
      }
    }
  }

  return settings;
}

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();
    const configs = await prisma.siteConfig.findMany();

    return NextResponse.json(normalizeSettings(configs));
  } catch (error) {
    return handleRouteError(error, "No se pudo cargar la configuracion.");
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();
    const body = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Datos invalidos." }, { status: 400 });
    }

    const updates = Object.entries(settingsDefinitions).map(([formKey, definition]) =>
      prisma.siteConfig.upsert({
        where: { key: definition.dbKey },
        update: {
          value:
            definition.valueType === "json"
              ? parseCalcomEventTypeMap(
                  body[formKey] ?? defaultSettings[formKey]
                )
              : String(body[formKey] ?? defaultSettings[formKey]),
        },
        create: {
          key: definition.dbKey,
          value:
            definition.valueType === "json"
              ? parseCalcomEventTypeMap(
                  body[formKey] ?? defaultSettings[formKey]
                )
              : String(body[formKey] ?? defaultSettings[formKey]),
        },
      })
    );

    await Promise.all(updates);

    const configs = await prisma.siteConfig.findMany();
    return NextResponse.json(normalizeSettings(configs));
  } catch (error) {
    return handleRouteError(error, "No se pudo actualizar la configuracion.");
  }
}
