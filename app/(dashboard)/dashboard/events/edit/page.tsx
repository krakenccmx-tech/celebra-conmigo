"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
  GripVertical,
} from "lucide-react";

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

interface EventData {
  id: string;
  title: string;
  slug: string;
  type: string;
  date: string;
  time: string;
  city: string;
  status: string;
  sections?: Section[];
}

const SECTION_LABELS: Record<string, string> = {
  portada: "Portada",
  nombres: "Nombres / Celebrados",
  itinerario: "Itinerario",
  ubicacion: "Ubicación",
  dress_code: "Código de Vestimenta",
  mesa_regalos: "Mesa de Regalos",
  galeria: "Galería",
  rsvp: "Confirmación RSVP",
};

export default function EditEventPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("id") as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    async function loadEvent() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setEvent(data);
        const sortedSections = (data.sections || []).sort(
          (a: Section, b: Section) => a.sortOrder - b.sortOrder
        );
        setSections(sortedSections);
        if (sortedSections.length > 0) setActiveSection(sortedSections[0]);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  const handleToggleActive = (secId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === secId) {
          const updated = { ...s, isActive: !s.isActive };
          if (activeSection?.id === secId) setActiveSection(updated);
          return updated;
        }
        return s;
      })
    );
  };

  const handleContentChange = (content: string) => {
    if (!activeSection) return;
    const updated = { ...activeSection, content };
    setActiveSection(updated);
    setSections((prev) =>
      prev.map((s) => (s.id === activeSection.id ? updated : s))
    );
  };

  const handleImageUrlChange = (url: string) => {
    if (!activeSection) return;
    const updated = { ...activeSection, imageUrl: url || null };
    setActiveSection(updated);
    setSections((prev) =>
      prev.map((s) => (s.id === activeSection.id ? updated : s))
    );
  };

  const handleSave = async () => {
    if (!event) return;
    setSaving(true);

    try {
      await fetch(`/api/events/${eventId}/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
      )
    ) return;

    try {
      await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      router.push("/dashboard");
    } catch {
      // handle error
    }
  };

  const renderSectionEditor = () => {
    if (!activeSection) {
      return (
        <div className="flex-1 flex items-center justify-center text-[var(--color-warm-gray)] text-sm font-sans">
          Selecciona una sección para comenzar a editar.
        </div>
      );
    }

    const isJson = ["itinerario", "dress_code", "mesa_regalos", "galeria"].includes(
      activeSection.type
    );

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-gray)] font-sans">
              Editando
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold-dark)] border border-[var(--color-gold)]/20 uppercase tracking-wider font-sans">
              {activeSection.type.replace("_", " ")}
            </span>
          </div>
          <h3 className="text-xl font-serif font-semibold text-[var(--color-soft-black)] mt-1">
            {SECTION_LABELS[activeSection.type] || activeSection.title}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-gray)] mb-2 font-sans">
              {isJson ? "Datos (formato JSON)" : "Contenido de texto"}
            </label>
            <textarea
              value={activeSection.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={isJson ? 12 : 8}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all resize-none font-mono"
            />
            {isJson && (
              <p className="text-[10px] text-[var(--color-warm-gray)] mt-1 font-sans">
                Edita con cuidado el formato JSON. Los cambios se reflejarán en la invitación pública.
              </p>
            )}
          </div>

          {(activeSection.type === "portada" ||
            activeSection.type === "ubicacion") && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-warm-gray)] mb-2 font-sans">
                {activeSection.type === "portada"
                  ? "URL de imagen de portada"
                  : "Enlace de ubicación (Google Maps)"}
              </label>
              <input
                type="text"
                value={activeSection.imageUrl || ""}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all font-sans"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!eventId) {
    return (
      <div className="flex h-96 items-center justify-center text-[var(--color-warm-gray)] font-sans">
        <p>No se especificó un ID de evento válido.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--color-gold)] border-t-transparent animate-spin" />
          <p className="text-xs text-[var(--color-warm-gray)]">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-96 items-center justify-center text-[var(--color-warm-gray)] font-sans">
        <p>Evento no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-warm-gray)] hover:text-[var(--color-soft-black)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-xl font-serif font-semibold text-[var(--color-soft-black)]">
              {event.title}
            </h2>
            <p className="text-xs text-[var(--color-warm-gray)] mt-1 font-sans">
              Constructor de Invitación · {event.type}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDeleteEvent}
            className="inline-flex h-9 items-center justify-center rounded-full bg-red-50 border border-red-200 px-4 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors gap-2 font-sans"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
          <Link
            href={`/e?slug=${event.slug}`}
            target="_blank"
            className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-4 text-xs font-semibold text-[var(--color-soft-black)] hover:bg-[var(--color-ivory)] transition-colors gap-2 font-sans"
          >
            <Eye className="h-3.5 w-3.5" />
            Vista Previa
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--color-gold)] px-4 text-xs font-semibold text-white hover:bg-[var(--color-gold-dark)] transition-all gap-2 font-sans disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sections List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[var(--color-border)] rounded-3xl p-5 shadow-sm">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--color-warm-gray)] mb-4 font-sans">
              Secciones de la Invitación
            </h3>
            <div className="space-y-2">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => setActiveSection(sec)}
                  className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer border transition-all ${
                    activeSection?.id === sec.id
                      ? "bg-[var(--color-ivory)] border-[var(--color-gold)]/30"
                      : "bg-white border-[var(--color-border)] hover:border-[var(--color-gold)]/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-3.5 w-3.5 text-[var(--color-border)]" />
                    <span
                      className={`text-sm font-medium font-sans ${
                        sec.isActive
                          ? "text-[var(--color-soft-black)]"
                          : "text-[var(--color-warm-gray)] line-through"
                      }`}
                    >
                      {SECTION_LABELS[sec.type] || sec.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleActive(sec.id);
                    }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-sans ${
                      sec.isActive
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-zinc-50 border-zinc-200 text-zinc-400"
                    }`}
                  >
                    {sec.isActive ? "Activo" : "Inactivo"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editing Panel */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-[var(--color-border)] rounded-3xl p-8 shadow-sm min-h-[400px] flex flex-col justify-between">
            {renderSectionEditor()}
            <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex justify-end text-xs text-[var(--color-warm-gray)] font-sans">
              Los cambios se reflejan en la invitación pública al guardar.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
