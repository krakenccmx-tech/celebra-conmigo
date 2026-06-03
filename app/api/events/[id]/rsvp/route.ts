import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { guestToken, status, companionsCount, companionsNames, foodRestrictions, message } = body;

  if (!status) {
    return NextResponse.json(
      { error: 'El estado es requerido.' },
      { status: 400 }
    );
  }

  let guest = null;

  if (guestToken) {
    guest = await prisma.guest.findUnique({ where: { token: guestToken } });
    if (!guest) {
      return NextResponse.json({ error: 'Invitado no encontrado.' }, { status: 404 });
    }
  }

  if (guest) {
    // Update guest status
    await prisma.guest.update({
      where: { id: guest.id },
      data: { rsvpStatus: status },
    });

    // Upsert RSVP record
    const rsvp = await prisma.rsvp.upsert({
      where: { guestId: guest.id },
      update: {
        status,
        companionsCount: companionsCount || 0,
        companionsNames: companionsNames || null,
        foodRestrictions: foodRestrictions || null,
        message: message || null,
      },
      create: {
        guestId: guest.id,
        eventId: id,
        status,
        companionsCount: companionsCount || 0,
        companionsNames: companionsNames || null,
        foodRestrictions: foodRestrictions || null,
        message: message || null,
      },
    });

    return NextResponse.json(rsvp);
  }

  // Public RSVP without token — create anonymous guest
  const { name } = body;
  const token = Math.random().toString(36).substring(2, 10).toUpperCase();

  const newGuest = await prisma.guest.create({
    data: {
      eventId: id,
      name: name || 'Invitado',
      token,
      rsvpStatus: status,
      maxCompanions: companionsCount || 0,
    },
  });

  const rsvp = await prisma.rsvp.create({
    data: {
      guestId: newGuest.id,
      eventId: id,
      status,
      companionsCount: companionsCount || 0,
      companionsNames: companionsNames || null,
      foodRestrictions: foodRestrictions || null,
      message: message || null,
    },
  });

  return NextResponse.json(rsvp, { status: 201 });
}
