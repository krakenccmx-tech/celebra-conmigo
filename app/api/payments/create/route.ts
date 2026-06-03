import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data: dbUser, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', user.email!)
    .single();

  if (userError || !dbUser) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const body = await request.json();
  const { planId, amount } = body;

  if (!planId || !amount) {
    return NextResponse.json(
      { error: 'Plan y monto son requeridos.' },
      { status: 400 }
    );
  }

  const { data: payment, error: paymentError } = await supabaseAdmin
    .from('payments')
    .insert({
      user_id: dbUser.id,
      plan_id: planId,
      provider: 'mercadopago',
      status: 'pending',
      amount,
    })
    .select('id')
    .single();

  if (paymentError || !payment) {
    return NextResponse.json(
      { error: 'Error al crear el pago' },
      { status: 500 }
    );
  }

  // In production, here you would create a MercadoPago preference
  // and return the init_point URL for the checkout
  const checkoutUrl = `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${payment.id}`;

  return NextResponse.json({
    paymentId: payment.id,
    checkoutUrl,
    status: 'pending',
  }, { status: 201 });
}
