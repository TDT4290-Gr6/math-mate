/**
 * Initializes and exports a singleton instance of `PrismaClient` for database access.
 *
 * This implementation ensures that only one instance of `PrismaClient` is created,
 * even during hot-reloading in development environments. In production, a new instance
 * is created per execution context.
 *
 * @remarks
 * - Uses a global variable to persist the Prisma client across module reloads in development.
 * - Prevents exhausting database connections due to multiple client instances.
 *
 * @example
 * ```typescript
 * import { prisma } from './prisma';
 * const users = await prisma.user.findMany();
 * ```
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
