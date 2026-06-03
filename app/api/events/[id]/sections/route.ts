import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const id = new URL(request.url).pathname.split('/').filter(Boolean)[2];

  const { data: sections, error } = await supabaseAdmin
    .from('event_sections')
    .select('*')
    .eq('event_id', id)
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(sections);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const id = new URL(request.url).pathname.split('/').filter(Boolean)[2];
  const body = await request.json();
  const { sections } = body as {
    sections: Array<{
      id?: string;
      type: string;
      title: string;
      content?: string;
      image_url?: string;
      is_active?: boolean;
      sort_order?: number;
    }>;
  };

  if (!sections || !Array.isArray(sections)) {
    return NextResponse.json(
      { error: 'Se requiere un array de secciones.' },
      { status: 400 }
    );
  }

  const results = [];

  for (const s of sections) {
    const row = {
      event_id: id,
      type: s.type,
      title: s.title,
      content: s.content || null,
      image_url: s.image_url || null,
      is_active: s.is_active ?? true,
      sort_order: s.sort_order ?? 0,
    };

    const { data, error } = s.id
      ? await supabaseAdmin
          .from('event_sections')
          .upsert({ id: s.id, ...row })
          .select()
          .single()
      : await supabaseAdmin
          .from('event_sections')
          .insert(row)
          .select()
          .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    results.push(data);
  }

  return NextResponse.json(results);
}
