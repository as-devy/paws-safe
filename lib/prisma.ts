import "server-only";

import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/** Bump when Prisma schema changes so the cached client is recreated in dev. */
const PRISMA_SCHEMA_VERSION = 8;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaVersion?: number;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

if (
  !globalForPrisma.prisma ||
  globalForPrisma.prismaSchemaVersion !== PRISMA_SCHEMA_VERSION
) {
  globalForPrisma.prisma = createPrismaClient();
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
}

export const prisma = globalForPrisma.prisma;
