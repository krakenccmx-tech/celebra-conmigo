"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Clock,
  Gift,
  Camera,
  ChevronDown,
  Music,
  Pause,
  ExternalLink,
  Shirt,
  Navigation,
} from "lucide-react";

/* ─────────── Types ─────────── */
interface TimelineItem { time: string; title: string; desc: string; }
interface DressCode { style: string; men: string; women: string; colors: string; }
interface GiftItem { title: string; url: string; desc: string; }
interface Section {
  id: string;
  eventId: string;
  type: string;
  title: string;
  content: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}
interface GalleryItem { id: string; imageUrl: string; }
interface GiftOption { id: string; type: string; title: string; description: string | null; url: string | null; bankData: string | null; }
interface EventData {
  id: string;
  title: string;
  slug: string;
  type: string;
  date: string;
  time: string;
  city: string;
  sections: Section[];
  gifts: GiftOption[];
  gallery: GalleryItem[];
}

/* ─────────── Countdown Hook ─────────── */
function useCountdown(targetDate: string) {
  const calculate = useCallback(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [targetDate]);

  const [countdown, setCountdown] = useState(calculate);

  useEffect(() => {
    const interval = setInterval(() => setCountdown(calculate), 1000);
    return () => clearInterval(interval);
  }, [calculate]);

  return countdown;
}

