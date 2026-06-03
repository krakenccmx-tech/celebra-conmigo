import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Se requiere el slug.' }, { status: 400 });
  }

  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*, event_sections(*), gift_options(*), gallery_items(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !event) {
      return NextResponse.json({ error: 'Evento no encontrado.' }, { status: 404 });
    }

    // Transform to match expected format
    const result = {
      ...event,
      sections: (event.event_sections || [])
        .filter((s: any) => s.is_active)
        .sort((a: any, b: any) => a.sort_order - b.sort_order),
      gifts: event.gift_options || [],
      gallery: (event.gallery_items || [])
        .filter((g: any) => g.is_approved),
    };

    delete result.event_sections;
    delete result.gift_options;
    delete result.gallery_items;

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}
