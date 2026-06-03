import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';

export async function getSession() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user;
}

export async function getCurrentUser() {
  const authUser = await getSession();
  if (!authUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: authUser.email! },
  });

  return dbUser;
}
