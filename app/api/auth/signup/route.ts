import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: 'Nombre, email y contraseña son requeridos.' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Create user in our database
  if (data.user) {
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          id: data.user.id,
          email,
          name,
          role: 'client',
          plan: 'Starter',
        },
        { onConflict: 'email' }
      );

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al crear usuario en la base de datos.' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true, user: data.user });
}
