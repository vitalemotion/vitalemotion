"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  type: "DIGITAL" | "PHYSICAL";
  category: string;
  tags: string[];
  stock: number | null;
  isActive: boolean;
}

interface ProductFormProps {
  initialData?: ProductFormData & { id: string };
  mode: "create" | "edit";
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const categories = ["Libros", "Digital", "Materiales"];

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    type: initialData?.type || "PHYSICAL",
    category: initialData?.category || "Libros",
    tags: initialData?.tags || [],
    stock: initialData?.stock ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  // Auto-generate slug from name (only for new products)
  useEffect(() => {
    if (mode === "create" && form.name) {
      setForm((prev) => ({ ...prev, slug: generateSlug(prev.name) }));
    }
  }, [form.name, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${initialData?.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          stock: form.type === "PHYSICAL" ? form.stock : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar producto");
      }

      router.push("/admin/productos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-6 shadow-sm space-y-6 max-w-2xl">
      {error && (
        <div className="bg-error/10 text-error rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
          Nombre del producto
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
          placeholder="Ej: Diario de Emociones"
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
          placeholder="diario-de-emociones"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
          Descripcion
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors resize-none"
          placeholder="Descripcion del producto..."
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-text-primary mb-2">
          Precio (COP)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          required
          min={0}
          value={form.price}
          onChange={handleChange}
          className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
        />
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-text-primary mb-2">
          Tipo
        </label>
        <select
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary outline-none transition-colors"
        >
          <option value="PHYSICAL">Fisico</option>
          <option value="DIGITAL">Digital</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-2">
          Categoria
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary outline-none transition-colors"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Etiquetas
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-primary-dark"
              >
                x
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1 bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
            placeholder="Agregar etiqueta..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-primary/10 text-primary rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Stock — only for PHYSICAL */}
      {form.type === "PHYSICAL" && (
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-text-primary mb-2">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min={0}
            value={form.stock ?? 0}
            onChange={handleChange}
            className="w-full bg-background border border-transparent focus:border-primary rounded-lg p-3 text-text-primary placeholder:text-text-muted outline-none transition-colors"
          />
        </div>
      )}

      {/* isActive toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            form.isActive ? "bg-primary" : "bg-text-muted/30"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              form.isActive ? "translate-x-6" : ""
            }`}
          />
        </button>
        <span className="text-sm text-text-primary">
          {form.isActive ? "Producto activo" : "Producto inactivo"}
        </span>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white rounded-lg px-6 py-2.5 font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : mode === "create" ? "Crear Producto" : "Guardar Cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/productos")}
          className="bg-background text-text-secondary rounded-lg px-6 py-2.5 font-medium hover:bg-primary-dark/5 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
