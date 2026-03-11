import type { Metadata } from "next";
import { playfair, dmSans } from "./fonts";
import AuthProvider from "@/components/providers/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vital Emocion | Bienestar Psicologico",
  description:
    "Tu bienestar emocional comienza aqui. Psicologos profesionales, agendamiento inteligente y recursos para tu salud mental.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
