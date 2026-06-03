"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  CheckCircle,
  UserPlus,
  X,
  Lock,
  BarChart3,
  CreditCard,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  createdAt: string;
  _count?: { events: number; payments: number };
}

interface Stats {
  totalUsers: number;
  totalEvents: number;
  publishedEvents: number;
  totalGuests: number;
  totalRsvps: number;
  confirmedRsvps: number;
  totalPayments: number;
}

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New user form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPlan, setNewPlan] = useState("Starter");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadAdmin() {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/users"),
        ]);

        if (statsRes.status === 403 || usersRes.status === 403) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        setIsAuthorized(true);

        if (statsRes.ok) setStats(await statsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
      } catch {
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    loadAdmin();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) return;
    setCreating(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, password: newPassword }),
      });

      if (res.ok) {
        // Update plan
        const data = await res.json();
        if (data.user) {
          await fetch("/api/admin/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: data.user.id, plan: newPlan }),
          });
        }

        // Reload users
        const usersRes = await fetch("/api/admin/users");
        if (usersRes.ok) setUsers(await usersRes.json());

        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setNewPlan("Starter");
        setShowModal(false);
      }
    } catch {
      // handle error
    } finally {
      setCreating(false);
    }
  };

  const handleChangePlan = async (userId: string, plan: string) => {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan }),
    });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan } : u)));
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--color-gold)] border-t-transparent animate-spin" />
          <p className="text-xs text-[var(--color-warm-gray)]">Cargando panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-100">
          <Lock className="h-7 w-7 text-red-400" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-[var(--color-soft-black)]">
          Acceso Denegado
        </h2>
        <p className="text-sm text-[var(--color-warm-gray)] text-center max-w-sm">
          No tienes permisos de administrador para acceder a esta sección.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[var(--color-soft-black)]">
            Panel Super Admin
          </h2>
          <p className="text-sm text-[var(--color-warm-gray)] mt-1">
            Gestiona usuarios, eventos y configuración global del sistema.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-gold)] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-gold-dark)] transition-all gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Crear Usuario
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-warm-gray)]">Usuarios</span>
              <Users className="h-4 w-4 text-[var(--color-warm-gray)]" />
            </div>
            <span className="text-3xl font-bold text-[var(--color-soft-black)]">{stats.totalUsers}</span>
          </div>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-warm-gray)]">Eventos</span>
              <Calendar className="h-4 w-4 text-[var(--color-warm-gray)]" />
            </div>
            <span className="text-3xl font-bold text-[var(--color-soft-black)]">{stats.totalEvents}</span>
            <p className="text-[10px] text-[var(--color-warm-gray)] mt-1">{stats.publishedEvents} publicados</p>
          </div>
          <div className="bg-[var(--color-card)] border border-emerald-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-600">RSVPs</span>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-3xl font-bold text-emerald-700">{stats.confirmedRsvps}</span>
            <p className="text-[10px] text-emerald-600 mt-1">de {stats.totalRsvps} totales</p>
          </div>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-warm-gray)]">Invitados</span>
              <BarChart3 className="h-4 w-4 text-[var(--color-warm-gray)]" />
            </div>
            <span className="text-3xl font-bold text-[var(--color-soft-black)]">{stats.totalGuests}</span>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--color-border)]">
          <h3 className="font-serif text-lg font-semibold text-[var(--color-soft-black)]">
            Usuarios Registrados
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-ivory)] text-[10px] font-medium uppercase tracking-wider text-[var(--color-warm-gray)]">
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Eventos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[var(--color-ivory)]/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[var(--color-soft-black)]">{u.name}</td>
                  <td className="px-6 py-3.5 text-[var(--color-warm-gray)]">{u.email}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      u.role === "superadmin"
                        ? "bg-[var(--color-gold)] text-white border-[var(--color-gold)]"
                        : "bg-[var(--color-ivory)] text-[var(--color-warm-gray)] border-[var(--color-border)]"
                    }`}>
                      {u.role === "superadmin" ? "Admin" : "Cliente"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <select
                      value={u.plan}
                      onChange={(e) => handleChangePlan(u.id, e.target.value)}
                      className="rounded-lg border border-[var(--color-border)] bg-white px-2 py-1 text-xs outline-none focus:border-[var(--color-gold)] transition-all"
                    >
                      <option value="Starter">Starter</option>
                      <option value="Premium">Premium</option>
                      <option value="Business">Business</option>
                    </select>
                  </td>
                  <td className="px-6 py-3.5 text-[var(--color-warm-gray)]">
                    {u._count?.events || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[var(--color-warm-gray)] hover:text-[var(--color-soft-black)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-serif text-xl font-semibold text-[var(--color-soft-black)] mb-1">
              Nuevo Usuario
            </h3>
            <p className="text-xs text-[var(--color-warm-gray)] mb-6">
              Crea una cuenta para un nuevo cliente.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2">Nombre</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej. María López" required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2">Email</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="ejemplo@correo.com" required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2">Contraseña</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2">Plan</label>
                <select value={newPlan} onChange={(e) => setNewPlan(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)] focus:bg-white transition-all">
                  <option value="Starter">Starter</option>
                  <option value="Premium">Premium</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 h-10 rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-warm-gray)] hover:bg-[var(--color-ivory)] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 h-10 rounded-full bg-[var(--color-gold)] text-sm font-semibold text-white hover:bg-[var(--color-gold-dark)] transition-colors disabled:opacity-50">
                  {creating ? "Creando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
