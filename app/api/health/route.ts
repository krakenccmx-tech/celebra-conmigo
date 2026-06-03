import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const info: any = {
    hasDbUrl: !!dbUrl,
    dbUrlPrefix: dbUrl ? dbUrl.substring(0, 30) + '...' : 'MISSING',
  };

  try {
    const prisma = new PrismaClient();
    const count = await prisma.event.count();
    info.connected = true;
    info.eventCount = count;
    await prisma.$disconnect();
  } catch (err: any) {
    info.connected = false;
    info.error = err.message;
  }

  return NextResponse.json(info);
}
