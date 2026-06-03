import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('email', authUser.email!)
    .single();

  if (!dbUser || dbUser.role !== 'superadmin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const [users, events, guests, rsvps, payments, confirmedRsvps, publishedEvents] =
    await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('events').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('guests').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('rsvps').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('payments').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('rsvps').select('*', { count: 'exact', head: true }).eq('status', 'confirmado'),
      supabaseAdmin.from('events').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    ]);

  return NextResponse.json({
    totalUsers: users.count ?? 0,
    totalEvents: events.count ?? 0,
    publishedEvents: publishedEvents.count ?? 0,
    totalGuests: guests.count ?? 0,
    totalRsvps: rsvps.count ?? 0,
    confirmedRsvps: confirmedRsvps.count ?? 0,
    totalPayments: payments.count ?? 0,
  });
}
