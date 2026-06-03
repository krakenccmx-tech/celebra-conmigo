import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

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
    await prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        id: data.user.id,
        email,
        name,
        role: 'client',
        plan: 'Starter',
      },
    });
  }

  return NextResponse.json({ success: true, user: data.user });
}
