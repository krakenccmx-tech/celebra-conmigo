import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const templates = await prisma.template.findMany({
    where: category ? { category } : {},
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(templates);
}
