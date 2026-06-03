import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    name: 'Elegancia Clásica',
    category: 'Bodas',
    previewUrl: '/templates/elegancia-clasica.webp',
    configJson: JSON.stringify({
      fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
      colors: { primary: '#C9A96E', background: '#FAFAF8', text: '#1A1A1A' },
      style: 'classic',
    }),
    isPremium: false,
  },
  {
    name: 'Minimal Moderno',
    category: 'Bodas',
    previewUrl: '/templates/minimal-moderno.webp',
    configJson: JSON.stringify({
      fonts: { heading: 'Inter', body: 'Inter' },
      colors: { primary: '#2D2D2D', background: '#FFFFFF', text: '#1A1A1A' },
      style: 'minimal',
    }),
    isPremium: false,
  },
  {
    name: 'Rosa Romántico',
    category: 'Bodas',
    previewUrl: '/templates/rosa-romantico.webp',
    configJson: JSON.stringify({
      fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
      colors: { primary: '#D4A5A5', background: '#FFF9F9', text: '#3D2C2C' },
      style: 'romantic',
    }),
    isPremium: true,
  },
  {
    name: 'Dulce y Tierno',
    category: 'Baby Shower',
    previewUrl: '/templates/dulce-tierno.webp',
    configJson: JSON.stringify({
      fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
      colors: { primary: '#A8D8EA', background: '#F8FDFF', text: '#2C3E50' },
      style: 'soft',
    }),
    isPremium: false,
  },
  {
    name: 'Quinceañera Dorado',
    category: 'XV Años',
    previewUrl: '/templates/quinceanera-dorado.webp',
    configJson: JSON.stringify({
      fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
      colors: { primary: '#D4AF37', background: '#FFFDF7', text: '#1A1A1A' },
      style: 'golden',
    }),
    isPremium: true,
  },
  {
    name: 'Fiesta Vibrante',
    category: 'Cumpleaños',
    previewUrl: '/templates/fiesta-vibrante.webp',
    configJson: JSON.stringify({
      fonts: { heading: 'Inter', body: 'Inter' },
      colors: { primary: '#FF6B6B', background: '#FFFCFC', text: '#2D2D2D' },
      style: 'vibrant',
    }),
    isPremium: false,
  },
  {
    name: 'Corporativo Elegante',
    category: 'Eventos Corporativos',
    previewUrl: '/templates/corporativo-elegante.webp',
    configJson: JSON.stringify({
      fonts: { heading: 'Inter', body: 'Inter' },
      colors: { primary: '#1B365D', background: '#F8F9FA', text: '#1A1A1A' },
      style: 'corporate',
    }),
    isPremium: false,
  },
];

async function main() {
  console.log('Seeding templates...');

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.name.toLowerCase().replace(/\s+/g, '-') },
      update: template,
      create: {
        id: template.name.toLowerCase().replace(/\s+/g, '-'),
        ...template,
      },
    });
  }

  console.log(`Seeded ${templates.length} templates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