/* ─────────── Main Component ─────────── */
export default function PublicInvitationPage() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestToken, setGuestToken] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // RSVP
  const [rsvpStatus, setRsvpStatus] = useState("confirmado");
  const [companionsCount, setCompanionsCount] = useState(0);
  const [restrictions, setRestrictions] = useState("");
  const [message, setMessage] = useState("");
  const [rsvpDone, setRsvpDone] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const slug = searchParams.get("slug") || "";
    const token = searchParams.get("guestToken") || "";
    setGuestToken(token);

    if (!slug) {
      setNotFound(true);
      return;
    }

    async function loadEvent() {
      try {
        const res = await fetch(`/api/public/events?slug=${slug}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data: EventData = await res.json();
        setEvent(data);
        setSections(data.sections || []);
      } catch {
        setNotFound(true);
      }
    }

    loadEvent();
  }, []);

  const countdown = useCountdown(event?.date || "2026-12-31");

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setRsvpLoading(true);

    try {
      await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestToken: guestToken || undefined,
          name: guestName,
          status: rsvpStatus,
          companionsCount,
          foodRestrictions: restrictions,
          message,
        }),
      });
      setRsvpDone(true);
    } catch {
      // handle error
    } finally {
      setRsvpLoading(false);
    }
  };

  /* ─── Helpers ─── */
  const getSection = (type: string) => sections.find((s) => s.type === type);
  const portada = getSection("portada");
  const nombres = getSection("nombres");
  const itinerario = getSection("itinerario");
  const ubicacion = getSection("ubicacion");
  const dressCode = getSection("dress_code");
  const mesaRegalos = getSection("mesa_regalos");
  const galeria = getSection("galeria");

  const bgImg = portada?.imageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200";

  let timelineItems: TimelineItem[] = [];
  try { if (itinerario) timelineItems = JSON.parse(itinerario.content); } catch { /* */ }

  let dressCodeData: DressCode | null = null;
  try { if (dressCode) dressCodeData = JSON.parse(dressCode.content); } catch { /* */ }

  let giftItems: GiftItem[] = [];
  try { if (mesaRegalos) giftItems = JSON.parse(mesaRegalos.content); } catch { /* */ }

  // Use gallery from API or fallback to section content
  let galleryImages: string[] = [];
  if (event?.gallery && event.gallery.length > 0) {
    galleryImages = event.gallery.map((g) => g.imageUrl);
  } else {
    try { if (galeria) galleryImages = JSON.parse(galeria.content); } catch { /* */ }
  }

  // Use gifts from API or fallback to section content
  if (event?.gifts && event.gifts.length > 0) {
    giftItems = event.gifts.map((g) => ({
      title: g.title,
      url: g.url || "",
      desc: g.description || "",
    }));
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("es-MX", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
    } catch { return dateStr; }
  };

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-ivory)]">
        <div className="text-center px-6">
          <Heart className="h-8 w-8 mx-auto text-[var(--color-gold)] mb-4" />
          <h2 className="text-xl font-serif font-semibold text-[var(--color-soft-black)]">
            Invitación no encontrada
          </h2>
          <p className="text-sm text-[var(--color-warm-gray)] mt-2">
            El enlace puede estar incorrecto o el evento aún no se ha publicado.
          </p>
          <Link href="/" className="mt-6 inline-flex items-center text-sm text-[var(--color-gold)] hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-ivory)]">
        <div className="text-center animate-fade-in">
          <Heart className="h-8 w-8 mx-auto text-[var(--color-gold)] mb-4 animate-pulse" />
          <h2 className="text-xl font-serif font-semibold text-[var(--color-soft-black)]">
            Cargando invitación...
          </h2>
        </div>
      </div>
    );
  }

  /* ─── Intro Screen ─── */
  if (showIntro) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => setShowIntro(false)}
        style={{
          background: `linear-gradient(to top, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.4) 50%, rgba(26,26,26,0.6) 100%), url('${bgImg}') center/cover no-repeat`,
        }}
      >
        <div className="text-center text-white space-y-6 px-6 animate-fade-in">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-white/60">{event.type}</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light leading-tight">
            {event.title}
          </h1>
          <p className="text-sm font-sans text-white/70 max-w-sm mx-auto">
            {formatDate(event.date)} · {event.city}
          </p>
          <div className="pt-8">
            <div className="inline-flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs uppercase tracking-widest text-white/50 font-sans">Toca para abrir</span>
              <ChevronDown className="h-5 w-5 text-white/50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)] font-sans text-[var(--color-soft-black)] pb-16">
      {/* Cover */}
      <section
        className="relative h-[85vh] flex flex-col justify-end text-white pb-16 px-6 text-center"
        style={{
          background: `linear-gradient(to top, rgba(26,26,26,0.85) 20%, rgba(26,26,26,0.1) 60%, rgba(26,26,26,0.3) 100%), url('${bgImg}') center/cover no-repeat`,
        }}
      >
        <div className="max-w-2xl mx-auto space-y-4 animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60 font-sans">{event.type}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light leading-tight">
            {portada?.content || event.title}
          </h1>
          <p className="text-sm text-white/70 font-sans">{formatDate(event.date)} · {event.city}</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-xl mx-auto px-5 space-y-10 -mt-8 relative z-10">
        {/* Countdown */}
        <div className="bg-white rounded-3xl border border-[var(--color-border)] p-8 shadow-sm text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-warm-gray)] font-sans mb-6">Cuenta regresiva</p>
          <div className="grid grid-cols-4 gap-4">
            {[
              { value: countdown.days, label: "Días" },
              { value: countdown.hours, label: "Horas" },
              { value: countdown.minutes, label: "Min" },
              { value: countdown.seconds, label: "Seg" },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-3xl sm:text-4xl font-serif font-semibold text-[var(--color-soft-black)]">
                  {String(item.value).padStart(2, "0")}
                </span>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-warm-gray)] mt-1 font-sans">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Names */}
        {nombres && (
          <div className="bg-white rounded-3xl border border-[var(--color-border)] p-8 shadow-sm text-center">
            <Heart className="h-5 w-5 mx-auto text-[var(--color-gold)] mb-4" />
            <div className="space-y-1">
              {nombres.content.split("\n").map((line, i) => (
                <p key={i} className={
                  line === "&" ? "text-2xl font-serif text-[var(--color-gold)] my-2"
                    : i < 3 ? "text-2xl sm:text-3xl font-serif font-semibold text-[var(--color-soft-black)]"
                    : "text-sm text-[var(--color-warm-gray)] font-sans mt-4 leading-relaxed"
                }>{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {timelineItems.length > 0 && (
          <div className="bg-white rounded-3xl border border-[var(--color-border)] p-8 shadow-sm">
            <div className="text-center mb-8">
              <Clock className="h-5 w-5 mx-auto text-[var(--color-gold)] mb-3" />
              <h3 className="text-2xl font-serif font-semibold text-[var(--color-soft-black)]">Itinerario</h3>
            </div>
            <div className="relative">
              <div className="absolute left-[18px] top-2 bottom-2 w-px bg-[var(--color-border)]" />
              <div className="space-y-6">
                {timelineItems.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start relative">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 flex items-center justify-center z-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-gold)]" />
                    </div>
                    <div className="flex-1 pb-2">
                      <span className="text-xs font-sans font-semibold text-[var(--color-gold)] uppercase tracking-wider">{item.time}</span>
                      <h4 className="text-base font-serif font-semibold text-[var(--color-soft-black)] mt-0.5">{item.title}</h4>
                      <p className="text-sm text-[var(--color-warm-gray)] font-sans mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location */}
        {ubicacion && (
          <div className="bg-white rounded-3xl border border-[var(--color-border)] p-8 shadow-sm text-center">
            <MapPin className="h-5 w-5 mx-auto text-[var(--color-gold)] mb-3" />
            <h3 className="text-2xl font-serif font-semibold text-[var(--color-soft-black)] mb-6">Ubicación</h3>
            <div className="space-y-4 text-sm font-sans">
              {ubicacion.content.split("\n").map((line, i) => (
                <p key={i} className="text-[var(--color-warm-gray)]">{line}</p>
              ))}
            </div>
            {ubicacion.imageUrl && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <a href={ubicacion.imageUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-gold)] px-6 text-xs font-semibold text-white hover:bg-[var(--color-gold-dark)] transition-colors gap-2 font-sans">
                  <MapPin className="h-3.5 w-3.5" /> Google Maps
                </a>
              </div>
            )}
          </div>
        )}

        {/* Dress Code */}
        {dressCodeData && (
          <div className="bg-white rounded-3xl border border-[var(--color-border)] p-8 shadow-sm text-center">
            <Shirt className="h-5 w-5 mx-auto text-[var(--color-gold)] mb-3" />
            <h3 className="text-2xl font-serif font-semibold text-[var(--color-soft-black)] mb-2">Código de Vestimenta</h3>
            <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold-dark)] text-xs font-semibold uppercase tracking-wider font-sans mb-6">
              {dressCodeData.style}
            </span>
            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div className="bg-[var(--color-ivory)] rounded-2xl p-4">
                <p className="font-semibold text-[var(--color-soft-black)] text-xs uppercase tracking-wider mb-1">Caballeros</p>
                <p className="text-[var(--color-warm-gray)] text-xs">{dressCodeData.men}</p>
              </div>
              <div className="bg-[var(--color-ivory)] rounded-2xl p-4">
                <p className="font-semibold text-[var(--color-soft-black)] text-xs uppercase tracking-wider mb-1">Damas</p>
                <p className="text-[var(--color-warm-gray)] text-xs">{dressCodeData.women}</p>
              </div>
            </div>
            {dressCodeData.colors && (
              <p className="text-xs text-[var(--color-warm-gray)] mt-4 font-sans italic">Nota: {dressCodeData.colors}</p>
            )}
          </div>
        )}

        {/* Gifts */}
        {giftItems.length > 0 && (
          <div className="bg-white rounded-3xl border border-[var(--color-border)] p-8 shadow-sm">
            <div className="text-center mb-6">
              <Gift className="h-5 w-5 mx-auto text-[var(--color-gold)] mb-3" />
              <h3 className="text-2xl font-serif font-semibold text-[var(--color-soft-black)]">Mesa de Regalos</h3>
            </div>
            <div className="space-y-3">
              {giftItems.map((gift, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-ivory)] border border-[var(--color-border)]/50">
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--color-soft-black)] font-sans">{gift.title}</h4>
                    <p className="text-xs text-[var(--color-warm-gray)] font-sans mt-0.5">{gift.desc}</p>
                  </div>
                  {gift.url && (
                    <a href={gift.url} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20 transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div className="bg-white rounded-3xl border border-[var(--color-border)] p-8 shadow-sm">
            <div className="text-center mb-6">
              <Camera className="h-5 w-5 mx-auto text-[var(--color-gold)] mb-3" />
              <h3 className="text-2xl font-serif font-semibold text-[var(--color-soft-black)]">Galería</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {galleryImages.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                  <img src={img} alt={`Galería ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RSVP */}
        <div className="bg-white rounded-3xl border border-[var(--color-border)] p-8 shadow-sm">
          <div className="text-center mb-6">
            <Heart className="h-5 w-5 mx-auto text-[var(--color-gold)] mb-3" />
            <h3 className="text-2xl font-serif font-semibold text-[var(--color-soft-black)]">Confirma tu Asistencia</h3>
            <p className="text-sm text-[var(--color-warm-gray)] font-sans mt-2">¿Nos acompañas a celebrar?</p>
          </div>

          {rsvpDone ? (
            <div className="text-center py-8 space-y-3">
              <span className="text-4xl">🎉</span>
              <p className="font-serif text-xl font-semibold text-[var(--color-soft-black)]">¡Gracias por confirmar!</p>
              <p className="text-sm text-[var(--color-warm-gray)] font-sans">Tu respuesta ha sido registrada.</p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              {!guestToken && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-gray)] mb-2 font-sans">Tu nombre completo</label>
                  <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ej. Familia García Pérez" required
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all font-sans" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-gray)] mb-2 font-sans">¿Asistirás?</label>
                <select value={rsvpStatus} onChange={(e) => setRsvpStatus(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all font-sans">
                  <option value="confirmado">Sí, con mucho gusto</option>
                  <option value="cancelado">No podré asistir</option>
                </select>
              </div>

              {rsvpStatus === "confirmado" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-gray)] mb-2 font-sans">Número de acompañantes</label>
                  <input type="number" value={companionsCount} onChange={(e) => setCompanionsCount(Number(e.target.value))} min={0} max={10}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all font-sans" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-gray)] mb-2 font-sans">Restricciones alimentarias (opcional)</label>
                <input type="text" value={restrictions} onChange={(e) => setRestrictions(e.target.value)} placeholder="Ej. Vegetariano, sin gluten"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all font-sans" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-gray)] mb-2 font-sans">Mensaje (opcional)</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="¡Muchas felicidades!" rows={3}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all resize-none font-sans" />
              </div>

              <button type="submit" disabled={rsvpLoading}
                className="w-full inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-gold)] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-gold-dark)] transition-colors font-sans disabled:opacity-50">
                {rsvpLoading ? "Enviando..." : "Enviar Respuesta"}
              </button>
            </form>
          )}
        </div>

        {/* Music Toggle */}
        <div className="fixed bottom-6 left-6 z-50">
          <button onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[var(--color-border)] shadow-lg text-[var(--color-gold)] hover:scale-110 transition-all"
            aria-label={isPlaying ? "Pausar música" : "Reproducir música"}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Music className="h-5 w-5" />}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-[var(--color-border)]">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <img src="/logo mid horizontal.webp" alt="Celebra Conmigo" className="h-8 mx-auto mb-2 opacity-40" />
          </Link>
          <p className="text-[10px] text-[var(--color-warm-gray)] font-sans">Invitación digital creada con Celebra Conmigo</p>
        </div>
      </div>
    </div>
  );
}
