import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json();

  // MercadoPago sends notification with type and data.id
  const { type, data } = body;

  if (type === 'payment') {
    const paymentId = data?.id;

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 });
    }

    // In production, verify payment status with MercadoPago API
    // const mpPayment = await mercadopago.payment.get(paymentId);
    // For now, simulate approval

    // Find payment by external reference or ID
    const payment = await prisma.payment.findFirst({
      where: { id: paymentId },
      include: { user: true },
    });

    if (payment && payment.status === 'pending') {
      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'completed' },
      });

      // Upgrade user plan
      const planMap: Record<string, string> = {
        'plan-starter': 'Starter',
        'plan-premium': 'Premium',
        'plan-business': 'Business',
      };

      const newPlan = planMap[payment.planId] || 'Premium';

      await prisma.user.update({
        where: { id: payment.userId },
        data: { plan: newPlan },
      });
    }
  }

  return NextResponse.json({ received: true });
}
