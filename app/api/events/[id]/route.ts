import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

function getEventId(request: Request): string {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  return segments[segments.indexOf('events') + 1];
}

export async function GET(request: Request) {
  const id = getEventId(request);

  const { data: event, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  const { data: sections } = await supabaseAdmin
    .from('event_sections')
    .select('*')
    .eq('event_id', id)
    .order('sort_order', { ascending: true });

  const { count: guestsCount } = await supabaseAdmin
    .from('guests')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', id);

  return NextResponse.json({
    ...event,
    sections: sections ?? [],
    guests_count: guestsCount ?? 0,
  });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const id = getEventId(request);
  const body = await request.json();

  const { data: event, error: fetchError } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('events')
    .update({
      title: body.title ?? event.title,
      type: body.type ?? event.type,
      date: body.date ?? event.date,
      time: body.time ?? event.time,
      city: body.city ?? event.city,
      status: body.status ?? event.status,
      template_id: body.template_id ?? event.template_id,
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: 'Error al actualizar evento' }, { status: 500 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const id = getEventId(request);

  const { data: event, error: fetchError } = await supabaseAdmin
    .from('events')
    .select('id')
    .eq('id', id)
    .single();

  if (fetchError || !event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  const { error: deleteError } = await supabaseAdmin
    .from('events')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}