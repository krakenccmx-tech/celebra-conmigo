export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const id = new URL(request.url).pathname.split('/')[3];

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      guestToken,
      status,
      companionsCount,
      companionsNames,
      foodRestrictions,
      message,
    } = body;

    if (!guestToken || !status) {
      return NextResponse.json(
        { error: 'guestToken and status are required' },
        { status: 400 }
      );
    }

    // Find guest by token
    const { data: guest, error: guestError } = await supabaseAdmin
      .from('guests')
      .select('id, event_id')
      .eq('token', guestToken)
      .eq('event_id', id)
      .single();

    if (guestError || !guest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    // Insert RSVP record
    const { data: rsvp, error: rsvpError } = await supabaseAdmin
      .from('rsvps')
      .insert({
        guest_id: guest.id,
        event_id: id,
        status,
        companions_count: companionsCount || 0,
        companions_names: companionsNames || null,
        food_restrictions: foodRestrictions || null,
        message: message || null,
      })
      .select()
      .single();

    if (rsvpError) {
      return NextResponse.json(
        { error: 'Failed to create RSVP' },
        { status: 500 }
      );
    }

    // Update guest rsvp_status
    const { error: updateError } = await supabaseAdmin
      .from('guests')
      .update({ rsvp_status: status })
      .eq('id', guest.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update guest status' },
        { status: 500 }
      );
    }

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    console.error('RSVP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
