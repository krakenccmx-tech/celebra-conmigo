import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const events = await prisma.event.findMany({
    where: dbUser.role === 'superadmin' ? {} : { userId: dbUser.id },
    include: {
      _count: { select: { guests: true, rsvps: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const body = await request.json();
  const { title, type, date, time, city, slug } = body;

  if (!title || !type || !date || !time || !city || !slug) {
    return NextResponse.json(
      { error: 'Todos los campos son requeridos.' },
      { status: 400 }
    );
  }

  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: 'El slug ya está en uso. Elige otro.' },
      { status: 409 }
    );
  }

  const event = await prisma.event.create({
    data: {
      userId: dbUser.id,
      title,
      slug,
      type,
      date: new Date(date),
      time,
      city,
      status: 'draft',
    },
  });

  return NextResponse.json(event, { status: 201 });
}
