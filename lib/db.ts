import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
    // ĐÃ XÓA đoạn datasources gây lỗi ở đây
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma