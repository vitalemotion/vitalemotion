import { isSanityConfigured } from "@/sanity/env";
import StudioClient from "./StudioClient";

export const metadata = {
  referrer: "same-origin",
  robots: "noindex",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AdminContentStudioPage() {
  if (!isSanityConfigured()) {
    return (
      <div className="bg-surface rounded-2xl border border-secondary/60 p-8">
        <h1 className="font-serif text-2xl text-text-primary">
          Sanity no esta configurado
        </h1>
        <p className="mt-3 text-text-secondary">
          Agrega `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET`
          en tu entorno para habilitar el studio.
        </p>
      </div>
    );
  }

  return (
    <div className="-m-6 min-h-[calc(100vh-4rem)] lg:-m-8">
      <StudioClient />
    </div>
  );
}
