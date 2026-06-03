"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  Trash,
  Copy,
  Check,
  Download,
  MessageCircle,
  Filter,
} from "lucide-react";

interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string | null;
  phone: string | null;
  maxCompanions: number;
  tableName: string | null;
  token: string;
  rsvpStatus: string;
}

interface EventInfo {
  id: string;
  title: string;
  slug: string;
}

type FilterStatus = "todos" | "confirmado" | "pendiente" | "cancelado";

function GuestsContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id") as string;

  const [event, setEvent] = useState<EventInfo | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("todos");
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [maxCompanions, setMaxCompanions] = useState(0);
  const [tableName, setTableName] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    async function loadData() {
      try {
        const [eventRes, guestsRes] = await Promise.all([
          fetch(`/api/events/${eventId}`),
          fetch(`/api/events/${eventId}/guests`),
        ]);

        if (eventRes.ok) {
          const eventData = await eventRes.json();
          setEvent({ id: eventData.id, title: eventData.title, slug: eventData.slug });
        }

        if (guestsRes.ok) {
          const guestsData = await guestsRes.json();
          setGuests(guestsData);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [eventId]);

  const filteredGuests = useMemo(() => {
    if (activeFilter === "todos") return guests;
    return guests.filter((g) => g.rsvpStatus === activeFilter);
  }, [guests, activeFilter]);

  const guestCounts = useMemo(() => {
    const confirmed = guests.filter((g) => g.rsvpStatus === "confirmado").length;
    const pending = guests.filter((g) => g.rsvpStatus === "pendiente").length;
    const cancelled = guests.filter((g) => g.rsvpStatus === "cancelado").length;
    return { total: guests.length, confirmed, pending, cancelled };
  }, [guests]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setAdding(true);

    try {
      const res = await fetch(`/api/events/${eventId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, maxCompanions, tableName }),
      });

      if (res.ok) {
        const newGuest = await res.json();
        setGuests((prev) => [newGuest, ...prev]);
        setName("");
        setEmail("");
        setPhone("");
        setMaxCompanions(0);
        setTableName("");
      }
    } catch {
      // handle error
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este invitado?")) return;

    try {
      const res = await fetch(`/api/events/${eventId}/guests?guestId=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== id));
      }
    } catch {
      // handle error
    }
  };

  const handleCopyLink = (token: string, guestId: string) => {
    if (!event) return;
    const url = `${window.location.origin}/e?slug=${event.slug}&guestToken=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(guestId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ["Nombre", "Email", "Teléfono", "Mesa", "Acompañantes", "Estado RSVP"];
    const rows = guests.map((g) => [
      g.name,
      g.email || "",
      g.phone || "",
      g.tableName || "",
      String(g.maxCompanions),
      g.rsvpStatus,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob(["﻿" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invitados-${event?.slug || "evento"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleWhatsApp = (guest: Guest) => {
    if (!event || !guest.phone) return;
    const cleanPhone = guest.phone.replace(/[\s()-]/g, "");
    const invitationUrl = `${window.location.origin}/e?slug=${event.slug}&guestToken=${guest.token}`;
    const message = `Hola ${guest.name}!\n\nEstás cordialmente invitado(a) a: ${event.title}\n\nAquí puedes ver tu invitación y confirmar asistencia:\n${invitationUrl}\n\nEsperamos contar contigo!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, "_blank");
  };

  if (!eventId) {
    return (
      <div className="flex h-96 items-center justify-center text-[var(--color-warm-gray)]">
        <p className="text-sm">No se especificó un ID de evento válido.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--color-gold)] border-t-transparent animate-spin" />
        <p className="text-xs text-[var(--color-warm-gray)]">Cargando invitados...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-96 items-center justify-center text-[var(--color-warm-gray)]">
        <p className="text-sm">Evento no encontrado.</p>
      </div>
    );
  }

  const filterButtons: { label: string; value: FilterStatus; color: string }[] = [
    { label: `Todos (${guestCounts.total})`, value: "todos", color: "border-[var(--color-border)] text-[var(--color-soft-black)] bg-[var(--color-card)]" },
    { label: `Confirmados (${guestCounts.confirmed})`, value: "confirmado", color: "border-emerald-200 text-emerald-700 bg-emerald-50" },
    { label: `Pendientes (${guestCounts.pending})`, value: "pendiente", color: "border-amber-200 text-amber-700 bg-amber-50" },
    { label: `Cancelados (${guestCounts.cancelled})`, value: "cancelado", color: "border-red-200 text-red-600 bg-red-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          href={`/dashboard/events/edit?id=${eventId}`}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-warm-gray)] hover:text-[var(--color-soft-black)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-soft-black)]">
            Gestión de Invitados
          </h2>
          <p className="text-xs text-[var(--color-warm-gray)] mt-1">{event.title}</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--color-gold-light)] bg-[var(--color-gold-light)]/10 px-4 text-xs font-semibold text-[var(--color-gold-dark)] hover:bg-[var(--color-gold-light)]/25 transition-colors gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-soft-black)]">{guestCounts.total}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mt-1">Total</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{guestCounts.confirmed}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-600 mt-1">Confirmados</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{guestCounts.pending}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-amber-600 mt-1">Pendientes</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{guestCounts.cancelled}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-red-500 mt-1">Cancelados</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-4">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-[var(--color-gold)]" />
              <h3 className="font-serif text-lg font-semibold text-[var(--color-soft-black)]">
                Agregar Invitado
              </h3>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2">
                  Nombre / Familia
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Familia García Pérez"
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. +52 442..."
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2">
                    Acompañantes
                  </label>
                  <input
                    type="number"
                    value={maxCompanions}
                    onChange={(e) => setMaxCompanions(Number(e.target.value))}
                    min={0}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2">
                    Mesa
                  </label>
                  <input
                    type="text"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder="Mesa 5"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={adding}
                className="w-full inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-gold)] px-4 text-xs font-semibold text-white hover:bg-[var(--color-gold-dark)] transition-colors gap-2 disabled:opacity-50"
              >
                <UserPlus className="h-3.5 w-3.5" />
                {adding ? "Agregando..." : "Agregar Invitado"}
              </button>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-8">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[var(--color-warm-gray)]" />
                  <h3 className="font-semibold text-[var(--color-soft-black)] text-sm">
                    Invitados Registrados
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {filterButtons.map((btn) => (
                    <button
                      key={btn.value}
                      onClick={() => setActiveFilter(btn.value)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${
                        activeFilter === btn.value
                          ? btn.color + " ring-1 ring-offset-1 ring-[var(--color-gold-light)]"
                          : "border-[var(--color-border)] text-[var(--color-warm-gray)] bg-transparent hover:bg-[var(--color-ivory)]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredGuests.length === 0 ? (
              <div className="p-12 text-center text-[var(--color-warm-gray)]">
                <p className="text-sm">
                  {activeFilter === "todos"
                    ? "No hay invitados registrados para este evento."
                    : `No hay invitados con estado "${activeFilter}".`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-ivory)] text-[10px] font-medium uppercase tracking-wider text-[var(--color-warm-gray)]">
                      <th className="px-5 py-3">Nombre</th>
                      <th className="px-5 py-3">Mesa</th>
                      <th className="px-5 py-3">Acomp.</th>
                      <th className="px-5 py-3">RSVP</th>
                      <th className="px-5 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {filteredGuests.map((g) => (
                      <tr key={g.id} className="hover:bg-[var(--color-ivory)]/40 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-[var(--color-soft-black)]">{g.name}</p>
                          {g.email && (
                            <p className="text-[10px] text-[var(--color-warm-gray)] mt-0.5">{g.email}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-[var(--color-warm-gray)]">{g.tableName || "General"}</td>
                        <td className="px-5 py-3.5 text-[var(--color-warm-gray)] text-center">{g.maxCompanions}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                              g.rsvpStatus === "confirmado"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : g.rsvpStatus === "cancelado"
                                  ? "bg-red-50 border-red-200 text-red-600"
                                  : "bg-amber-50 border-amber-200 text-amber-700"
                            }`}
                          >
                            {g.rsvpStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyLink(g.token, g.id)}
                              title="Copiar Link"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-ivory)] text-[var(--color-warm-gray)] hover:text-[var(--color-soft-black)] transition-colors"
                            >
                              {copiedId === g.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                            {g.phone && (
                              <button
                                onClick={() => handleWhatsApp(g)}
                                title="Enviar por WhatsApp"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteGuest(g.id)}
                              title="Eliminar"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-red-50 text-[var(--color-warm-gray)] hover:text-red-600 transition-colors"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GuestsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--color-gold)] border-t-transparent animate-spin" />
          <p className="text-xs text-[var(--color-warm-gray)]">Cargando...</p>
        </div>
      }
    >
      <GuestsContent />
    </Suspense>
  );
}
