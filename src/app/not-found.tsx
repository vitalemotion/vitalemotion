import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="font-serif text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 font-serif text-2xl text-text-primary">
        Pagina no encontrada
      </h2>
      <p className="mt-2 max-w-md text-text-secondary">
        Lo sentimos, la pagina que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
