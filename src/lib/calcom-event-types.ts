import type { PrismaClient } from "@prisma/client";

export const CALCOM_EVENT_TYPE_CONFIG_KEY = "calcom_event_type_ids";
const CALCOM_EVENT_TYPE_IDS_ENV = process.env.CALCOM_EVENT_TYPE_IDS || "";

export type CalcomEventTypeMap = Record<string, number>;

function normalizeEventTypeId(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (
    typeof value === "string" &&
    /^\d+$/.test(value) &&
    Number.isInteger(Number(value)) &&
    Number(value) > 0
  ) {
    return Number(value);
  }

  return null;
}

export function parseCalcomEventTypeMap(value: unknown): CalcomEventTypeMap {
  const rawValue =
    typeof value === "string" ? JSON.parse(value || "{}") : value ?? {};

  if (!rawValue || typeof rawValue !== "object" || Array.isArray(rawValue)) {
    throw new Error("El mapeo de event types debe ser un objeto JSON.");
  }

  const entries = Object.entries(rawValue as Record<string, unknown>);
  const result: CalcomEventTypeMap = {};

  for (const [serviceId, eventTypeId] of entries) {
    if (!serviceId.trim()) {
      throw new Error("Cada servicio debe tener una clave valida.");
    }

    const normalizedEventTypeId = normalizeEventTypeId(eventTypeId);

    if (!normalizedEventTypeId) {
      throw new Error(
        `El event type configurado para "${serviceId}" debe ser un entero positivo.`
      );
    }

    result[serviceId.trim()] = normalizedEventTypeId;
  }

  return result;
}

function stringifyCalcomEventTypeMap(value: unknown) {
  return JSON.stringify(parseCalcomEventTypeMap(value), null, 2);
}

function getEnvCalcomEventTypeMap() {
  if (!CALCOM_EVENT_TYPE_IDS_ENV.trim()) {
    return {};
  }

  return parseCalcomEventTypeMap(CALCOM_EVENT_TYPE_IDS_ENV);
}

export async function getCalcomEventTypeIdForService(
  prisma: PrismaClient,
  serviceId: string
) {
  const siteConfig = await prisma.siteConfig.findUnique({
    where: { key: CALCOM_EVENT_TYPE_CONFIG_KEY },
    select: { value: true },
  });

  if (siteConfig?.value) {
    const dbMap = parseCalcomEventTypeMap(siteConfig.value);
    if (dbMap[serviceId]) {
      return dbMap[serviceId];
    }
  }

  const envMap = getEnvCalcomEventTypeMap();
  return envMap[serviceId] || null;
}

export function serializeCalcomEventTypeMap(value: unknown) {
  return stringifyCalcomEventTypeMap(value);
}
