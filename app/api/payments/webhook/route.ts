import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json();

  const { type, data } = body;

  if (type === 'payment') {
    const paymentId = data?.id;

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 });
    }

    // Find payment by ID
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ received: true });
    }

    if (payment.status === 'pending') {
      // Update payment status to completed
      await supabaseAdmin
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id);

      // Upgrade user plan based on plan_id
      const planMap: Record<string, string> = {
        'plan-starter': 'Starter',
        'plan-premium': 'Premium',
        'plan-business': 'Business',
      };

      const newPlan = planMap[payment.plan_id] || 'Premium';

      await supabaseAdmin
        .from('users')
        .update({ plan: newPlan })
        .eq('id', payment.user_id);
    }
  }

  return NextResponse.json({ received: true });
}
