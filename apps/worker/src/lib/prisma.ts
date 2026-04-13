import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __workerPrisma__: PrismaClient | undefined;
}

export const prisma =
  global.__workerPrisma__ ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__workerPrisma__ = prisma;
}
