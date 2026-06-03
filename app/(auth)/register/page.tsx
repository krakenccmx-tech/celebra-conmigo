"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-4">
          <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-semibold text-[var(--color-soft-black)] mb-2">
          Cuenta creada
        </h2>
        <p className="text-sm text-[var(--color-warm-gray)] mb-6">
          Revisa tu correo electrónico para confirmar tu cuenta. Después podrás iniciar sesión.
        </p>
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-gold)] px-6 text-sm font-semibold text-white hover:bg-[var(--color-gold-dark)] transition-colors"
        >
          Ir a Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-[var(--color-soft-black)] mb-2 text-center">
        Crear Cuenta
      </h2>
      <p className="text-sm text-[var(--color-warm-gray)] mb-8 text-center">
        Empieza a crear invitaciones digitales para tus eventos.
      </p>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium uppercase tracking-wider text-[var(--color-warm-gray)] mb-2"
          >
            Nombre Completo
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-ivory)]/50 px-4 py-2.5 text-sm text-[var(--color-soft-black)] outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold-light)] focus:bg-white transition-all placeholder:text-[var(--color-warm-gray)]/50"
            placeholder="Tu nombre"
            required
          />
        </div>

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
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
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
          {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <div className="relative my-8 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border)]" />
        </div>
        <span className="relative bg-white px-4 text-xs text-[var(--color-warm-gray)]">
          ¿Ya tienes cuenta?
        </span>
      </div>

      <Link
        href="/login"
        className="w-full inline-flex h-10 items-center justify-center rounded-full border border-[var(--color-gold-light)] bg-[var(--color-gold-light)]/10 text-xs font-semibold text-[var(--color-gold-dark)] hover:bg-[var(--color-gold-light)]/25 transition-colors"
      >
        Iniciar Sesión
      </Link>
    </div>
  );
}
