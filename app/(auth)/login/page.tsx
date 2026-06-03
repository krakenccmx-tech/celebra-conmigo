"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-[var(--color-soft-black)] mb-2 text-center">
        Bienvenido
      </h2>
      <p className="text-sm text-[var(--color-warm-gray)] mb-8 text-center">
        Administra tus eventos e invitaciones digitales.
      </p>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2"
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2.5 text-sm text-[var(--color-soft-black)] outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold-light)] focus:bg-white transition-all placeholder:text-[var(--color-warm-gray)]/50"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2.5 pr-11 text-sm text-[var(--color-soft-black)] outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold-light)] focus:bg-white transition-all placeholder:text-[var(--color-warm-gray)]/50"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-warm-gray)] hover:text-[var(--color-soft-black)] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-gold)] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-gold-dark)] transition-colors disabled:opacity-50 gap-2"
        >
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <div className="relative my-8 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border)]" />
        </div>
        <span className="relative bg-white px-4 text-xs text-[var(--color-warm-gray)]">
          ¿No tienes cuenta?
        </span>
      </div>

      <Link
        href="/register"
        className="w-full inline-flex h-10 items-center justify-center rounded-full border border-[var(--color-gold-light)] bg-[var(--color-gold-light)]/10 text-xs font-semibold text-[var(--color-gold-dark)] hover:bg-[var(--color-gold-light)]/25 transition-colors"
      >
        Crear Cuenta Gratis
      </Link>

      {/* Demo Access */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border)]" />
        </div>
        <span className="relative bg-white px-4 text-[10px] uppercase tracking-wider text-[var(--color-warm-gray)]">
          Acceso rápido demo
        </span>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => { setEmail("demo@celebraconmigo.store"); setPassword("Demo2026!"); }}
          className="w-full inline-flex h-9 items-center justify-center rounded-full border border-[var(--color-border)] text-xs font-medium text-[var(--color-warm-gray)] hover:bg-[var(--color-ivory)] hover:text-[var(--color-soft-black)] transition-colors"
        >
          Entrar como Cliente Demo
        </button>
        <button
          type="button"
          onClick={() => { setEmail("admin@celebraconmigo.store"); setPassword("Admin2026!"); }}
          className="w-full inline-flex h-9 items-center justify-center rounded-full border border-[var(--color-border)] text-xs font-medium text-[var(--color-warm-gray)] hover:bg-[var(--color-ivory)] hover:text-[var(--color-soft-black)] transition-colors"
        >
          Entrar como Super Admin
        </button>
      </div>
    </div>
  );
}
