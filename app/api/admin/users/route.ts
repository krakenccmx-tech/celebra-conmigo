import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!dbUser || dbUser.role !== 'superadmin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: eventCounts } = await supabaseAdmin
    .from('events')
    .select('user_id');

  const countsMap: Record<string, number> = {};
  if (eventCounts) {
    for (const row of eventCounts) {
      countsMap[row.user_id] = (countsMap[row.user_id] || 0) + 1;
    }
  }

  const usersWithCounts = (users || []).map((u) => ({
    ...u,
    _count: { events: countsMap[u.id] || 0 },
  }));

  return NextResponse.json(usersWithCounts);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!dbUser || dbUser.role !== 'superadmin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json();
  const { userId, role, plan } = body;

  if (!userId) {
    return NextResponse.json({ error: 'Se requiere userId.' }, { status: 400 });
  }

  const updateData: Record<string, string> = {};
  if (role !== undefined) updateData.role = role;
  if (plan !== undefined) updateData.plan = plan;

  const { data: updated, error } = await supabaseAdmin
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updated);
}
