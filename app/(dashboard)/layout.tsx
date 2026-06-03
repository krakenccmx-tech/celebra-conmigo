"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface User {
  name: string;
  email: string;
  role: string;
  plan: string;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/dashboard/admin", label: "Super Admin", icon: Shield, adminOnly: true },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/login");
        return;
      }

      const metadata = authUser.user_metadata;
      setUser({
        email: authUser.email || "",
        name: metadata?.name || authUser.email?.split("@")[0] || "Usuario",
        role: metadata?.role || "client",
        plan: metadata?.plan || "Starter",
      });
    }

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-ivory)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--color-gold)] border-t-transparent animate-spin" />
          <p className="text-xs text-[var(--color-warm-gray)]">Cargando...</p>
        </div>
      </div>
    );
  }

  const filteredNav = navItems.filter(
    (item) => !item.adminOnly || user.role === "superadmin"
  );

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center border-b border-[var(--color-border)] px-6">
        <Link href="/dashboard" className="block">
          <img
            src="/logo mid horizontal.webp"
            alt="Celebra Conmigo"
            className="h-8"
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {filteredNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--color-gold-light)]/20 text-[var(--color-gold-dark)]"
                  : "text-[var(--color-warm-gray)] hover:bg-[var(--color-ivory)] hover:text-[var(--color-soft-black)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--color-border)] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-[var(--color-ivory)] p-3 mb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold)] text-white text-xs font-bold">
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--color-soft-black)] truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-[var(--color-warm-gray)] truncate">
              {user.email}
            </p>
          </div>
          <span className="shrink-0 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-[var(--color-gold-light)]/30 text-[var(--color-gold-dark)] border border-[var(--color-gold-light)]">
            {user.plan}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[var(--color-ivory)] font-sans text-[var(--color-soft-black)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] md:flex">
        {sidebarContent}
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg text-[var(--color-warm-gray)] hover:text-[var(--color-soft-black)] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      <div className="flex flex-col flex-1 md:pl-64">
        <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-warm-gray)] hover:text-[var(--color-soft-black)] md:hidden transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="text-sm font-medium text-[var(--color-warm-gray)]">
              {user.role === "superadmin"
                ? "Modo Administrador"
                : `Plan: ${user.plan}`}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-[var(--color-warm-gray)]">
            <span className="hidden sm:inline">Servidor Operativo</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
