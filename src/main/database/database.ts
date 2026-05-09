import { PrismaClient } from '../../__generated__/prisma';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

let prisma: PrismaClient;

export function getDatabasePath(): string {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'stadium.db');
}

function toFileUrl(filePath: string): string {
  return 'file:' + filePath.replace(/\\/g, '/').replace(/#/g, '%23').replace(/ /g, '%20');
}

export function getPrisma(): PrismaClient {
  if (!prisma) {
    const dbPath = getDatabasePath();
    process.env.DATABASE_URL = toFileUrl(dbPath);
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function initializeDatabase(): Promise<void> {
  const dbPath = getDatabasePath();
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    const sourceDb = path.join(__dirname, '../../prisma/stadium.db');
    if (fs.existsSync(sourceDb)) {
      fs.copyFileSync(sourceDb, dbPath);
    }
  }

  const db = getPrisma();

  const settingsCount = await db.stadiumSetting.count();
  if (settingsCount === 0) {
    await db.stadiumSetting.create({
      data: {
        name: 'City Football Stadium',
        openTime: '08:00',
        closeTime: '23:00',
        slotUnit: 60,
        phone: '+1-555-0100',
        address: '123 Stadium Avenue, Sports City',
      },
    });
  }
}

export async function closeDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}
