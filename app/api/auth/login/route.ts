import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email y contraseña son requeridos.' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const authUser = data.user;

  // Check if user exists in users table
  const { data: existingUser, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return NextResponse.json(
      { error: 'Error al verificar usuario.' },
      { status: 500 }
    );
  }

  let user = existingUser;

  // If user doesn't exist, create from auth metadata
  if (!user) {
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.id,
        name: authUser.user_metadata?.name || '',
        email: authUser.email!,
        role: 'user',
        plan: 'free',
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json(
        { error: 'Error al crear usuario.' },
        { status: 500 }
      );
    }

    user = newUser;
  }

  return NextResponse.json({ success: true, user });
}
