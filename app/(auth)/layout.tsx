import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-ivory)] flex flex-col items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <img src="/logo mid horizontal.webp" alt="Celebra Conmigo" className="h-12 mx-auto" />
          </Link>
        </div>
        <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-sm p-8">
          {children}
        </div>
        <p className="text-center text-xs text-[var(--color-warm-gray)] mt-8">
          © {new Date().getFullYear()} Celebra Conmigo. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
