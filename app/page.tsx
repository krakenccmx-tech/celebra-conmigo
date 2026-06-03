import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  CheckCircle2,
  Gift,
  Camera,
  QrCode,
  Clock,
  Heart,
  Sparkles,
  Users,
  ShieldCheck,
  Calendar,
  Award,
  Building2,
  Star,
  MessageCircle,
  ChevronDown,
  Check,
  ArrowRight,
  Smartphone,
} from "lucide-react";

/* ──────────────────────── Constants ──────────────────────── */

const WHATSAPP_LINK =
  "https://wa.me/5215575076281?text=Hola%2C%20me%20interesa%20una%20invitaci%C3%B3n%20digital";
const DEMO_LINK = "/e?slug=boda-ana-pedro";

const NAV_ITEMS = [
  { label: "Características", href: "#caracteristicas" },
  { label: "Eventos", href: "#eventos" },
  { label: "Demo", href: "#demo" },
  { label: "Planes", href: "#planes" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  {
    icon: Mail,
    title: "Invitación Digital Interactiva",
    description:
      "Diseño elegante y personalizado que tus invitados abren desde cualquier dispositivo. Incluye animaciones, música y toda la información de tu evento.",
  },
  {
    icon: CheckCircle2,
    title: "Confirmación RSVP",
    description:
      "Tus invitados confirman asistencia en segundos. Recibe notificaciones en tiempo real y lleva el control total de tu lista.",
  },
  {
    icon: Gift,
    title: "Mesa de Regalos",
    description:
      "Integra tu mesa de regalos directamente en la invitación. Tus invitados eligen, y tú recibes todo en un solo lugar.",
  },
  {
    icon: Camera,
    title: "Galería en Vivo",
    description:
      "Tus invitados suben fotos el día del evento y todos disfrutan los mejores momentos en tiempo real desde la galería compartida.",
  },
  {
    icon: QrCode,
    title: "Check-in con QR",
    description:
      "Control de acceso moderno y sin filas. Cada invitado recibe un código QR único que se escanea al llegar a tu evento.",
  },
  {
    icon: Clock,
    title: "Itinerario del Evento",
    description:
      "Comparte el programa completo de tu celebración: ceremonia, recepción, brindis, primer baile — todo organizado por horario.",
  },
];

const EVENT_TYPES = [
  { icon: Heart, label: "Bodas", slug: "boda-ana-pedro" },
  { icon: Sparkles, label: "XV Años", slug: "xv-valentina" },
  { icon: Users, label: "Baby Shower", slug: "baby-shower-sofia" },
  { icon: ShieldCheck, label: "Bautizos", slug: "bautizo-mateo" },
  { icon: Calendar, label: "Cumpleaños", slug: "cumple-carlos-30" },
  { icon: Award, label: "Graduaciones", slug: "graduacion-2026" },
  { icon: Building2, label: "Eventos Corporativos", slug: "" },
  { icon: Star, label: "Otros", slug: "" },
];

const PLANS = [
  {
    name: "Básico",
    price: "$2,450",
    period: "Pago único · MXN",
    popular: false,
    features: [
      "Invitación digital completa",
      "RSVP en línea",
      "Hasta 80 invitados",
      "Enlace personalizado",
      "Soporte por WhatsApp",
    ],
  },
  {
    name: "Estándar",
    price: "$3,850",
    period: "Pago único · MXN",
    popular: true,
    features: [
      "Todo en Básico +",
      "Hasta 150 invitados",
      "Mesa de regalos",
      "Galería de fotos",
      "Itinerario del evento",
      "Check-in con QR",
    ],
  },
  {
    name: "Plus",
    price: "$5,950",
    period: "Pago único · MXN",
    popular: false,
    features: [
      "Todo en Estándar +",
      "Invitados ilimitados",
      "Galería en vivo",
      "Diseño personalizado",
      "Soporte prioritario",
    ],
  },
];

const FAQS = [
  {
    question: "¿Qué es una invitación digital?",
    answer:
      "Es una invitación moderna que se comparte mediante un enlace único. Tus invitados la abren desde su celular o computadora y encuentran toda la información de tu evento: fecha, lugar, confirmación de asistencia, mesa de regalos y más — todo en una página web elegante y personalizada.",
  },
  {
    question: "¿Cómo funciona el RSVP?",
    answer:
      "Cada invitado recibe un enlace personalizado. Al abrirlo, puede confirmar su asistencia con un solo clic, indicar el número de acompañantes y dejar un mensaje especial. Tú recibes las confirmaciones en tiempo real desde tu panel de administración.",
  },
  {
    question: "¿Puedo personalizar mi invitación?",
    answer:
      "¡Por supuesto! Personalizamos colores, tipografía, fotos, música de fondo e información del evento. En el plan Plus, nuestro equipo de diseño crea una experiencia completamente única para ti.",
  },
  {
    question: "¿Cómo se envían las invitaciones?",
    answer:
      "Recibes un enlace único que puedes compartir por WhatsApp, redes sociales, correo electrónico o cualquier medio digital. No necesitas imprimir nada — es práctico, ecológico y elegante.",
  },
  {
    question: "¿Cuánto tiempo estará activa mi invitación?",
    answer:
      "Tu invitación permanece activa desde el momento de la publicación hasta 30 días después de tu evento. Esto permite que tus invitados sigan disfrutando de la galería de fotos y los recuerdos del día.",
  },
  {
    question: "¿Qué pasa si necesito hacer cambios después de publicar?",
    answer:
      "Puedes actualizar la información de tu invitación en cualquier momento desde tu panel de administración: cambiar horarios, agregar invitados, actualizar la galería y más, sin costo adicional.",
  },
];

/* ──────────────────────── Page ──────────────────────── */

export default function Home() {
  return (
    <>
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-ivory)]/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo mid horizontal.webp"
              alt="Celebra Conmigo"
              width={180}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Nav Links — hidden on mobile */}
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-[var(--color-warm-gray)] transition-colors hover:text-[var(--color-soft-black)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[var(--color-gold)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-gold-dark)] hover:shadow-md md:inline-flex"
          >
            Solicitar Cotización
          </a>
        </nav>
      </header>

      <main className="flex-1">
        {/* ─── Hero Section ─── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-ivory)] via-white to-[var(--color-ivory)]">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--color-gold)]/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[var(--color-gold-light)]/10 blur-3xl" />
            <div className="absolute -right-20 top-40 h-[300px] w-[300px] rounded-full bg-[var(--color-gold)]/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 text-center sm:pt-28 lg:pt-36">
            {/* Badge */}
            <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-gold-light)] bg-white/80 px-5 py-2 text-sm font-medium text-[var(--color-gold-dark)] shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>La nueva forma de invitar</span>
            </div>

            {/* Heading */}
            <h1 className="animate-fade-in-up font-serif text-5xl font-semibold leading-tight tracking-tight text-[var(--color-soft-black)] sm:text-6xl lg:text-7xl">
              Tu evento merece una
              <br />
              <span className="text-[var(--color-gold)]">
                invitación inolvidable
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up animation-delay-200 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-warm-gray)] sm:text-xl opacity-0">
              Invitaciones digitales premium con RSVP, mesa de regalos, galería
              en vivo y check-in con QR.{" "}
              <span className="font-medium text-[var(--color-soft-black)]">
                Todo en un solo enlace.
              </span>
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up animation-delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row opacity-0">
              <Link
                href={DEMO_LINK}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--color-gold)]/20 transition-all hover:bg-[var(--color-gold-dark)] hover:shadow-xl hover:shadow-[var(--color-gold)]/30"
              >
                Ver Invitación Demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-8 py-3.5 text-base font-semibold text-[var(--color-soft-black)] shadow-sm transition-all hover:border-[var(--color-gold-light)] hover:shadow-md"
              >
                Solicitar Cotización
              </a>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-in-up animation-delay-500 mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--color-warm-gray-light)] opacity-0">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[var(--color-gold)]" />
                Sin impresiones
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[var(--color-gold)]" />
                Listo en 48 hrs
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[var(--color-gold)]" />
                100% personalizable
              </span>
            </div>
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section id="caracteristicas" className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-gold)]">
                Características
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-soft-black)] sm:text-5xl">
                Todo lo que necesitas en un solo lugar
              </h2>
              <p className="mt-4 text-lg text-[var(--color-warm-gray)]">
                Cada detalle pensado para que tu evento sea perfecto.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
                    <feature.icon className="h-6 w-6 text-[var(--color-gold)]" />
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-[var(--color-soft-black)]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-warm-gray)]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Event Types Section ─── */}
        <section
          id="eventos"
          className="bg-[var(--color-ivory)] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-gold)]">
                Tipos de evento
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-soft-black)] sm:text-5xl">
                Para cualquier tipo de celebración
              </h2>
              <p className="mt-4 text-lg text-[var(--color-warm-gray)]">
                No importa la ocasión, creamos la invitación perfecta para ti.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
              {EVENT_TYPES.map((event) => {
                const Wrapper = event.slug ? Link : "div";
                const props = event.slug ? { href: `/e?slug=${event.slug}` } : {};
                return (
                <Wrapper
                  key={event.label}
                  {...(props as any)}
                  className="group flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-gold-light)] hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-gold)]/10 transition-colors group-hover:bg-[var(--color-gold)]/20">
                    <event.icon className="h-7 w-7 text-[var(--color-gold)]" />
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-soft-black)]">
                    {event.label}
                  </span>
                  {event.slug && (
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-gold)] font-semibold">Ver demo</span>
                  )}
                </Wrapper>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Demo Section ─── */}
        <section id="demo" className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-gold)]">
                Vista previa
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-soft-black)] sm:text-5xl">
                Descubre cómo se ve tu invitación
              </h2>
              <p className="mt-4 text-lg text-[var(--color-warm-gray)]">
                Navega nuestra invitación de demostración y explora cada
                sección: RSVP, galería, mesa de regalos e itinerario.
              </p>
            </div>

            {/* Phone mockup */}
            <div className="mt-16 flex justify-center">
              <div className="relative">
                {/* Phone frame */}
                <div className="relative mx-auto h-[680px] w-[340px] overflow-hidden rounded-[3rem] border-[8px] border-[var(--color-soft-black)] bg-[var(--color-soft-black)] shadow-2xl">
                  {/* Notch */}
                  <div className="absolute left-1/2 top-0 z-10 h-7 w-36 -translate-x-1/2 rounded-b-2xl bg-[var(--color-soft-black)]" />

                  {/* Screen content */}
                  <div className="h-full w-full overflow-hidden rounded-[2.25rem] bg-[var(--color-ivory)]">
                    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
                        <Smartphone className="h-8 w-8 text-[var(--color-gold)]" />
                      </div>
                      <h3 className="font-serif text-2xl font-semibold text-[var(--color-soft-black)]">
                        Sofía & Alejandro
                      </h3>
                      <p className="mt-2 text-sm text-[var(--color-warm-gray)]">
                        ¡Nos casamos!
                      </p>
                      <div className="mt-4 h-px w-16 bg-[var(--color-gold)]" />
                      <p className="mt-4 text-xs leading-relaxed text-[var(--color-warm-gray)]">
                        Sábado 15 de noviembre de 2026
                        <br />
                        Hacienda Los Olivos
                        <br />
                        Cuernavaca, Morelos
                      </p>
                      <div className="mt-6 grid w-full grid-cols-3 gap-3">
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <CheckCircle2 className="mx-auto h-5 w-5 text-[var(--color-gold)]" />
                          <p className="mt-1 text-[10px] font-medium text-[var(--color-warm-gray)]">
                            RSVP
                          </p>
                        </div>
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <Gift className="mx-auto h-5 w-5 text-[var(--color-gold)]" />
                          <p className="mt-1 text-[10px] font-medium text-[var(--color-warm-gray)]">
                            Regalos
                          </p>
                        </div>
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <Camera className="mx-auto h-5 w-5 text-[var(--color-gold)]" />
                          <p className="mt-1 text-[10px] font-medium text-[var(--color-warm-gray)]">
                            Galería
                          </p>
                        </div>
                      </div>
                      <Link
                        href={DEMO_LINK}
                        className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-gold)] px-6 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-gold-dark)]"
                      >
                        Abrir invitación
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Decorative glow behind phone */}
                <div className="absolute -inset-8 -z-10 rounded-full bg-[var(--color-gold)]/5 blur-3xl" />
              </div>
            </div>

            {/* CTA below mockup */}
            <div className="mt-12 text-center">
              <Link
                href={DEMO_LINK}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--color-gold)]/20 transition-all hover:bg-[var(--color-gold-dark)] hover:shadow-xl"
              >
                Ver Invitación Demo Completa
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Pricing Section ─── */}
        <section
          id="planes"
          className="bg-[var(--color-ivory)] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-gold)]">
                Planes
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-soft-black)] sm:text-5xl">
                Planes diseñados para tu evento
              </h2>
              <p className="mt-4 text-lg text-[var(--color-warm-gray)]">
                Elige el que mejor se adapte a tu celebración. Sin
                suscripciones, sin sorpresas.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-3xl border-2 p-8 shadow-sm transition-all duration-300 hover:shadow-lg ${
                    plan.popular
                      ? "border-[var(--color-gold)] bg-white shadow-md"
                      : "border-[var(--color-border)] bg-[var(--color-card)]"
                  }`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-gold)] px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                      Popular
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="font-serif text-2xl font-semibold text-[var(--color-soft-black)]">
                      {plan.name}
                    </h3>
                    <div className="mt-4">
                      <span className="font-serif text-5xl font-bold text-[var(--color-soft-black)]">
                        {plan.price}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--color-warm-gray)]">
                      {plan.period}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="my-8 h-px bg-[var(--color-border)]" />

                  {/* Features */}
                  <ul className="flex-1 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-gold)]" />
                        <span className="text-sm text-[var(--color-soft-black)]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 block rounded-full py-3.5 text-center text-sm font-semibold transition-all ${
                      plan.popular
                        ? "bg-[var(--color-gold)] text-white shadow-lg shadow-[var(--color-gold)]/20 hover:bg-[var(--color-gold-dark)] hover:shadow-xl"
                        : "border border-[var(--color-border)] bg-white text-[var(--color-soft-black)] hover:border-[var(--color-gold-light)] hover:shadow-md"
                    }`}
                  >
                    Solicitar Cotización
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ Section ─── */}
        <section id="faq" className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-gold)]">
                FAQ
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-soft-black)] sm:text-5xl">
                Preguntas frecuentes
              </h2>
              <p className="mt-4 text-lg text-[var(--color-warm-gray)]">
                Encuentra respuestas a las dudas más comunes sobre nuestras
                invitaciones digitales.
              </p>
            </div>

            <div className="mt-16 space-y-4">
              {FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition-all hover:shadow-md"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5">
                    <span className="text-base font-semibold text-[var(--color-soft-black)] pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown className="faq-chevron h-5 w-5 flex-shrink-0 text-[var(--color-warm-gray)]" />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-sm leading-relaxed text-[var(--color-warm-gray)]">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>

            {/* Extra CTA */}
            <div className="mt-12 text-center">
              <p className="text-sm text-[var(--color-warm-gray)]">
                ¿Tienes otra pregunta?
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--color-soft-black)] shadow-sm transition-all hover:border-[var(--color-gold-light)] hover:shadow-md"
              >
                <MessageCircle className="h-4 w-4 text-[var(--color-gold)]" />
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-ivory)]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Image
                src="/logo mid horizontal.webp"
                alt="Celebra Conmigo"
                width={160}
                height={36}
                className="h-8 w-auto"
              />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-warm-gray)]">
                Invitaciones digitales premium para bodas, XV años y todo tipo
                de celebraciones. Tu evento, en un solo enlace.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-soft-black)]">
                Navegación
              </h4>
              <ul className="mt-4 space-y-3">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--color-warm-gray)] transition-colors hover:text-[var(--color-soft-black)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-soft-black)]">
                Legal
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/privacidad"
                    className="text-sm text-[var(--color-warm-gray)] transition-colors hover:text-[var(--color-soft-black)]"
                  >
                    Aviso de Privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terminos"
                    className="text-sm text-[var(--color-warm-gray)] transition-colors hover:text-[var(--color-soft-black)]"
                  >
                    Términos y Condiciones
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-soft-black)]">
                Contacto
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-warm-gray)] transition-colors hover:text-[var(--color-soft-black)]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hola@celebraconmigo.store"
                    className="text-sm text-[var(--color-warm-gray)] transition-colors hover:text-[var(--color-soft-black)]"
                  >
                    hola@celebraconmigo.store
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-[var(--color-border)] pt-8 text-center">
            <p className="text-xs text-[var(--color-warm-gray-light)]">
              © 2026 Celebra Conmigo. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* ─── Floating WhatsApp Button ─── */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        style={{ animation: "pulse-soft 2s ease-in-out infinite" }}
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </>
  );
}
