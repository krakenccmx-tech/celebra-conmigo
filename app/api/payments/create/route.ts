import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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
  const { planId, amount } = body;

  if (!planId || !amount) {
    return NextResponse.json({ error: 'Plan y monto son requeridos.' }, { status: 400 });
  }

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      userId: dbUser.id,
      planId,
      provider: 'mercadopago',
      status: 'pending',
      amount,
    },
  });

  // In production, here you would create a MercadoPago preference
  // and return the init_point URL for the checkout
  const checkoutUrl = `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${payment.id}`;

  return NextResponse.json({
    paymentId: payment.id,
    checkoutUrl,
    status: 'pending',
  }, { status: 201 });
}
