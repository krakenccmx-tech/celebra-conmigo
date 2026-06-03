export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const id = new URL(request.url).pathname.split('/')[3];

  const { data, error } = await supabaseAdmin
    .from('gallery_items')
    .select('*')
    .eq('event_id', id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const id = new URL(request.url).pathname.split('/')[3];

  const body = await request.json();
  const { image_url, guest_id, caption } = body;

  if (!image_url) {
    return NextResponse.json(
      { error: 'Se requiere image_url.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('gallery_items')
    .insert({
      event_id: id,
      guest_id: guest_id || null,
      image_url,
      caption: caption || null,
      is_approved: !guest_id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
