import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Membuat instansi Prisma Client baru atau menggunakan yang sudah ada di globalThis
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL ?? "",
    }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Menyimpan instansi ke globalThis jika tidak berada di lingkungan produksi (production)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
