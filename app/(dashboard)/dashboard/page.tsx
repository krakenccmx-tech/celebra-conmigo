"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
} from "lucide-react";

interface EventData {
  id: string;
  title: string;
  slug: string;
  type: string;
  date: string;
  time: string;
  city: string;
  status: string;
  _count?: { guests: number; rsvps: number };
}

export default function DashboardPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    declined: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setEvents(data);

        // Load guest stats for all events
        let total = 0;
        let confirmed = 0;
        let pending = 0;
        let declined = 0;

        for (const event of data) {
          const gRes = await fetch(`/api/events/${event.id}/guests`);
          if (gRes.ok) {
            const guests = await gRes.json();
            total += guests.length;
            confirmed += guests.filter((g: { rsvpStatus: string }) => g.rsvpStatus === "confirmado").length;
            declined += guests.filter((g: { rsvpStatus: string }) => g.rsvpStatus === "cancelado").length;
          }
        }
        pending = total - confirmed - declined;
        setStats({ total, confirmed, pending, declined });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--color-gold)] border-t-transparent animate-spin" />
          <p className="text-xs text-[var(--color-warm-gray)]">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[var(--color-soft-black)]">
            Mis Eventos
          </h2>
          <p className="text-sm text-[var(--color-warm-gray)] mt-1">
            Crea, edita y gestiona las invitaciones de tus eventos sociales.
          </p>
        </div>
        <Link
          href="/dashboard/events/create"
          className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-gold)] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-gold-dark)] transition-all gap-2"
        >
          <Plus className="h-4 w-4" />
          Crear Evento
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-warm-gray)]">
              Total Invitados
            </span>
            <Users className="h-4 w-4 text-[var(--color-warm-gray)]" />
          </div>
          <span className="text-3xl font-bold text-[var(--color-soft-black)]">
            {stats.total}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-emerald-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-600">
              Confirmados
            </span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-3xl font-bold text-emerald-700">
            {stats.confirmed}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-amber-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-amber-600">
              Pendientes
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-3xl font-bold text-amber-700">
            {stats.pending}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-red-500">
              No Asistirán
            </span>
            <XCircle className="h-4 w-4 text-red-400" />
          </div>
          <span className="text-3xl font-bold text-red-600">
            {stats.declined}
          </span>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--color-border)]">
          <h3 className="font-serif text-xl font-semibold text-[var(--color-soft-black)]">
            Listado de Eventos
          </h3>
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-10 w-10 mx-auto text-[var(--color-warm-gray)]/30 mb-4" />
            <p className="text-sm text-[var(--color-warm-gray)]">
              No tienes eventos creados todavía.
            </p>
            <Link
              href="/dashboard/events/create"
              className="mt-4 inline-flex text-xs font-semibold text-[var(--color-gold-dark)] hover:underline"
            >
              Crea tu primer evento ahora
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-[var(--color-ivory)]/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-gold-light)]/20 text-[var(--color-gold-dark)]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-soft-black)] text-base">
                      {event.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--color-warm-gray)]">
                        {event.type}
                      </span>
                      <span className="text-[var(--color-border)]">·</span>
                      <span className="text-xs text-[var(--color-warm-gray)]">
                        {formatDate(event.date)}
                      </span>
                      <span className="text-[var(--color-border)]">·</span>
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--color-warm-gray)]">
                        <MapPin className="h-3 w-3" />
                        {event.city}
                      </span>
                    </div>
                    <span
                      className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        event.status === "published"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}
                    >
                      {event.status === "published" ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/e?slug=${event.slug}`}
                    target="_blank"
                    className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 text-xs font-semibold text-[var(--color-warm-gray)] hover:text-[var(--color-soft-black)] hover:border-[var(--color-gold-light)] transition-colors"
                  >
                    Ver Invitación
                  </Link>
                  <Link
                    href={`/dashboard/events/edit?id=${event.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--color-gold)] px-4 text-xs font-semibold text-white hover:bg-[var(--color-gold-dark)] transition-colors"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/dashboard/events/guests?id=${event.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--color-gold-light)] bg-[var(--color-gold-light)]/10 px-4 text-xs font-semibold text-[var(--color-gold-dark)] hover:bg-[var(--color-gold-light)]/25 transition-colors"
                  >
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    Invitados
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
