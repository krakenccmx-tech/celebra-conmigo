import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Se requiere el slug.' }, { status: 400 });
  }

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      sections: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
      gifts: true,
      gallery: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: 'Evento no encontrado.' }, { status: 404 });
  }

  if (event.status !== 'published') {
    return NextResponse.json({ error: 'Evento no publicado.' }, { status: 403 });
  }

  return NextResponse.json(event);
}
