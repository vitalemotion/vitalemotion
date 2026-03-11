import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  try {
    if (!process.env.DATABASE_URL) return null;
    return new PrismaClient();
  } catch {
    return null;
  }
}

const client = globalForPrisma.prisma ?? createPrismaClient();
if (client && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = client;
}

export const prisma = client as PrismaClient;
