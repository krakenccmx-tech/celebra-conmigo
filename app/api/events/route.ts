import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('id, role')
    .eq('email', user.email!)
    .single();

  if (!dbUser) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  let query = supabaseAdmin
    .from('events')
    .select('*, guests(count), rsvps(count)')
    .order('created_at', { ascending: false });

  if (dbUser.role !== 'superadmin') {
    query = query.eq('user_id', dbUser.id);
  }

  const { data: events, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', user.email!)
    .single();

  if (!dbUser) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const body = await request.json();
  const { title, type, date, time, city } = body;

  if (!title || !type || !date || !time || !city) {
    return NextResponse.json(
      { error: 'Todos los campos son requeridos.' },
      { status: 400 }
    );
  }

  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const slug = `${title.toLowerCase().replace(/\s+/g, '-')}-${randomSuffix}`;

  const { data: event, error } = await supabaseAdmin
    .from('events')
    .insert({
      user_id: dbUser.id,
      title,
      slug,
      type,
      date,
      time,
      city,
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(event, { status: 201 });
}
