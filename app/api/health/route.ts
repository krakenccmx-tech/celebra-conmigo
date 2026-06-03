import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('events')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({
        connected: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      connected: true,
      eventCount: count,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({
      connected: false,
      error: message,
    });
  }
}
