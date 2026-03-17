import Link from "next/link";

export default function AdminBlogPage() {
  return (
    <div className="bg-surface rounded-2xl border border-secondary/60 p-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl text-text-primary">Blog</h1>
          <p className="text-text-secondary mt-2 max-w-2xl">
            El contenido editorial ahora se gestiona desde Sanity Studio para
            unificar blog, homepage y paginas de marca en un solo lugar.
          </p>
        </div>
        <Link
          href="/admin/contenido"
          className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Abrir Sanity Studio
        </Link>
      </div>
    </div>
  );
}
