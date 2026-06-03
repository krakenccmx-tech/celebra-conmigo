# Celebra SaaS - Plataforma de Invitaciones Digitales y Gestión de Eventos

Celebra SaaS es una plataforma web premium y responsiva que permite crear y gestionar invitaciones digitales interactivas para bodas, XV años, bautizos, baby showers, cumpleaños, graduaciones, eventos corporativos y más.

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: Shadcn UI / Radix UI
- **Base de Datos y Backend**: Supabase (PostgreSQL, Storage, Auth)
- **ORM**: Prisma

## Requisitos Previos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (v18.x o superior)
- [npm](https://www.npmjs.com/) (v9.x o superior)

## Instalación y Configuración

1. Clonar el repositorio.
2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Crear un archivo `.env.local` en la raíz del proyecto y configurar las siguientes variables de entorno:
   ```env
   # Supabase & Prisma Config (PostgreSQL connection string)
   DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

   # Supabase Client Credentials
   NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
   ```

4. Generar el cliente de Prisma:
   ```bash
   npx prisma generate
   ```

5. Ejecutar migraciones o empujar el esquema local (en desarrollo):
   ```bash
   npx prisma db push
   ```

6. Levantar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Estructura del Código

- `/app`: Páginas y layouts de Next.js.
  - `/app/(public)`: Landing page e invitaciones públicas (`/e/[slug]`).
  - `/app/(auth)`: Registro, login y recuperación de contraseña.
  - `/app/(dashboard)`: Editor de eventos, control de invitados y RSVP.
  - `/app/(admin)`: Gestión global de planes y plantillas.
- `/components`: Componentes reutilizables.
- `/lib`: Utilidades, clientes de Supabase y de base de datos.
- `/prisma`: Esquema de base de datos (`schema.prisma`).

## Fase 2 - Siguientes Pasos

- Integrar pasarelas de pago reales (Stripe y Mercado Pago).
- Agregar subdominios dinámicos (`[slug].celebraconmigo.store`).
- Añadir recordatorios y notificaciones automáticas por WhatsApp.
- Habilitar panel avanzado de seating drag and drop.
