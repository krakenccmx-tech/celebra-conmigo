import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'superadmin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const [totalUsers, totalEvents, totalGuests, totalRsvps, totalPayments] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.guest.count(),
    prisma.rsvp.count(),
    prisma.payment.count(),
  ]);

  const confirmedRsvps = await prisma.rsvp.count({ where: { status: 'confirmado' } });
  const publishedEvents = await prisma.event.count({ where: { status: 'published' } });

  return NextResponse.json({
    totalUsers,
    totalEvents,
    publishedEvents,
    totalGuests,
    totalRsvps,
    confirmedRsvps,
    totalPayments,
  });
}
