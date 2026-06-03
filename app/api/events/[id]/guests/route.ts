import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { randomBytes } from 'crypto';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;

  const guests = await prisma.guest.findMany({
    where: { eventId: id },
    include: { rsvp: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(guests);
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, email, phone, maxCompanions, tableName } = body;

  if (!name) {
    return NextResponse.json(
      { error: 'El nombre es requerido.' },
      { status: 400 }
    );
  }

  const token = randomBytes(6).toString('hex').toUpperCase();

  const guest = await prisma.guest.create({
    data: {
      eventId: id,
      name,
      email: email || null,
      phone: phone || null,
      maxCompanions: maxCompanions || 0,
      tableName: tableName || null,
      token,
    },
  });

  return NextResponse.json(guest, { status: 201 });
}

export async function DELETE(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const guestId = searchParams.get('guestId');

  if (!guestId) {
    return NextResponse.json(
      { error: 'Se requiere guestId.' },
      { status: 400 }
    );
  }

  await prisma.guest.delete({ where: { id: guestId } });

  return NextResponse.json({ success: true });
}
