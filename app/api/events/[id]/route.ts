import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      sections: { orderBy: { sortOrder: 'asc' } },
      guests: true,
      rsvps: true,
      gifts: true,
      gallery: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  const updated = await prisma.event.update({
    where: { id },
    data: {
      title: body.title ?? event.title,
      type: body.type ?? event.type,
      date: body.date ? new Date(body.date) : event.date,
      time: body.time ?? event.time,
      city: body.city ?? event.city,
      status: body.status ?? event.status,
      templateId: body.templateId ?? event.templateId,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  await prisma.event.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
