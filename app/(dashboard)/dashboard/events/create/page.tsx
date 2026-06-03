"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    type: "Boda",
    title: "",
    date: "",
    time: "",
    city: "",
    hosts: "",
    description: "",
    imageUrl: "",
    ceremonyLocation: "",
    receptionLocation: "",
    mapsLink: "",
    templateId: "temp-1",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 5) setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    try {
      // Create event
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          date: formData.date,
          time: formData.time,
          city: formData.city,
          slug: slug || "evento-nuevo",
        }),
      });

      const event = await res.json();

      if (!res.ok) {
        setError(event.error || "Error al crear el evento.");
        setIsSubmitting(false);
        return;
      }

      // Create default sections
      const defaultSections = [
        {
          id: crypto.randomUUID(),
          type: "portada",
          title: "Portada",
          content: formData.title,
          imageUrl: formData.imageUrl || null,
          isActive: true,
          sortOrder: 1,
        },
        {
          id: crypto.randomUUID(),
          type: "nombres",
          title: "Celebrados",
          content: formData.hosts || formData.title + "\n\nTenemos el honor de invitarles.",
          isActive: true,
          sortOrder: 2,
        },
        {
          id: crypto.randomUUID(),
          type: "itinerario",
          title: "Itinerario",
          content: JSON.stringify([
            { time: formData.time || "5:00 PM", title: "Inicio del Evento", desc: formData.ceremonyLocation || "Lugar por confirmar" },
            { time: "Después", title: "Recepción", desc: formData.receptionLocation || "Lugar principal" },
          ]),
          isActive: true,
          sortOrder: 3,
        },
        {
          id: crypto.randomUUID(),
          type: "ubicacion",
          title: "Ubicación",
          content: `Ceremonia: ${formData.ceremonyLocation || "Por confirmar"}\nRecepción: ${formData.receptionLocation || "Por confirmar"}`,
          imageUrl: formData.mapsLink || null,
          isActive: true,
          sortOrder: 4,
        },
        {
          id: crypto.randomUUID(),
          type: "dress_code",
          title: "Código de Vestimenta",
          content: JSON.stringify({ style: "Formal", men: "Traje oscuro", women: "Vestido largo o cóctel", colors: "" }),
          isActive: true,
          sortOrder: 5,
        },
        {
          id: crypto.randomUUID(),
          type: "mesa_regalos",
          title: "Mesa de Regalos",
          content: JSON.stringify([{ title: "Tu presencia", url: "", desc: "Tu presencia es nuestro mejor regalo" }]),
          isActive: true,
          sortOrder: 6,
        },
        {
          id: crypto.randomUUID(),
          type: "galeria",
          title: "Galería",
          content: JSON.stringify([]),
          isActive: false,
          sortOrder: 7,
        },
        {
          id: crypto.randomUUID(),
          type: "rsvp",
          title: "Confirmación",
          content: "Confirma tu asistencia antes del evento.",
          isActive: true,
          sortOrder: 8,
        },
      ];

      await fetch(`/api/events/${event.id}/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: defaultSections }),
      });

      // Publish event
      await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });

      router.push("/dashboard");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all font-sans";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-gray)] mb-2 font-sans";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-warm-gray)] hover:text-[var(--color-soft-black)] transition-colors font-sans"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis Eventos
      </Link>

      <div>
        <h2 className="text-2xl font-serif font-semibold text-[var(--color-soft-black)]">
          Crear Nuevo Evento
        </h2>
        <p className="text-sm text-[var(--color-warm-gray)] mt-1 font-sans">
          Completa los pasos para configurar tu invitación digital.
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-5">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold font-sans ${
                step >= s
                  ? "bg-[var(--color-gold)] text-white"
                  : "border border-[var(--color-border)] text-[var(--color-warm-gray)] bg-white"
              }`}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </span>
            <span
              className={`text-xs font-medium hidden sm:inline font-sans ${
                step === s
                  ? "text-[var(--color-soft-black)]"
                  : "text-[var(--color-warm-gray)]"
              }`}
            >
              {s === 1 && "Detalles"}
              {s === 2 && "Anfitriones"}
              {s === 3 && "Ubicación"}
              {s === 4 && "Plantilla"}
              {s === 5 && "Publicar"}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-100 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white border border-[var(--color-border)] rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-serif font-semibold text-[var(--color-soft-black)] text-lg">
                Paso 1: Detalles Básicos
              </h3>
              <div>
                <label className={labelClass}>Tipo de Evento</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Boda">Boda</option>
                  <option value="XV años">XV años</option>
                  <option value="Bautizo">Bautizo</option>
                  <option value="Baby shower">Baby shower</option>
                  <option value="Cumpleaños">Cumpleaños</option>
                  <option value="Graduación">Graduación</option>
                  <option value="Evento corporativo">Evento corporativo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Nombre del Evento</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej. Boda de Ana & Pedro"
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Fecha</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hora</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Ciudad / Estado</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ej. Querétaro, México"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-serif font-semibold text-[var(--color-soft-black)] text-lg">
                Paso 2: Anfitriones y Portada
              </h3>
              <div>
                <label className={labelClass}>Celebrados / Anfitriones</label>
                <input
                  type="text"
                  name="hosts"
                  value={formData.hosts}
                  onChange={handleChange}
                  placeholder="Ej. Ana María Pérez & Pedro Gómez"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Mensaje de Bienvenida</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ej. ¡Acompáñanos a celebrar nuestro día especial!"
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>
                  URL de Foto Principal (Opcional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-serif font-semibold text-[var(--color-soft-black)] text-lg">
                Paso 3: Ubicaciones del Evento
              </h3>
              <div>
                <label className={labelClass}>Lugar de Ceremonia</label>
                <input
                  type="text"
                  name="ceremonyLocation"
                  value={formData.ceremonyLocation}
                  onChange={handleChange}
                  placeholder="Ej. Parroquia de San Francisco"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Lugar de Recepción</label>
                <input
                  type="text"
                  name="receptionLocation"
                  value={formData.receptionLocation}
                  onChange={handleChange}
                  placeholder="Ej. Hacienda Los Laureles"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Link de Google Maps</label>
                <input
                  type="url"
                  name="mapsLink"
                  value={formData.mapsLink}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-serif font-semibold text-[var(--color-soft-black)] text-lg">
                Paso 4: Elige un Estilo
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "temp-1", name: "Elegancia Clásica", desc: "Bodas y XV años" },
                  { id: "temp-2", name: "Minimal Moderno", desc: "Corporativos y graduaciones" },
                  { id: "temp-3", name: "Dulce y Tierno", desc: "Baby shower y bautizos" },
                ].map((temp) => (
                  <div
                    key={temp.id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, templateId: temp.id }))
                    }
                    className={`rounded-2xl border p-6 text-center cursor-pointer transition-all ${
                      formData.templateId === temp.id
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)]/5 shadow-sm"
                        : "border-[var(--color-border)] hover:border-[var(--color-gold)]/30"
                    }`}
                  >
                    <div className="h-20 bg-[var(--color-ivory)] rounded-xl flex items-center justify-center mb-3">
                      <Sparkles className={`h-6 w-6 ${formData.templateId === temp.id ? "text-[var(--color-gold)]" : "text-[var(--color-border)]"}`} />
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-soft-black)] font-sans">
                      {temp.name}
                    </span>
                    <p className="text-[10px] text-[var(--color-warm-gray)] mt-1 font-sans">
                      {temp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 text-center py-6">
              <Sparkles className="h-8 w-8 mx-auto text-[var(--color-gold)]" />
              <h3 className="font-serif font-semibold text-[var(--color-soft-black)] text-lg">
                ¡Todo Listo!
              </h3>
              <p className="text-[var(--color-warm-gray)] text-sm max-w-sm mx-auto font-sans">
                Tu evento se publicará con todas las secciones pre-configuradas.
                Podrás personalizar cada sección desde el editor.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border)]">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 text-sm font-semibold text-[var(--color-soft-black)] hover:bg-[var(--color-ivory)] transition-colors font-sans"
              >
                Anterior
              </button>
            ) : (
              <div />
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-gold)] px-5 text-sm font-semibold text-white hover:bg-[var(--color-gold-dark)] transition-colors gap-2 font-sans"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-gold)] px-6 text-sm font-semibold text-white hover:bg-[var(--color-gold-dark)] transition-colors font-sans disabled:opacity-50"
              >
                {isSubmitting ? "Publicando..." : "Publicar Evento"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
