import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  const gifts = await prisma.giftOption.findMany({
    where: { eventId: id },
  });

  return NextResponse.json(gifts);
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { type, title, description, url, bankData } = body;

  if (!type || !title) {
    return NextResponse.json(
      { error: 'Tipo y título son requeridos.' },
      { status: 400 }
    );
  }

  const gift = await prisma.giftOption.create({
    data: {
      eventId: id,
      type,
      title,
      description: description || null,
      url: url || null,
      bankData: bankData || null,
    },
  });

  return NextResponse.json(gift, { status: 201 });
}

export async function PUT(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { giftId, type, title, description, url, bankData } = body;

  if (!giftId) {
    return NextResponse.json({ error: 'Se requiere giftId.' }, { status: 400 });
  }

  const updated = await prisma.giftOption.update({
    where: { id: giftId },
    data: {
      type: type ?? undefined,
      title: title ?? undefined,
      description: description ?? undefined,
      url: url ?? undefined,
      bankData: bankData ?? undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const giftId = searchParams.get('giftId');

  if (!giftId) {
    return NextResponse.json({ error: 'Se requiere giftId.' }, { status: 400 });
  }

  await prisma.giftOption.delete({ where: { id: giftId } });

  return NextResponse.json({ success: true });
}
