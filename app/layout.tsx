import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Celebra Conmigo — Invitaciones digitales premium para tu evento",
  description:
    "Crea tu invitación digital personalizada con RSVP, mesa de regalos, galería y check-in QR. La plataforma de eventos digitales más completa.",
  keywords: [
    "invitaciones digitales",
    "boda",
    "RSVP",
    "eventos",
    "invitación digital México",
    "celebra conmigo",
  ],
  authors: [{ name: "Celebra Conmigo" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://celebraconmigo.store",
    title: "Celebra Conmigo — Invitaciones digitales premium",
    description:
      "La plataforma de eventos digitales más completa: invitación, RSVP, mesa de regalos, galería y check-in QR.",
    siteName: "Celebra Conmigo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased bg-[var(--color-ivory)] text-[var(--color-soft-black)]">
        {children}
      </body>
    </html>
  );
}
