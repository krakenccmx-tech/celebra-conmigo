import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  const sections = await prisma.eventSection.findMany({
    where: { eventId: id },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json(sections);
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { type, title, content, imageUrl, isActive, sortOrder } = body;

  if (!type || !title) {
    return NextResponse.json(
      { error: 'Tipo y título son requeridos.' },
      { status: 400 }
    );
  }

  const section = await prisma.eventSection.create({
    data: {
      eventId: id,
      type,
      title,
      content: content || null,
      imageUrl: imageUrl || null,
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json(section, { status: 201 });
}

export async function PUT(request: Request, { params }: Params) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { sections } = body as { sections: Array<{ id: string; type: string; title: string; content?: string; imageUrl?: string; isActive?: boolean; sortOrder?: number }> };

  if (!sections || !Array.isArray(sections)) {
    return NextResponse.json(
      { error: 'Se requiere un array de secciones.' },
      { status: 400 }
    );
  }

  const updates = sections.map((s) =>
    prisma.eventSection.upsert({
      where: { id: s.id || 'new-' + Math.random() },
      update: {
        type: s.type,
        title: s.title,
        content: s.content || null,
        imageUrl: s.imageUrl || null,
        isActive: s.isActive ?? true,
        sortOrder: s.sortOrder ?? 0,
      },
      create: {
        eventId: (params as unknown as { id: string }).id,
        type: s.type,
        title: s.title,
        content: s.content || null,
        imageUrl: s.imageUrl || null,
        isActive: s.isActive ?? true,
        sortOrder: s.sortOrder ?? 0,
      },
    })
  );

  const results = await prisma.$transaction(updates);

  return NextResponse.json(results);
}
