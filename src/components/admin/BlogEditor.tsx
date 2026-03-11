"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED";
}

interface BlogEditorProps {
  initialData?: BlogFormData & { id: string; authorId?: string };
  mode: "create" | "edit";
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function BlogEditor({ initialData, mode }: BlogEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<BlogFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    status: initialData?.status || "DRAFT",
  });

  // Auto-generate slug from title (only for new posts)
  useEffect(() => {
    if (mode === "create" && form.title) {
      setForm((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [form.title, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/blog"
          : `/api/admin/blog/${initialData?.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          authorId: initialData?.authorId || "system",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar articulo");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-error/10 text-error rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface rounded-xl p-6 shadow-sm space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
            Titulo
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
            placeholder="Titulo del articulo"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-text-primary mb-2">
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={form.slug}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
            placeholder="titulo-del-articulo"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-text-primary mb-2">
            Extracto
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            value={form.excerpt}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors resize-none"
            placeholder="Breve descripcion del articulo..."
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-2">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary outline-none transition-colors"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </div>
      </div>

      {/* Content editor */}
      <div className="bg-surface rounded-xl p-6 shadow-sm">
        <label htmlFor="content" className="block text-sm font-medium text-text-primary mb-2">
          Contenido (Markdown)
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={20}
          value={form.content}
          onChange={handleChange}
          className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-4 text-text-primary placeholder:text-text-muted outline-none transition-colors resize-y font-mono text-sm leading-relaxed"
          placeholder="# Tu articulo aqui&#10;&#10;Escribe el contenido usando Markdown..."
        />
        <p className="text-xs text-text-muted mt-2">
          Soporta Markdown: # titulos, **negrita**, *italica*, - listas, [enlaces](url)
        </p>
      </div>

      {/* Preview link for published posts */}
      {mode === "edit" && form.status === "PUBLISHED" && form.slug && (
        <div className="bg-surface rounded-xl p-4 shadow-sm">
          <p className="text-sm text-text-muted">
            Vista previa:{" "}
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              /blog/{form.slug}
            </a>
          </p>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white rounded-lg px-6 py-2.5 font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : mode === "create" ? "Crear Articulo" : "Guardar Cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="bg-background text-text-secondary rounded-lg px-6 py-2.5 font-medium hover:bg-primary-dark/5 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
