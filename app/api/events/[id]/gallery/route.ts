import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  const gallery = await prisma.galleryItem.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(gallery);
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const contentType = request.headers.get('content-type') || '';

  // Handle file upload
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const guestId = formData.get('guestId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo.' }, { status: 400 });
    }

    const supabase = await createClient();
    const ext = file.name.split('.').pop();
    const fileName = `${id}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      return NextResponse.json({ error: 'Error al subir imagen.' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(data.path);

    const item = await prisma.galleryItem.create({
      data: {
        eventId: id,
        uploadedByGuestId: guestId || null,
        imageUrl: urlData.publicUrl,
        isApproved: !guestId, // Auto-approve host uploads
      },
    });

    return NextResponse.json(item, { status: 201 });
  }

  // Handle JSON (URL-based upload)
  const body = await request.json();
  const { imageUrl, guestId } = body;

  if (!imageUrl) {
    return NextResponse.json({ error: 'Se requiere imageUrl.' }, { status: 400 });
  }

  const item = await prisma.galleryItem.create({
    data: {
      eventId: id,
      uploadedByGuestId: guestId || null,
      imageUrl,
      isApproved: !guestId,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { itemId, isApproved } = body;

  if (!itemId) {
    return NextResponse.json({ error: 'Se requiere itemId.' }, { status: 400 });
  }

  const updated = await prisma.galleryItem.update({
    where: { id: itemId },
    data: { isApproved },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('itemId');

  if (!itemId) {
    return NextResponse.json({ error: 'Se requiere itemId.' }, { status: 400 });
  }

  await prisma.galleryItem.delete({ where: { id: itemId } });

  return NextResponse.json({ success: true });
}
