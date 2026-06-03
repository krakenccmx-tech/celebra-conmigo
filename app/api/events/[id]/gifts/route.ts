export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const id = new URL(request.url).pathname.split('/')[3];

    const { data: gifts, error } = await supabaseAdmin
      .from('gift_options')
      .select('*')
      .eq('event_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(gifts);
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener opciones de regalo' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const id = new URL(request.url).pathname.split('/')[3];
    const body = await request.json();
    const { type, title, description, url } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Tipo y título son requeridos.' },
        { status: 400 }
      );
    }

    const { data: gift, error } = await supabaseAdmin
      .from('gift_options')
      .insert({
        event_id: id,
        type,
        title,
        description: description || null,
        url: url || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(gift, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Error al crear opción de regalo' },
      { status: 500 }
    );
  }
}
