import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const id = new URL(request.url).pathname.split('/')[3];

  const { data: guests, error } = await supabaseAdmin
    .from('guests')
    .select('*, rsvps(*)')
    .eq('event_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(guests);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const id = new URL(request.url).pathname.split('/')[3];
  const body = await request.json();
  const { name, email, phone, maxCompanions, tableName } = body;

  if (!name) {
    return NextResponse.json(
      { error: 'El nombre es requerido.' },
      { status: 400 }
    );
  }

  const token = crypto.randomUUID();

  const { data: guest, error } = await supabaseAdmin
    .from('guests')
    .insert({
      event_id: id,
      name,
      email: email || null,
      phone: phone || null,
      max_companions: maxCompanions || 0,
      table_name: tableName || null,
      token,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(guest, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { guestId } = body;

  if (!guestId) {
    return NextResponse.json(
      { error: 'Se requiere guestId.' },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from('guests')
    .delete()
    .eq('id', guestId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
