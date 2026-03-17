import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) return null;
    const adapter = new PrismaPg({ connectionString: url });
    return new PrismaClient({ adapter });
  } catch {
    return null;
  }
}

const client = globalForPrisma.prisma ?? createPrismaClient();
if (client && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = client;
}

export const prisma = client as PrismaClient;

export function getPrismaClient(): PrismaClient | null {
  return client;
}

export function getRequiredPrisma(): PrismaClient {
  if (!client) {
    throw new Error("DATABASE_UNAVAILABLE");
  }
  return client;
}
