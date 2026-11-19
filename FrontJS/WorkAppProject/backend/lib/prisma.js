// One shared PrismaClient for the whole process.
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import env from '../config/env.js';

const adapter = new PrismaBetterSqlite3({ url: env.DATABASE_URL });

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__prisma ||
  new PrismaClient({
    adapter,
    log: env.isDev ? ['warn', 'error'] : ['error'],
  });

// `node --watch` re-evaluates modules; reuse the client instead of stacking them.
if (env.isDev) globalForPrisma.__prisma = prisma;

export default prisma;
