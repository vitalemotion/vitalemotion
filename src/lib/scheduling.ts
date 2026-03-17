import {
  getAvailableSlots,
  isCalcomMockEnabled,
  TimeSlot,
} from "./calcom";
import {
  IntegrationError,
  isMockSchedulingDataEnabled,
} from "./integrations";

// ---------------------------------------------------------------------------
// Mock data — available only when explicitly enabled for local preview
// ---------------------------------------------------------------------------

interface MockPsychologist {
  id: string;
  name: string;
  specialties: string[];
  photoUrl: string | null;
  bio: string;
  calcomUserId: string;
}

interface MockService {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

const MOCK_PSYCHOLOGISTS: MockPsychologist[] = [
  {
    id: "psy-1",
    name: "Dra. Laura Martinez",
    specialties: ["Terapia Individual", "Terapia de Pareja", "Coaching de Vida"],
    photoUrl: null,
    bio: "Psicologa clinica con 10 anos de experiencia en terapia cognitivo-conductual.",
    calcomUserId: "mock-user-1",
  },
  {
    id: "psy-2",
    name: "Dr. Carlos Mendez",
    specialties: ["Evaluacion Psicologica", "Terapia Infantil", "Terapia Individual"],
    photoUrl: null,
    bio: "Especialista en evaluacion neuropsicologica y desarrollo infantil.",
    calcomUserId: "mock-user-2",
  },
  {
    id: "psy-3",
    name: "Dra. Ana Sofia Reyes",
    specialties: ["Talleres de Mindfulness", "Coaching de Vida", "Terapia de Pareja"],
    photoUrl: null,
    bio: "Experta en mindfulness y bienestar emocional con enfoque humanista.",
    calcomUserId: "mock-user-3",
  },
];

const MOCK_SERVICES: MockService[] = [
  {
    id: "svc-1",
    name: "Terapia Individual",
    duration: 50,
    price: 80000,
    description:
      "Sesiones de 50 minutos enfocadas en tus necesidades personales.",
  },
  {
    id: "svc-2",
    name: "Terapia de Pareja",
    duration: 90,
    price: 120000,
    description:
      "Mejora la comunicacion y fortalece tu relacion. Sesiones de 90 minutos.",
  },
  {
    id: "svc-3",
    name: "Evaluacion Psicologica",
    duration: 120,
    price: 150000,
    description:
      "Evaluacion integral con pruebas estandarizadas para un diagnostico preciso.",
  },
  {
    id: "svc-4",
    name: "Talleres de Mindfulness",
    duration: 60,
    price: 40000,
    description:
      "Grupos reducidos para aprender tecnicas de mindfulness y reduccion de estres.",
  },
  {
    id: "svc-5",
    name: "Terapia Infantil",
    duration: 45,
    price: 70000,
    description:
      "Intervencion especializada para ninos y adolescentes con enfoque ludico.",
  },
  {
    id: "svc-6",
    name: "Coaching de Vida",
    duration: 50,
    price: 90000,
    description:
      "Acompanamiento profesional para alcanzar tus metas personales y profesionales.",
  },
];

// Weekly appointment counts for mock mode (simulate varying load)
const MOCK_APPOINTMENT_COUNTS: Record<string, number> = {
  "psy-1": 8,
  "psy-2": 5,
  "psy-3": 12,
};

// ---------------------------------------------------------------------------
// DB helpers
// ---------------------------------------------------------------------------

async function getPrisma() {
  try {
    const { prisma } = await import("./db");
    // Test connection by running a lightweight query
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch {
    return null;
  }
}

function getLoadWindow(dateRange: { from: string; to: string }) {
  const baseDate = new Date(dateRange.from);
  const windowStart = new Date(baseDate);
  windowStart.setHours(0, 0, 0, 0);

  const windowEnd = new Date(windowStart);
  windowEnd.setDate(windowEnd.getDate() + 7);
  windowEnd.setMilliseconds(windowEnd.getMilliseconds() - 1);

  return { windowStart, windowEnd };
}

function assertMockSchedulingDataEnabled() {
  if (!isMockSchedulingDataEnabled()) {
    throw new IntegrationError(
      "SCHEDULING_DATA_UNAVAILABLE",
      "La agenda no esta disponible porque los datos de programacion no responden."
    );
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface AssignedPsychologist {
  id: string;
  name: string;
  specialties: string[];
  photoUrl: string | null;
  bio: string;
  calcomUserId: string;
  weeklyAppointments: number;
}

export interface SchedulingService {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

/**
 * Intelligent psychologist assignment: picks the least-busy psychologist
 * whose specialties match the requested service.
 */
export async function getIntelligentAssignment(
  serviceId: string,
  dateRange: { from: string; to: string }
): Promise<AssignedPsychologist | null> {
  const prisma = await getPrisma();
  const { windowStart, windowEnd } = getLoadWindow(dateRange);

  if (prisma) {
    try {
      // Find the service
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: { psychologists: { where: { isActive: true }, include: { user: true } } },
      });

      if (!service || service.psychologists.length === 0) {
        // Fall back to any active psychologist
        const anyPsychologist = await prisma.psychologist.findFirst({
          where: { isActive: true },
          include: { user: true },
        });
        if (!anyPsychologist) return null;

        const count = await prisma.appointment.count({
          where: {
            psychologistId: anyPsychologist.id,
            startTime: { gte: windowStart, lte: windowEnd },
            status: { in: ["PENDING", "CONFIRMED"] },
          },
        });

        return {
          id: anyPsychologist.id,
          name: anyPsychologist.user.name || "Psicologo",
          specialties: anyPsychologist.specialties,
          photoUrl: anyPsychologist.photoUrl,
          bio: anyPsychologist.bio || "",
          calcomUserId: anyPsychologist.calcomUserId || "",
          weeklyAppointments: count,
        };
      }

      // Count appointments for each matching psychologist in the date range
      const psychologistsWithLoad = await Promise.all(
        service.psychologists.map(async (psy) => {
          const count = await prisma.appointment.count({
            where: {
              psychologistId: psy.id,
              startTime: { gte: windowStart, lte: windowEnd },
              status: { in: ["PENDING", "CONFIRMED"] },
            },
          });
          return {
            id: psy.id,
            name: psy.user.name || "Psicologo",
            specialties: psy.specialties,
            photoUrl: psy.photoUrl,
            bio: psy.bio || "",
            calcomUserId: psy.calcomUserId || "",
            weeklyAppointments: count,
          };
        })
      );

      // Return the least busy
      psychologistsWithLoad.sort(
        (a, b) => a.weeklyAppointments - b.weeklyAppointments
      );
      return psychologistsWithLoad[0] || null;
    } catch (error) {
      console.error("[Scheduling] DB query failed:", error);
      assertMockSchedulingDataEnabled();
    }
  }

  assertMockSchedulingDataEnabled();
  return getIntelligentAssignmentMock(serviceId);
}

function getIntelligentAssignmentMock(
  serviceId: string
): AssignedPsychologist | null {
  const service = MOCK_SERVICES.find((s) => s.id === serviceId);
  if (!service) return MOCK_PSYCHOLOGISTS[0] ? toAssigned(MOCK_PSYCHOLOGISTS[0]) : null;

  // Find psychologists matching service name in specialties
  const matching = MOCK_PSYCHOLOGISTS.filter((p) =>
    p.specialties.includes(service.name)
  );

  const pool = matching.length > 0 ? matching : MOCK_PSYCHOLOGISTS;

  // Sort by fewest appointments
  const sorted = [...pool].sort(
    (a, b) =>
      (MOCK_APPOINTMENT_COUNTS[a.id] || 0) -
      (MOCK_APPOINTMENT_COUNTS[b.id] || 0)
  );

  return toAssigned(sorted[0]);
}

function toAssigned(p: MockPsychologist): AssignedPsychologist {
  return {
    ...p,
    weeklyAppointments: MOCK_APPOINTMENT_COUNTS[p.id] || 0,
  };
}

/**
 * Get all available services
 */
export async function getServices(): Promise<SchedulingService[]> {
  const prisma = await getPrisma();

  if (prisma) {
    try {
      const services = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      });
      return services.map((s) => ({
        id: s.id,
        name: s.name,
        duration: s.duration,
        price: s.price,
        description: s.description,
      }));
    } catch (error) {
      console.error("[Scheduling] Failed to fetch services from DB:", error);
      assertMockSchedulingDataEnabled();
    }
  }

  assertMockSchedulingDataEnabled();
  return MOCK_SERVICES;
}

/**
 * Get psychologists for a given service
 */
export async function getPsychologistsForService(
  serviceId: string
): Promise<AssignedPsychologist[]> {
  const prisma = await getPrisma();

  if (prisma) {
    try {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          psychologists: { where: { isActive: true }, include: { user: true } },
        },
      });

      if (service && service.psychologists.length > 0) {
        return service.psychologists.map((psy) => ({
          id: psy.id,
          name: psy.user.name || "Psicologo",
          specialties: psy.specialties,
          photoUrl: psy.photoUrl,
          bio: psy.bio || "",
          calcomUserId: psy.calcomUserId || "",
          weeklyAppointments: 0,
        }));
      }
    } catch (error) {
      console.error("[Scheduling] Failed to fetch psychologists from DB:", error);
      assertMockSchedulingDataEnabled();
    }
  }

  assertMockSchedulingDataEnabled();
  const service = MOCK_SERVICES.find((s) => s.id === serviceId);
  if (!service) return MOCK_PSYCHOLOGISTS.map(toAssigned);

  const matching = MOCK_PSYCHOLOGISTS.filter((p) =>
    p.specialties.includes(service.name)
  );
  return (matching.length > 0 ? matching : MOCK_PSYCHOLOGISTS).map(toAssigned);
}

/**
 * Get available time slots for a psychologist on a given date
 */
export async function getAvailableSlotsForDate(
  psychologistId: string,
  date: string,
  duration: number = 60
): Promise<TimeSlot[]> {
  // Try to get the psychologist's calcomUserId from DB
  const prisma = await getPrisma();
  let calcomUserId: string | null = null;

  if (prisma) {
    try {
      const psy = await prisma.psychologist.findUnique({
        where: { id: psychologistId },
      });
      if (psy?.calcomUserId) {
        calcomUserId = psy.calcomUserId;
      }
    } catch {
      assertMockSchedulingDataEnabled();
      if (isCalcomMockEnabled()) {
        const mockPsy = MOCK_PSYCHOLOGISTS.find((p) => p.id === psychologistId);
        if (mockPsy) calcomUserId = mockPsy.calcomUserId;
      }
    }
  } else {
    assertMockSchedulingDataEnabled();
  }

  if (isCalcomMockEnabled() && !calcomUserId) {
    const mockPsy = MOCK_PSYCHOLOGISTS.find((p) => p.id === psychologistId);
    if (mockPsy) calcomUserId = mockPsy.calcomUserId;
  }

  if (!calcomUserId) {
    throw new IntegrationError(
      "CALCOM_USER_NOT_CONFIGURED",
      "El profesional seleccionado no tiene una agenda externa configurada."
    );
  }

  return getAvailableSlots(calcomUserId, date, date, duration);
}

export { MOCK_SERVICES, MOCK_PSYCHOLOGISTS };
